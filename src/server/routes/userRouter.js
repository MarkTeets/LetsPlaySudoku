const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const puzzleController = require('../controllers/puzzleController');
const cookieController = require('../controllers/cookieController');


userRouter.post('/signup',
  userController.getUser,
  userController.createUser,
  cookieController.setSSIDCookie,
  (req, res) => {
    res.status(200).json(res.locals.frontendData);
  }
);

userRouter.post('/login',
  userController.getUser,
  userController.verifyUser,
  cookieController.setSSIDCookie,
  puzzleController.getUserPuzzles,
  (req, res) => {
    res.status(200).json(res.locals.frontendData);
  }
);

userRouter.get('/resume-session',
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