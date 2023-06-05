const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const usersRouter = require('./routes/userRouter');
const puzzleRouter = require('./routes/puzzleRouter');

const PORT = 1234;



// Allow guests to access database for now
const MONGO_URI='mongodb+srv://markteets:PV0m4ZjwEg3wZwIT@sudoku-db.ox6sdpn.mongodb.net/?retryWrites=true&w=majority';
//const MONGO_URI = process.env.SUDOKU_MONGO_URI;

mongoose.connect(MONGO_URI, {
  dbName: 'sudoku'
})
  .then(() => console.log('Connected to Mongo DB!'))
  .catch(err => console.log('Database error: ', err.message));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', usersRouter);

app.use('/api/puzzle', puzzleRouter);

app.get('/api', (req, res) => {
  res.send('hello world from express!');
});

app.get('/', (req, res) => {
  res.status(404).send('Nothing to see here!');
});

//Global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});


app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

module.exports = app;