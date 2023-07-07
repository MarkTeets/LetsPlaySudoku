const bcrypt = require('bcryptjs');
const saltRound = 10;
const models = {};
models.User = require('../models/userModel');
// models.Puzzle = require('../models/puzzleModel');

const userController = {};


// Returns an object with the relevant properties from an immutable returned Mongo document 
const cleanUser = (user) => {
  // It'll be easier on the frontend to organize "allPuzzles" as an object with the keys being the number of the puzzle
  // once useReducer/useContext holds a current puzzle number as the way a current puzzle is produced.
  const allPuzzles = {};

  for (const puzzleObj of user.allPuzzles) {
    allPuzzles[puzzleObj.puzzleNumber] = {
      puzzleNumber: puzzleObj.puzzleNumber,
      progress: puzzleObj.progress
    }; 
  }

  return {
    status: 'valid',
    user: {
      username: user.username,
      displayName: user.displayName,
      lastPuzzleNumber: user.lastPuzzleNumber,
      allPuzzles
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
      overview: 'problem retrieving user from request body',
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
      overview: 'problem retrieving user from database',
      status: 500,
      err
    }));
  }
};

// CREATE USER -------------------------------------------------------------------------------------------------------------
userController.createUser = async (req, res, next) => {

  // if foundUser on res.locals is not null, send frontendData object with status to frontend
  if (res.locals.foundUser !== null) {
    res.locals.frontendData = { status: 'userNameExists' };
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
      overview: 'problem extracting username, password, or displayName from request body',
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
    // Prepare a frontendData object including only the necessary props to send to the frontend
    res.locals.frontendData = cleanUser(createdUser);
    // console.log('createUser res.locals.frontendData:', res.locals.frontendData);
    return next();

  } catch (err) {
    return next(createErr({
      method: 'createUser',
      overview: 'problem either hashing password or creating user in database',
      status: 500,
      err
    }));
  }
};


// VERIFY USER LOGIN --------------------------------------------------------------------------------------------
userController.verifyUser = async (req, res, next) => {
  // if foundUser on res.locals is null, send frontendData object with status to frontend
  if (res.locals.foundUser === null) {
    res.locals.frontendData = { status: 'userNotFound' };
    return next();
  }

  //otherwise:
  // extract info from request
  const { password } = req.body;

  try {
    // if password isn't a match, send frontendData object with status to frontend
    if (!bcrypt.compareSync(password, res.locals.foundUser.password)) {
      res.locals.frontendData = { status: 'incorrectPassword' };
      return next();
    }

    // Prepare a frontendData object including only the necessary props to send to the frontend
    res.locals.frontendData = cleanUser(res.locals.foundUser);
    // console.log('verifyUser res.locals.frontendData:', res.locals.frontendData);

    return next();

  } catch (err) {
    return next(createErr({
      method: 'verifyUser',
      overview: 'problem comparing hashed password',
      status: 500,
      err
    }));
  }
};



// SAVE PUZZLE -----------------------------------------------------------------------------------------------------
// I may switch the entire schema set-up to include puzzle objects, including a Map of said objects in the User schema

userController.savePuzzle = async (req, res, next) => {
  // Make sure getUser found the user
  if (res.locals.foundUser === null) {
    res.locals.frontendData = { status: 'userNotFound' };
    return next();
  }
  
  let { puzzleNumber } = req.body;
  const { progress } = req.body;

  if (puzzleNumber === undefined || progress === undefined ) {
    // if (puzzleNumber === undefined || progress === undefined || puzzleId === undefined ) {
    return next(createErr({
      method: 'savePuzzle',
      overview: 'problem extractinging puzzle info from req.body',
      status: 500,
      err: 'puzzleNumber and/or progress was undefined'
    }));
  }

  puzzleNumber = Number(puzzleNumber);

  let currentPuzzleIndex = null;

  try {
    // I can refactor this if I make the user allPuzzles property a map. I could also make a schema 
    // for the userPuzzleObjects if I wanted to be specific about it. Or I could just leave the array.
    for (const index in res.locals.foundUser.allPuzzles) {
      if (puzzleNumber === res.locals.foundUser.allPuzzles[index].puzzleNumber) {
        currentPuzzleIndex = index;
        break;
      }
    }

    if (currentPuzzleIndex !== null) {
      // If the user already has saved progress for that puzzle, update it to the new progress value 
      res.locals.foundUser.allPuzzles[currentPuzzleIndex].progress = progress;

    } else {
      // If this is the first time a puzzle is being saved to a user: 
      // Make the puzzle object to push it to the user's array
      const puzzleObj = {
        puzzleNumber,
        progress,
      };

      res.locals.foundUser.allPuzzles.push(puzzleObj);
    }

    res.locals.foundUser.lastPuzzleNumber = puzzleNumber;

    const updatedUser = await res.locals.foundUser.save();
    // console.log('updatedUser', updatedUser);
    
    // I'm not going to send back the whole user, I'll only send whether or not it was succesful. 
    // As the user object gets bigger via more and more puzzles, this will be more efficient
    res.locals.frontendData = { status: 'valid' };

    return next();
    
  } catch (err) {
    return next(createErr({
      method: 'savePuzzle',
      overview: `problem saving progress to ${res.locals.foundUser.username}'s allPuzzles array`,
      status: 500,
      err
    }));
  }
};


module.exports = userController;


// Error generation helper function
const createErr = ({ method, overview, status, err }) => {
  const errorObj = {
    log: `userController.${method} ${overview}: ERROR: ${typeof err === 'object' ? err.message : err}`,
    message: { err: `Error occurred in userController.${method}. Check server logs for more details.` }
  };
  if (status) {
    errorObj.status = status;
  }
  return errorObj;
};