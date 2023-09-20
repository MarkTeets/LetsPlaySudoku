import express, { Request, Response } from 'express';
const userRouter = express.Router();

import userController from '../controllers/userController';
import puzzleController from '../controllers/puzzleController';
import cookieController from '../controllers/cookieController';
import sessionController from '../controllers/sessionController';

userRouter.post('/sign-up',
  userController.getUser,
  userController.createUser,
  userController.cleanUser,
  cookieController.setSSIDCookie,
  sessionController.startSession,
  (req: Request, res: Response) => {
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
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.frontendData);
  }
);

userRouter.get('/resume-session',
  sessionController.findSession,
  userController.getUser,
  userController.cleanUser,
  puzzleController.getUserPuzzles,
  sessionController.startSession,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.frontendData);
  }
);

userRouter.get('/no-session',
  (req: Request, res: Response) => {
    res.status(200).json({ status: 'noSession' });
  }
);

userRouter.delete('/log-out',
  userController.getUser,
  sessionController.deleteSession,
  cookieController.deleteSSIDCookie,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.frontendData);
  }
);

userRouter.post('/save-puzzle',
  userController.getUser,
  userController.savePuzzle,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.frontendData);
  }
);

export default userRouter;
