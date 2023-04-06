const models = require('../models/puzzles');

const puzzleController = {};

puzzleController.getPuzzle = async (req, res, next) => {
  //given a string query, request the resource from the 
  //database and return it as a json
  try {
    const { puzzleNumber } = req.query;
    console.log('puzzleNumber:', puzzleNumber);

    if (puzzleNumber === undefined) {
      return next(errorMaker('getPuzzle', 400, 'Failed to retrieve puzzleNumber query string from req.query'))
    }

    res.locals.puzzleObj = await models.Puzzle.findOne({ number: puzzleNumber }).exec();

    if (res.locals.puzzleObj === null) {
      return (errorMaker('getPuzzle', 400, `Failed to find and return puzzle corresponding to #${puzzleNumber}`));
    }

    return next();

  } catch (err) {
    return next(errorMaker('getPuzzle', 500, 'Failed to retrieve puzzle string', err))
  }
}



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