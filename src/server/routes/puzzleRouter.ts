import express, { Request, Response } from 'express';
const puzzleRouter = express.Router();
import userController from '../controllers/userController';
import puzzleController from '../controllers/puzzleController';

puzzleRouter.get('/:puzzleNumber',
  puzzleController.getPuzzleByNumber,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.frontendData);
  }
);

puzzleRouter.post('/get-next-puzzle-for-user',
  userController.getUser,
  puzzleController.getNextPuzzle,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.frontendData);
  }
);

puzzleRouter.post('/get-next-puzzle-for-guest',
  puzzleController.getNextPuzzle,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.frontendData);
  }
);

export default puzzleRouter;
