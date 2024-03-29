import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import mongoose, { Error } from 'mongoose';
import path from 'path';
import logger from 'morgan';
import usersRouter from './routes/userRouter';
import puzzleRouter from './routes/puzzleRouter';
import { CustomErrorOutput } from './backendTypes';

const app = express();
const PORT = 3000;

// const dotenv = require('dotenv');
// dotenv.config();

// Allow guests to access database for now
const MONGO_URI =
  'mongodb+srv://markteets:PV0m4ZjwEg3wZwIT@sudoku-db.ox6sdpn.mongodb.net/?retryWrites=true&w=majority';
//const MONGO_URI = process.env.SUDOKU_MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    dbName: 'sudoku'
  })
  .then(() => console.log('Connected to Mongo DB!'))
  .catch((err) => console.log('Database error: ', err.message));

app.use(logger(':date[web] :method :url :status :response-time ms - :res[content-length]'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// This first express.static will serve the bundled version of the frontend at dist/index.html when
// a browser request is made to localhost:3000. Used for Docker, so the server can run with this
// saved version of the frontend
app.use(express.static(path.join(__dirname, '../../dist/')));
app.use('/assets', express.static(path.join(__dirname, '../client/assets')));

app.use('/api/user', usersRouter);

app.use('/api/puzzle', puzzleRouter);

app.use('/', (req: Request, res: Response) => {
  res.status(404).send('Nothing to see here!');
});

//Global error handler
app.use((err: Error | CustomErrorOutput, req: Request, res: Response, next: NextFunction) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'A server error occurred' }
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
