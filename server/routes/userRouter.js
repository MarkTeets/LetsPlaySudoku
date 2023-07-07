const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const puzzleController = require('../controllers/puzzleController');


userRouter.post('/signup',
  userController.getUser,
  userController.createUser,
  (req, res) => {
    res.status(200).json(res.locals.frontendData);
  }
);

userRouter.post('/login',
  userController.getUser,
  userController.verifyUser,
  puzzleController.getUserPuzzles,
  (req, res) => {
    res.status(200).json(res.locals.frontendData);
  }
);

userRouter.post('/save-puzzle',
  userController.getUser,
  userController.savePuzzle,
  (req, res) => {
    res.status(200).json(res.locals.frontendData);
  }
);


module.exports = userRouter;