// Models
import PuzzleModel from '../models/puzzleModel';
const models = { PuzzleModel };

// Types
import { RequestHandler } from 'express';
import { AllPuzzles, PuzzleCollection, PuzzleResponse } from '../../types';
import { PuzzleController, CustomErrorGenerator, UserDocument } from '../backendTypes';

// Helper function: createErr will return an object formatted for the global error handler
import controllerErrorMaker from '../utils/controllerErrorMaker';
const createErr: CustomErrorGenerator = controllerErrorMaker('puzzleController');

// Global Variables
import totalPuzzles from '../../globalUtils/totalPuzzles';

//---GET PUZZLE BY NUMBER---------------------------------------------------------------------------

// Given a puzzleNumber, retrieve associated puzzle from the database and return it as a json

const getPuzzleByNumber: RequestHandler = async (req, res, next) => {
  const puzzleNumber = Number(req.params.puzzleNumber);

  if (!Number.isInteger(puzzleNumber) || puzzleNumber < 1 || puzzleNumber > totalPuzzles) {
    return next(
      createErr({
        method: 'getPuzzleByNumber',
        overview: 'invalid puzzleNumber',
        status: 400,
        err: "Either the puzzleNumber wasn't on req.params, or it doesn't correlate to a valid puzzleNumber"
      })
    );
  }

  try {
    const puzzleObj = await models.PuzzleModel.findOne({ puzzleNumber: puzzleNumber }).exec();

    if (puzzleObj === null) {
      return next(
        createErr({
          method: 'getPuzzleByNumber',
          overview: 'MongoDB findOne returned null',
          status: 400,
          err: `Failed to find and return puzzle corresponding to #${puzzleNumber}`
        })
      );
    }

    res.locals.frontendData = {
      status: 'valid',
      puzzleObj
    } as PuzzleResponse;

    return next();
  } catch (err) {
    return next(
      createErr({
        method: 'getPuzzleByNumber',
        overview: 'Failed to retrieve puzzle string',
        status: 500,
        err
      })
    );
  }
};

//---GET USER PUZZLES ------------------------------------------------------------------------------
// Given a frontendData object on res.locals from userController.verifyLogin, this function will
// return all of the puzzle details for each puzzle in the frontendData user's allPuzzles

const getUserPuzzles: RequestHandler = async (req, res, next) => {
  // The login page already handles the "userNotFound" case, so I don't need to do anything else
  if (res.locals.status !== 'validUser' || !res.locals.userDocument) {
    return next();
  }

  const userDocument: UserDocument = res.locals.userDocument;

  if (userDocument.allPuzzles.length === 0) {
    res.locals.frontendData.puzzleCollection = [];
    return next();
  }

  const userPuzzleNumbersFilter = userDocument.allPuzzles.map((puzzleObj) => {
    return { puzzleNumber: puzzleObj.puzzleNumber };
  });

  try {
    const foundPuzzles = await models.PuzzleModel.find({ $or: userPuzzleNumbersFilter });

    const puzzleCollection: PuzzleCollection = {};
    for (const puzzleDoc of foundPuzzles) {
      puzzleCollection[puzzleDoc.puzzleNumber] = puzzleDoc;
    }

    res.locals.frontendData.puzzleCollection = puzzleCollection;

    return next();
  } catch (err) {
    return next(
      createErr({
        method: 'getUserPuzzles',
        overview: 'Failed to retrieve puzzle documents from puzzles collection',
        status: 500,
        err
      })
    );
  }
};

//---GET NEXT PUZZLE -------------------------------------------------------------------------------
// A post request from a guest will include their allPuzzles object. A post request from a user will
// include their username. This middleware will find the first puzzle number that hasn't been played
// and redirect to a get request for that specific puzzle. If every puzzle has been played, a
// specific status will be sent back. There are two different ways to get the info for guests vs
// users as a user's allPuzzles array might be large, and eventually it'll be cached for fast
// retrieval

const getNextPuzzle: RequestHandler = async (req, res, next) => {
  const { username, allPuzzles } = req.body;

  // Set nextPuzzleNum to null. It'll be reassigned if a valid puzzle is found
  let nextPuzzleNum: number | null = null;

  //Now we'll handle two different cases for a user request and a guest request

  // Case 1: User request
  // A user request will include a username and the getUser middleware retrieves the user
  if (typeof username === 'string') {
    // Having confirmed the request came from a user, check to see if the corresponding
    // user document has been found.
    // If not send status back to frontend to show that getUser didn't find intended user
    if (res.locals.userDocument === null) {
      res.locals.frontendData = { status: 'userNotFound' };
      return next();
    }
    const userDocument: UserDocument = res.locals.userDocument;

    // Add all puzzle numbers from user's allPuzzles array to a set
    const puzzleNumSet = new Set();

    for (const puzzleObj of userDocument.allPuzzles) {
      puzzleNumSet.add(puzzleObj.puzzleNumber);
    }

    // Reassign nextPuzzleNum to the first unused puzzle number from the user's allPuzzles array
    // that's less than the total number of puzzles. Have to do this sequentially as user can
    // choose any number to play via other methods, aka puzzle numbers can be sparse
    for (let i = 1; i <= totalPuzzles; i++) {
      if (!puzzleNumSet.has(i)) {
        nextPuzzleNum = i;
        break;
      }
    }
  }

  // Case 2: Guest request
  // A guest request will include an allPuzzles object.
  if (typeof allPuzzles === 'object') {
    const guestAllPuzzles: AllPuzzles = allPuzzles;
    // Reassign nextPuzzleNum to the first unused puzzle number in the object that's less than the
    // total number of puzzles. Have to do this sequentially as user can choose any number to play
    // via other methods, aka puzzle numbers can be sparse
    for (let i = 1; i <= totalPuzzles; i++) {
      if (!guestAllPuzzles[i]) {
        nextPuzzleNum = i;
        break;
      }
    }
  }

  // After code has run for both cases: nextPuzzleNum will be a valid number if one was available.
  // Redirect if usable number was found
  if (nextPuzzleNum !== null) {
    return res.redirect(`/api/puzzle/${nextPuzzleNum}`);
  }

  // If no usable number was found, it's because they've already played all of the puzzles.
  // Send this info back to the frontend.
  res.locals.frontendData = { status: 'allPuzzlesPlayed' } as PuzzleResponse;

  return next();
};

//---GET PUZZLE WITH FILTERS -----------------------------------------------------------------------
// const getPuzzleWithFilters: RequestHandler = async (req, res, next) => {

// };

const puzzleController: PuzzleController = {
  getPuzzleByNumber,
  getUserPuzzles,
  getNextPuzzle
};

export default puzzleController;
