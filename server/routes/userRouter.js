const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');


userRouter.post('/signup',
  userController.getUser,
  userController.createUser,
  (req, res) => {
    res.status(200).json(res.locals.frontendUser);
  }
);

userRouter.post('/login',
  userController.getUser,
  userController.verifyUser,
  (req, res) => {
    res.status(200).json(res.locals.frontendUser);
  }
);

userRouter.post('/save-puzzle',
  userController.getUser,
  userController.savePuzzle,
  (req, res) => {
    res.status(200).json(res.locals.frontendUser);
  }
);


module.exports = userRouter;