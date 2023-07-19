import express from 'express';
const userRouter = express.Router();

import userController from '../controllers/userController';
import puzzleController from '../controllers/puzzleController';
import cookieController from '../controllers/cookieController';
import sessionController from '../controllers/sessionController';

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

userRouter.get('/no-session', (req, res) => {
  res.status(200).json({ status: 'noSession' });
});

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

export default userRouter;
