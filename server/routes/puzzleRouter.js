const express = require('express');
const puzzleRouter = express.Router();
const puzzleController = require('../controllers/puzzleController');

puzzleRouter.get('/',
  puzzleController.getPuzzleByNumber,
  (req, res) => {
    res.status(200).json(res.locals.puzzleObj);
  }
);



module.exports = puzzleRouter;