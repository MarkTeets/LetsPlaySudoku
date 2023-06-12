const bcrypt = require('bcryptjs');
const saltRound = 10;
const models = {};
models.User = require('../models/userModel');
// models.Puzzle = require('../models/puzzleModel');

const userController = {};


// Returns an object with the relevant properties from an immutable returned Mongo document 
const cleanUser = (user) => {
  return {
    status: 'valid',
    user: {
      username: user.username,
      displayName: user.displayName,
      allPuzzles: user.allPuzzles
    }
  };
};

// GET USER --------------------------------------------------------------------------------------------------------------------
userController.getUser = async (req, res, next) => {
  // extract info from request (username)
  const { username } = req.body;
  // check to see if username was in request body
  if (username === undefined) {
    return next(createErr({
      method: 'getUser',
      type: 'problem retrieving user from request body',
      status: 400,
      err: 'username wasn\'t included in request body'
    }));
  }

  // retreive associated data from database
  try {
    // add whatever is found to res.locals. If nothing is found, null will be returned
    res.locals.foundUser = await models.User.findOne({ username }).exec();
    return next();

  } catch (err) {
    return next(createErr({
      method: 'getUser',
      type: 'problem retrieving user from database',
      status: 500,
      err
    }));
  }
};

// CREATE USER -------------------------------------------------------------------------------------------------------------
userController.createUser = async (req, res, next) => {

  // if foundUser on res.locals is not null, send frontendUser object with status to frontend
  if (res.locals.foundUser !== null) {
    res.locals.frontendUser = { status: 'userNameExists' };
    return next();
  }

  //otherwise:
  // extract info from request
  const {
    username,
    password,
    displayName
  } = req.body;

  // It should be impossible for this if statement to be entered based on the frontend (SignUp.jsx)
  // if username or password isn't on the request, send an error to the global handler
  if (username === undefined || password === undefined) {
    return next(createErr({
      method: 'createUser',
      type: 'problem extracting username, password, or displayName from request body',
      status: 400,
      err: 'username, password, or displayName wasn\'t included in request body'
    }));
  }
  
  try {
  // Make a document to add to the user collection with a hashed password and displayName as username if no username was provided
    const document = {
      username,
      password: bcrypt.hashSync(password, saltRound),
      displayName: (displayName !== undefined) ? displayName: username
    };

    // create user with document
    // assign createdUser to res.locals
    const createdUser = await models.User.create(document);
    // Prepare a frontendUser object including only the necessary props to send to the frontend
    res.locals.frontendUser = cleanUser(createdUser);
    // console.log('createUser res.locals.frontendUser:', res.locals.frontendUser);
    return next();

  } catch (err) {
    return next(createErr({
      method: 'createUser',
      type: 'problem either hashing password or creating user in database',
      status: 500,
      err
    }));
  }
};


// VERIFY USER LOGIN --------------------------------------------------------------------------------------------
userController.verifyUser = async (req, res, next) => {
  // if foundUser on res.locals is null, send frontendUser object with status to frontend
  if (res.locals.foundUser === null) {
    res.locals.frontendUser = { status: 'userNotFound' };
    return next();
  }

  //otherwise:
  // extract info from request
  const { password } = req.body;

  try {
    // if password isn't a match, send frontendUser object with status to frontend
    if (!bcrypt.compareSync(password, res.locals.foundUser.password)) {
      res.locals.frontendUser = { status: 'incorrectPassword' };
      return next();
    }

    // Prepare a frontendUser object including only the necessary props to send to the frontend
    res.locals.frontendUser = cleanUser(res.locals.foundUser);
    // console.log('verifyUser res.locals.frontendUser:', res.locals.frontendUser);
    return next();

  } catch (err) {
    return next(createErr({
      method: 'verifyUser',
      type: 'problem comparing hashed password',
      status: 500,
      err
    }));
  }
};


// SAVE PUZZLE -----------------------------------------------------------------------------------------------------

// I'll eventually need to change this to not just push every time, but update a puzzle if it's already in the array.
// I have to decide whether to do this in the front or in the back. I think it makes more sense to do this back here.
// There are arguments for each

userController.savePuzzle = async (req, res, next) => {
  // Make sure getUser found the user
  if (res.locals.foundUser === null) {
    res.locals.frontendUser = { status: 'userNotFound' };
    return next();
  }
  
  // Make the puzzle object to push and save to the user's array
  const puzzleObj = {
    puzzle: req.body.puzzleId,
    progress: req.body.puzzleString
  };

  // Push puzzle object to the users array and save it
  try {
    res.locals.foundUser.allPuzzles.push(puzzleObj);
    const updatedUser = await res.locals.foundUser.save();
    // Send the user with the new array back to the frontend
    res.locals.frontendUser = cleanUser(updatedUser);
    // console.log('savePuzzle res.locals.frontendUser:', res.locals.frontendUser);

  } catch (err) {
    return next(createErr({
      method: 'savePuzzle',
      type: `problem pushing puzzle to ${res.locals.foundUser.username}'s allPuzzles array`,
      status: 500,
      err
    }));
  }
};


module.exports = userController;


// Error generation helper function
const createErr = ({ method, type, status, err }) => {
  const errorObj = {
    log: `userController.${method} ${type}: ERROR: ${typeof err === 'object' ? err.message : err}`,
    message: { err: `Error occurred in userController.${method}. Check server logs for more details.` }
  };
  if (status) {
    errorObj.status = status;
  }
  return errorObj;
};