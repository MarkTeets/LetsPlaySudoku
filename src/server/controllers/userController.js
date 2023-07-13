const models = {};
models.User = require('../models/userModel');
// models.Puzzle = require('../models/puzzleModel');

const bcrypt = require('bcryptjs');
const saltRound = 10;

// Helper function: createErr will return an object formatted for the global error handler
const controllerErrorMaker = require('../utils/controllerErrorMaker');
const createErr = controllerErrorMaker('userController');

const userController = {};

//--- GET USER --------------------------------------------------------------------------------------------------------------------
userController.getUser = async (req, res, next) => {
  const { username } = req.body;

  // In the case of delete-session, we want the username specifically, not the cookies
  // In the case of resume-session, username will be undefined and we'll want userId from the cookies
  let userId;
  if (username === undefined) {
    userId = req.cookies.ssid;
  }

  // check to see if username was in request body
  if (username === undefined && userId === undefined) {
    return next(createErr({
      method: 'getUser',
      overview: 'problem retrieving user from request body or userId from cookies',
      status: 400,
      err: 'username wasn\'t included in request body or userId wasn\'t included in cookies'
    }));
  }

  // retreive associated data from database
  try {
    // add whatever is found to res.locals. If nothing is found, null will be returned
    res.locals.userDocument = await models.User.findOne({ $or: [{ username }, { _id: userId }] }).exec();
    
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


// CLEAN USER -------------------------------------------------------------------------------------------------------------
userController.cleanUser = async (req, res, next) => {

  // if userDocument was found via getUser, extract relevant properties from the immutable returned Mongo document
  // and send it to next middleware via res.locals.frontendData

  if (res.locals.status === 'validUser' && res.locals.userDocument !== null) {
    const user = res.locals.userDocument;

    // It'll be easier on the frontend to organize "allPuzzles" as an object with the keys being the number of the puzzle
    // I could convert the mongo document to hold a map of puzzle objects, but then they'd have to have dynamic keys based on
    // the puzzle number and I'd need to use a Map. For now I'll just store them in arrays to avoid dynamic keys
  
    const allPuzzles = {};

    for (const puzzleObj of user.allPuzzles) {
      allPuzzles[puzzleObj.puzzleNumber] = {
        puzzleNumber: puzzleObj.puzzleNumber,
        progress: puzzleObj.progress
      }; 
    }

    res.locals.frontendData = {
      status: 'valid',
      user: {
        username: user.username,
        displayName: user.displayName,
        lastPuzzleNumber: user.lastPuzzleNumber,
        allPuzzles
      }
    };
  }

  return next();
};


// CREATE USER -------------------------------------------------------------------------------------------------------------
userController.createUser = async (req, res, next) => {

  // if userDocument on res.locals is not null, send frontendData object with status to frontend
  if (res.locals.userDocument !== null) {
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
    
    // create user with document, reassign res.locals.userDocument with created document
    res.locals.userDocument = await models.User.create(document);
    
    // set res.locals.status so cleanUser will process the userDocument for the frontend
    res.locals.status = 'validUser';

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
  // if userDocument on res.locals is null, send frontendData object with status to frontend
  if (res.locals.userDocument === null) {
    res.locals.frontendData = { status: 'userNotFound' };
    return next();
  }

  //otherwise:
  // extract info from request
  const { password } = req.body;

  try {
    // if password isn't a match, send frontendData object with status to frontend
    if (!bcrypt.compareSync(password, res.locals.userDocument.password)) {
      res.locals.frontendData = { status: 'incorrectPassword' };
      return next();
    }

    // set res.locals.status so cleanUser will process the userDocument for the frontend
    res.locals.status = 'validUser';

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
  if (res.locals.userDocument === null) {
    res.locals.frontendData = { status: 'userNotFound' };
    return next();
  }
  
  let { puzzleNumber } = req.body;
  const { progress } = req.body;

  if (puzzleNumber === undefined || progress === undefined ) {
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
    for (const index in res.locals.userDocument.allPuzzles) {
      if (puzzleNumber === res.locals.userDocument.allPuzzles[index].puzzleNumber) {
        currentPuzzleIndex = index;
        break;
      }
    }

    if (currentPuzzleIndex !== null) {
      // If the user already has saved progress for that puzzle, update it to the new progress value 
      res.locals.userDocument.allPuzzles[currentPuzzleIndex].progress = progress;

    } else {
      // If this is the first time a puzzle is being saved to a user: 
      // Make the puzzle object to push it to the user's array
      const puzzleObj = {
        puzzleNumber,
        progress,
      };

      res.locals.userDocument.allPuzzles.push(puzzleObj);
    }

    res.locals.userDocument.lastPuzzleNumber = puzzleNumber;

    const updatedUser = await res.locals.userDocument.save();
    
    // I'm not going to send back the whole user, I'll only send whether or not it was succesful. 
    // As the user object gets bigger via more and more puzzles, this will be more efficient
    res.locals.frontendData = { status: 'valid' };

    return next();
    
  } catch (err) {
    return next(createErr({
      method: 'savePuzzle',
      overview: `problem saving progress to ${res.locals.userDocument.username}'s allPuzzles array`,
      status: 500,
      err
    }));
  }
};


module.exports = userController;