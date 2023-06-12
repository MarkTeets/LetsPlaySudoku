const models = {};
models.Puzzle = require('../models/puzzleModel');
// import { isValidPuzzle } from '../../client/data/squares';

const puzzleController = {};

//---GET PUZZLE ---------------------------------------------------------------------------------------------------------------------
puzzleController.getPuzzle = async (req, res, next) => {
  //given a string query, request the resource from the 
  //database and return it as a json
  try {
    const { puzzleNumber } = req.query;
    // console.log('puzzleNumber:', puzzleNumber);

    if (puzzleNumber === undefined) {
      return next(errorMaker('getPuzzle', 400, 'Failed to retrieve puzzleNumber query string from req.query'));
    }

    res.locals.puzzleObj = await models.Puzzle.findOne({ number: puzzleNumber }).exec();

    if (res.locals.puzzleObj === null) {
      return (errorMaker('getPuzzle', 400, `Failed to find and return puzzle corresponding to #${puzzleNumber}`));
    }

    return next();

  } catch (err) {
    return next(errorMaker('getPuzzle', 500, 'Failed to retrieve puzzle string', err));
  }
};


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


const errorMaker = (middleware, status, message, err) => {
  const error = {
    log: `Error in puzzleController from ${middleware} middleware. Error: ${err.message}`,
    status,
    message: { error: `Error puzzleController from ${middleware} middleware.` }
  };

  if (err !== undefined) {
    error.log = `Error puzzleController from ${middleware} middleware. ${message}. Error: ${err.message}`;
  }

  return error;
};


/*
puzzleController.getPuzzle = async (req, res, next) => {
  //given a string query, request the resource from the 
  //database and return it as a json
  try {
    const { puzzleNumber } = req.query;
    // console.log('puzzleNumber:', puzzleNumber);

    if (puzzleNumber === undefined) {
      return next(createErr({
        method: 'getPuzzle',
        type: 'destructing puzzleNumber from req.query',
        status: 400,
        err: 'Failed to retrieve puzzleNumber query string from req.query'
      }));
    }

    res.locals.puzzleObj = await models.Puzzle.findOne({ number: puzzleNumber }).exec();

    if (res.locals.puzzleObj === null) {
      return next(createErr({
        method: 'getPuzzle',
        type: 'MongoDB findOne returned null',
        status: 400,
        err: 'Failed to find and return puzzle corresponding to #${puzzleNumber}'
      }));
    }

    return next();

  } catch (err) {
    return next(createErr({
      method: 'getPuzzle',
      type: 'Failed to retrieve puzzle string',
      status: 500,
      err
    }));
  }
};

// Error generation helper function
const createErr = ({ method, type, status, err }) => {
  const errorObj = {
    log: `puzzleController.${method} ${type}: ERROR: ${typeof err === 'object' ? err.message : err}`,
    message: { err: `Error occurred in puzzleController.${method}. Check server logs for more details.` }
  };
  if (status) {
    errorObj.status = status;
  }
  return errorObj;
};

*/