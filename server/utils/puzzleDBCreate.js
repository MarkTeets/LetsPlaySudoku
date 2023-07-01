const mongoose = require('mongoose');
const Puzzle = require('../models/puzzleModel');

const MONGO_URI='mongodb+srv://markteets:PV0m4ZjwEg3wZwIT@sudoku-db.ox6sdpn.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
  dbName: 'sudoku'
})
  .then(() => console.log('Connected to Mongo DB!'))
  .catch(err => console.log('Database error: ', err.message));


const puzzle1 = '070000043040009610800634900094052000358460020000800530080070091902100005007040802';
const solution1 = '679518243543729618821634957794352186358461729216897534485276391962183475137945862';

const puzzle2 = '301086504046521070500000001400800002080347900009050038004090200008734090007208103';
const solution2 = '371986524846521379592473861463819752285347916719652438634195287128734695957268143';


const firstPuzzle = {
  puzzleNumber: 1,
  puzzle: puzzle1,
  solution: solution1,
};

const secondPuzzle = {
  puzzleNumber: 2,
  puzzle: puzzle2,
  solution: solution2,
};

const initialPuzzle = async () => {
  try {
    const made = await Puzzle.create(secondPuzzle);
    console.log(made.id);
  } catch (err) {
    console.log('Error in puzzle creation:', err.message);
  }
};

initialPuzzle();