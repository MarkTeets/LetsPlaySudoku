const models = {};
models.Puzzle = require('../models/puzzleModel');

// Helper function: createErr will return an object formatted for the global error handler
const controllerErrorMaker = require('../utils/controllerErrorMaker');
const createErr = controllerErrorMaker('puzzleController');

// Importing the totalNumber of puzzles from another file so it can be the single source of truth as this
// also needs to be used in the frontend, which imports via ES6 syntax. This method is simpler than adding
// "type": "module" to my package.json and removing every instance of 'require'
let totalPuzzles;
import('../../globalUtils/totalPuzzles.mjs')
  .then(module => {
    totalPuzzles = module.totalPuzzles;
    // console.log('totalpuzzles from back', totalPuzzles);
  }).catch(err => {
    console.log('totalPuzzles failed to import to puzzle controller', err.message);
  });


const puzzleController = {};

//---GET PUZZLE BY NUMBER---------------------------------------------------------------------------------------------------

// Given a puzzleNumber, retrieve associated puzzle from the database and return it as a json

puzzleController.getPuzzleByNumber = async (req, res, next) => {
  try {
    const { puzzleNumber } = req.params;
    // console.log('puzzleNumber:', puzzleNumber);

    if (puzzleNumber === undefined) {
      return next(createErr({
        method: 'getPuzzleByNumber',
        overview: 'destructing puzzleNumber from req.params',
        status: 400,
        err: 'Failed to retrieve puzzleNumber params string from req.params'
      }));
    }

    const puzzleObj = await models.Puzzle.findOne({ puzzleNumber: Number(puzzleNumber) }).exec();

    if (puzzleObj === null) {
      return next(createErr({
        method: 'getPuzzleByNumber',
        overview: 'MongoDB findOne returned null',
        status: 400,
        err: `Failed to find and return puzzle corresponding to #${puzzleNumber}`
      }));
    }

    res.locals.frontendData = {
      status: 'valid',
      puzzleObj
    };
    
    return next();

  } catch (err) {
    return next(createErr({
      method: 'getPuzzleByNumber',
      overview: 'Failed to retrieve puzzle string',
      status: 500,
      err
    }));
  }
};

//---GET USER PUZZLES --------------------------------------------------------------------------------------------------------------------------
// Given a frontendData object on res.locals from userController.verifyLogin, this function will return all of the puzzle details
// for each puzzle in the frontendData user's allPuzzles

puzzleController.getUserPuzzles = async (req, res, next) => {
  // The login page already handles the "userNotFound" case, so I don't need to do anything else
  if (res.locals.status !== 'validUser' || !res.locals.userDocument) {
    return next();
  }

  if (res.locals.userDocument.allPuzzles.length === 0) {
    res.locals.frontendData.puzzleCollection = [];
    return next();
  }

  const userPuzzleNumbersFilter = res.locals.userDocument.allPuzzles.map(puzzleObj => {
    return { puzzleNumber: puzzleObj.puzzleNumber };
  });

  try {
    const foundPuzzles = await models.Puzzle.find({ $or: userPuzzleNumbersFilter });

    const puzzleCollection = {};
    for (const puzzleDoc of foundPuzzles) {
      puzzleCollection[puzzleDoc.puzzleNumber] = puzzleDoc;
    }
    
    res.locals.frontendData.puzzleCollection = puzzleCollection;

    return next();

  } catch (err) {
    return next(createErr({
      method: 'getUserPuzzles',
      overview: 'Failed to retrieve puzzle documents from puzzles collection',
      status: 500,
      err
    }));
  }
};

//---GET NEXT PUZZLE ----------------------------------------------------------------------------------------------------------------------
// A post request from a guest will include their allPuzzles object. A post request from a user will include their username.
// This middleware will find the first puzzle number that hasn't been played, and redirect to a get request for that specific puzzle
// If every puzzle has been played, a specific status will be sent back.
// There are two different ways to get the info for guests vs users as a user's allPuzzles array might be large, and eventually it'll be 
// cached for fast retrieval

puzzleController.getNextPuzzle = async (req, res, next) => {
  const { username, allPuzzles } = req.body;

  // Set nextPuzzleNum to null. It'll be reassigned if a valid puzzle is found
  let nextPuzzleNum = null;

  // A user request will include a username and the getUser middleware is called to retreive the user.
  if (username !== undefined) {
    if (res.locals.userDocument === null) {
      res.locals.frontendData = { status: 'userNotFound' };
      return next();
    }
  
    // add all puzzle numbers from user's allPuzzles array to a set
    const puzzleNumSet = new Set();
  
    for (const puzzleObj of res.locals.userDocument.allPuzzles) {
      puzzleNumSet.add(puzzleObj.puzzleNumber);
    }
     
    // Reassign nextPuzzleNum to the first unused puzzle number from the user's allPuzzles array that's less than the total number of puzzles
    // Have to do this sequentially as user can choose any number to play via other methods, aka puzzle numbers can be sparse
    for (let i = 1; i <= totalPuzzles; i++){
      if (!puzzleNumSet.has(i)) {
        nextPuzzleNum = i;
        break;
      }
    }
  }

  // A guest request will include an allPuzzles object. 
  if (allPuzzles !== undefined) {
    // Reassign nextPuzzleNum to the first unused puzzle number in the object that's less  than the total number of puzzles
    // Have to do this sequentially as user can choose any number to play via other methods, aka puzzle numbers can be sparse
    for (let i = 1; i <= totalPuzzles; i++) {
      if (!allPuzzles[i]) {
        nextPuzzleNum = i;
        break;
      }
    }
  }

  // nextPuzzleNum will be a valid number if one was available. Redirect if usable number was found
  if (nextPuzzleNum !== null) {
    return res.redirect(`/api/puzzle/${nextPuzzleNum}`);
  }

  // If no usable number was found, it's because they've already played all of the puzzles. Send this info back to the frontend.
  res.locals.frontendData = { status: 'allPuzzlesPlayed' };

  return next();
};


//---GET PUZZLE WITH FILTERS ------------------------------------------------------------------------------------------------------------------
// puzzleController.getPuzzleWithFilters = async (req, res, next) => {

// };


module.exports = puzzleController;