// Models
import UserModel from '../models/userModel';
const models = { UserModel };

// Bcrypt
import bcrypt from 'bcryptjs';
const saltRound = 10;

// Types
import { RequestHandler } from 'express';
import { UserPuzzleObj, AllPuzzles, SignInResponse } from '../../types';
import { UserController, CustomErrorGenerator, UserDocument, BackendStatus } from '../backendTypes';

// Helper function: createErr will return an object formatted for the global error handler
import controllerErrorMaker from '../utils/controllerErrorMaker';
const createErr: CustomErrorGenerator = controllerErrorMaker('userController');

//---GET USER --------------------------------------------------------------------------------------
const getUser: RequestHandler = async (req, res, next) => {
  const { username } = req.body;

  // In the case of delete-session, we want the username specifically, not the cookies
  // In the case of resume-session, username will be undefined and we'll want userId from cookies
  let userId;
  if (typeof username !== 'string') {
    userId = req.cookies.ssid;
  }

  // Make sure there's at least one form of valid identification for user
  if (typeof username !== 'string' && typeof userId !== 'string') {
    return next(
      createErr({
        method: 'getUser',
        overview: 'problem retrieving user from request body or userId from cookies',
        status: 400,
        err: "username wasn't included in request body and userId wasn't included in cookies"
      })
    );
  }

  // retrieve associated data from database
  try {
    // add whatever is found to res.locals. If nothing is found, null will be returned
    res.locals.userDocument = await models.UserModel.findOne({
      $or: [{ username }, { _id: userId }]
    }).exec();

    return next();
  } catch (err) {
    return next(
      createErr({
        method: 'getUser',
        overview: 'problem retrieving user from database',
        status: 500,
        err
      })
    );
  }
};

//---CLEAN USER ------------------------------------------------------------------------------------
const cleanUser: RequestHandler = async (req, res, next) => {
  // if userDocument was found via getUser, extract relevant properties from the immutable returned
  // Mongo document and send it to next middleware via res.locals.frontendData

  if (res.locals.status === 'validUser' && res.locals.userDocument !== null) {
    const userDocument: UserDocument = res.locals.userDocument;

    // It'll be easier on the frontend to organize "allPuzzles" as an object with the keys being the
    // number of the puzzle. I could convert the mongo document to hold a map of puzzle objects, but
    // then they'd have to have dynamic keys based on the puzzle number and I'd need to use a Map.
    // For now I'll just store them in arrays to avoid dynamic keys

    const allPuzzles: AllPuzzles = {};

    for (const puzzleObj of userDocument.allPuzzles) {
      allPuzzles[puzzleObj.puzzleNumber] = {
        puzzleNumber: puzzleObj.puzzleNumber,
        progress: puzzleObj.progress,
        pencilProgress: puzzleObj.pencilProgress
      };
    }

    res.locals.frontendData = {
      status: 'valid',
      user: {
        username: userDocument.username,
        displayName: userDocument.displayName,
        lastPuzzle: userDocument.lastPuzzle,
        allPuzzles
      }
    } as SignInResponse;
  }

  return next();
};

//---CREATE USER -----------------------------------------------------------------------------------
const createUser: RequestHandler = async (req, res, next) => {
  // if userDocument on res.locals is not null, send frontendData object with status to frontend
  if (res.locals.userDocument !== null) {
    res.locals.frontendData = { status: 'userNameExists' } as SignInResponse;
    return next();
  }

  //otherwise:
  // extract info from request
  const { username, password, displayName } = req.body;

  // It should be impossible for this if statement to be entered based on the frontend (SignUp.jsx)
  // if username or password isn't on the request, send an error to the global handler
  if (typeof username !== 'string' || typeof password !== 'string') {
    return next(
      createErr({
        method: 'createUser',
        overview: 'problem extracting username, password, or displayName from request body',
        status: 400,
        err: "username, password, or displayName wasn't included in request body"
      })
    );
  }

  try {
    // Make a document to add to the user collection with a hashed password and displayName as
    // username if no username was provided
    const document = {
      username,
      password: bcrypt.hashSync(password, saltRound) as string,
      displayName: typeof displayName === 'string' ? displayName : username
    };

    // create user with document, reassign res.locals.userDocument with created document
    // Don't need to make sure it's not null, an unsuccessful create/save will return an error
    res.locals.userDocument = await models.UserModel.create(document);

    // set res.locals.status so cleanUser will process the userDocument for the frontend
    res.locals.status = 'validUser' as BackendStatus;

    return next();
  } catch (err) {
    return next(
      createErr({
        method: 'createUser',
        overview: 'problem either hashing password or creating user in database',
        status: 500,
        err
      })
    );
  }
};

//---VERIFY USER LOGIN -----------------------------------------------------------------------------
const verifyUser: RequestHandler = async (req, res, next) => {
  // if userDocument on res.locals is null, send frontendData object with status to frontend
  if (res.locals.userDocument === null) {
    res.locals.frontendData = { status: 'userNotFound' } as SignInResponse;
    return next();
  }

  // If the user was found via getUser, compare the password on the found user document to the
  // submitted password
  const userDocument: UserDocument = res.locals.userDocument;
  const { password } = req.body;

  if (typeof password !== 'string') {
    return next(
      createErr({
        method: 'verifyUser',
        overview: 'problem extracting password from request body',
        status: 400,
        err: "password wasn't included in request body"
      })
    );
  }

  try {
    // if password isn't a match, send frontendData object with status to frontend
    if (!bcrypt.compareSync(password, userDocument.password)) {
      res.locals.frontendData = { status: 'incorrectPassword' } as SignInResponse;
      return next();
    }

    // set res.locals.status so cleanUser will process the userDocument for the frontend
    res.locals.status = 'validUser' as BackendStatus;

    return next();
  } catch (err) {
    return next(
      createErr({
        method: 'verifyUser',
        overview: 'problem comparing hashed password',
        status: 500,
        err
      })
    );
  }
};

//---SAVE PUZZLE -----------------------------------------------------------------------------------
// I may switch the entire schema set-up to include puzzle objects, including a Map of said objects
// in the User schema

const savePuzzle: RequestHandler = async (req, res, next) => {
  // Make sure getUser found the user
  if (res.locals.userDocument === null) {
    res.locals.frontendData = { status: 'userNotFound' } as SignInResponse;
    return next();
  }

  const userDocument: UserDocument = res.locals.userDocument;
  const puzzleNumber = Number(req.body.puzzleNumber);
  const { progress, pencilProgress } = req.body;
  if (
    !Number.isInteger(puzzleNumber) ||
    typeof progress !== 'string' ||
    typeof pencilProgress !== 'string'
  ) {
    return next(
      createErr({
        method: 'savePuzzle',
        overview: 'problem extracting puzzle info from req.body',
        status: 500,
        err: 'puzzleNumber and/or progress was undefined'
      })
    );
  }

  let currentPuzzleIndex: number | null = null;

  try {
    // I can refactor this if I make the user allPuzzles property a map. I could also make a schema
    // for the userPuzzleObjects if I wanted to be specific about it. I'll leave the array for now
    for (let i = 0; i < userDocument.allPuzzles.length; i++) {
      if (puzzleNumber === userDocument.allPuzzles[i].puzzleNumber) {
        currentPuzzleIndex = i;
        break;
      }
    }

    if (currentPuzzleIndex !== null) {
      // If the user already has saved progress for that puzzle, update it to the new progress value
      res.locals.userDocument.allPuzzles[currentPuzzleIndex].progress = progress;
      res.locals.userDocument.allPuzzles[currentPuzzleIndex].pencilProgress = pencilProgress;
    } else {
      // If this is the first time a puzzle is being saved to a user:
      // Make the puzzle object to push it to the user's array
      const puzzleObj: UserPuzzleObj = {
        puzzleNumber,
        progress,
        pencilProgress
      };

      res.locals.userDocument.allPuzzles.push(puzzleObj);
    }

    res.locals.userDocument.lastPuzzle = puzzleNumber;

    // I don't need to check and see if the returned value is null.
    // An error will be thrown if the save is unsuccessful
    await res.locals.userDocument.save();

    // I'm not going to send back the whole user, I'll only send whether or not it was successful.
    // As the user object gets bigger via more and more puzzles, this will be more efficient
    res.locals.frontendData = { status: 'valid' } as SignInResponse;

    return next();
  } catch (err) {
    return next(
      createErr({
        method: 'savePuzzle',
        overview: `problem saving progress to ${res.locals.userDocument.username}'s allPuzzles array`,
        status: 500,
        err
      })
    );
  }
};

//---SAVE USER -------------------------------------------------------------------------------------
/**
 * Takes only a user, saves entire user to database including converting allPuzzles to array
 */
const saveUser: RequestHandler = async (req, res, next) => {
  // Make sure getUser found the user
  if (res.locals.userDocument === null) {
    res.locals.frontendData = { status: 'userNotFound' } as SignInResponse;
    return next();
  }

  const frontendLastPuzzle: number = req.body.lastPuzzle;
  const frontendAllPuzzles: AllPuzzles = req.body.allPuzzles;

  if (!frontendAllPuzzles || !frontendLastPuzzle) {
    return next(
      createErr({
        method: 'saveUser',
        overview: 'problem extracting user info from req.body',
        status: 500,
        err: 'user was undefined'
      })
    );
  }

  const puzzleKeys = Object.keys(frontendAllPuzzles);
  const backendAllPuzzles = [];
  for (const key of puzzleKeys) {
    backendAllPuzzles.push(frontendAllPuzzles[Number(key)]);
  }

  try {
    res.locals.userDocument.allPuzzles = backendAllPuzzles;
    res.locals.userDocument.lastPuzzle = frontendLastPuzzle;

    // I don't need to check and see if the returned value is null.
    // An error will be thrown if the save is unsuccessful
    await res.locals.userDocument.save();

    // I'm not going to send back the whole user, I'll only send whether or not it was successful.
    // As the user object gets bigger via more and more puzzles, this will be more efficient
    res.locals.frontendData = { status: 'valid' } as SignInResponse;

    return next();
  } catch (err) {
    return next(
      createErr({
        method: 'saveUser',
        overview: `problem saving progress to ${res.locals.userDocument.username}'s allPuzzles array`,
        status: 500,
        err
      })
    );
  }
};

const userController: UserController = {
  getUser,
  cleanUser,
  createUser,
  verifyUser,
  savePuzzle,
  saveUser
};

export default userController;
