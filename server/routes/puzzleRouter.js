const express = require('express');
const puzzleRouter = express.Router();
const userController = require('../controllers/userController');
const puzzleController = require('../controllers/puzzleController');

puzzleRouter.get('/',
  puzzleController.getPuzzleByNumber,
  (req, res) => {
    res.status(200).json(res.locals.puzzleObj);
  }
);

puzzleRouter.post('/get-next-puzzle-for-user',
  userController.getUser,
  puzzleController.getNextPuzzleForUser,
  puzzleController.getPuzzleByNumber,
  (req, res) => {
    res.status(200).json(res.locals.puzzleObj);
  }
);

puzzleRouter.post('/get-next-puzzle-for-guest',
  puzzleController.getNextPuzzleForGuest,
  puzzleController.getPuzzleByNumber,
  (req, res) => {
    res.status(200).json(res.locals.puzzleObj);
  }
);



module.exports = puzzleRouter;