const express = require('express');
const puzzleRouter = express.Router();
const userController = require('../controllers/userController');
const puzzleController = require('../controllers/puzzleController');

puzzleRouter.get('/:puzzleNumber',
  puzzleController.getPuzzleByNumber,
  (req, res) => {
    res.status(200).json(res.locals.frontendData);
  }
);

puzzleRouter.post('/get-next-puzzle-for-user',
  userController.getUser,
  puzzleController.getNextPuzzle,
  (req, res) => {
    res.status(200).json(res.locals.frontendData);
  }
);

puzzleRouter.post('/get-next-puzzle-for-guest',
  puzzleController.getNextPuzzle,
  (req, res) => {
    res.status(200).json(res.locals.frontendData);
  }
);



module.exports = puzzleRouter;