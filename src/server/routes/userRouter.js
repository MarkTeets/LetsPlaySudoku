const express = require('express');
const userRouter = express.Router();

const userController = require('../controllers/userController');
const puzzleController = require('../controllers/puzzleController');
const cookieController = require('../controllers/cookieController');
const sessionController = require('../controllers/sessionController');


userRouter.post('/signup',
  userController.getUser,
  userController.createUser,
  userController.cleanUser,
  cookieController.setSSIDCookie,
  sessionController.startSession,
  (req, res) => {
    res.status(200).json(res.locals.frontendData);
  }
);

userRouter.post('/login',
  userController.getUser,
  userController.verifyUser,
  userController.cleanUser,
  puzzleController.getUserPuzzles,
  cookieController.setSSIDCookie,
  sessionController.startSession,
  (req, res) => {
    res.status(200).json(res.locals.frontendData);
  }
);

userRouter.get('/resume-session',
  sessionController.isLoggedIn,
  userController.getUser,
  userController.cleanUser,
  puzzleController.getUserPuzzles,
  sessionController.startSession,
  (req, res) => {
    res.status(200).json(res.locals.frontendData);
  }
);

userRouter.get('/no-session',
  (req, res) => {
    res.status(200).json({status: 'noSession'});
  }
);

userRouter.delete('/delete-session',
  userController.getUser,
  sessionController.logOut,
  (req, res) => {
    res.clearCookie('ssid');
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