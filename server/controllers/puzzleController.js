const models = {};
models.Puzzle = require('../models/puzzleModel');
// import { isValidPuzzle } from '../../client/data/squares';
const totalPuzzles = 2;

const puzzleController = {};

//---GET PUZZLE BY NUMBER---------------------------------------------------------------------------------------------------

// Given a puzzleNumber, retrieve associated puzzle from the database and return it as a json

puzzleController.getPuzzleByNumber = async (req, res, next) => {
  try {
    const { puzzleNumber } = req.query;
    // console.log('puzzleNumber:', puzzleNumber);

    if (puzzleNumber === undefined) {
      return next(createErr({
        method: 'getPuzzleByNumber',
        overview: 'destructing puzzleNumber from req.query',
        status: 400,
        err: 'Failed to retrieve puzzleNumber query string from req.query'
      }));
    }

    res.locals.puzzleObj = await models.Puzzle.findOne({ puzzleNumber: Number(puzzleNumber) }).exec();

    if (res.locals.puzzleObj === null) {
      return next(createErr({
        method: 'getPuzzleByNumber',
        overview: 'MongoDB findOne returned null',
        status: 400,
        err: `Failed to find and return puzzle corresponding to #${puzzleNumber}`
      }));
    }

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
  if (res.locals.frontendData.status !== 'valid') {
    // console.log('No user found in getUserPuzzles, user status:', res.locals.frontendData.status);
    return next();
  }

  // console.log(res.locals.foundUser);
  // console.log(res.locals.foundUser.allPuzzles);

  if (res.locals.foundUser.allPuzzles.length === 0) {
    res.locals.frontendData.puzzleCollection = [];
    return next();
  }

  const userPuzzleNumbersFilter = res.locals.foundUser.allPuzzles.map(puzzleObj => {
    return { puzzleNumber: puzzleObj.puzzleNumber };
  });
  // console.log('userPuzzleNumbersFilter from getUserPuzzles', userPuzzleNumbersFilter);

  try {
    const foundPuzzles = await models.Puzzle.find({ $or: userPuzzleNumbersFilter });
    // console.log('foundPuzzles from getUserPuzzles', foundPuzzles);

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

puzzleController.getNextPuzzleForUser = async (req, res, next) => {
  
};

puzzleController.getNextPuzzleForGuest = async (req, res, next) => {

};




//---GET PUZZLE WITH FILTERS ------------------------------------------------------------------------------------------------------------------
// puzzleController.getPuzzleWithFilters = async (req, res, next) => {

// };

//---ADD PUZZLE-------------------------------------------------------------------------------------------------------------------------------------
/*
puzzleController.addPuzzle = async (req, res, next) => {
  const { puzzleString } = req.body;
  //Eventually this will start by checking to see whether or not a submitted puzzle string is valid
  if (!isValidPuzzle(puzzleString)) {
    //Logic for what happens when puzzle isn't valid
    //probably return next with something attached to res.locals signaling failure
  }
  // next, implement solving algorithms to populate the solveLevel object.
  // I might check for lowest scores or for easiest techniques possible. Maybe one day a user would be able to select how they'd
  // like to sort the problem, so "solveLevel" would actually have multiple properties, with each key being named after sorting
  // method like "lowest score", "easiest techniques", and "fewest steps"
  
  // Whatever simple way I choose to do it first, I would populate the solveLevel object accordingly, and then add a puzzle document
  // to the puzzles collection with all the info. 

};

*/

module.exports = puzzleController;


// Error generation helper function
const createErr = ({ method, overview, status, err }) => {
  const errorObj = {
    log: `puzzleController.${method} ${overview}: ERROR: ${typeof err === 'object' ? err.message : err}`,
    message: { err: `Error occurred in puzzleController.${method}. Check server logs for more details.` }
  };
  if (status) {
    errorObj.status = status;
  }
  return errorObj;
};
