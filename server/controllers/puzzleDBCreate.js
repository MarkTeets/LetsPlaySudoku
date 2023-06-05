const models = require('../models/puzzleModel');
// link to db
//https://cloud.mongodb.com/v2/642a4ee65670c5544553a07a#/metrics/replicaSet/642a5022807c220853bea4a5/explorer/sudoku/puzzles/find
const puzzle1 = '070000043040009610800634900094052000358460020000800530080070091902100005007040802';
const solution1 = '679518243543729618821634957794352186358461729216897534485276391962183475137945862';

const puzzle2 = '301086504046521070500000001400800002080347900009050038004090200008734090007208103';
const solution2 = '371986524846521379592473861463819752285347916719652438634195287128734695957268143';


const firstPuzzle = {
  number: 1,
  puzzle: puzzle1,
  solution: solution1,
};

const secondPuzzle = {
  number: 2,
  puzzle: puzzle2,
  solution: solution2,
};

const initialPuzzle = async () => {
  try {
    const made = await models.Puzzle.create(secondPuzzle);
    console.log(made.id);
  } catch (err) {
    console.log('Error in puzzle creation:', err.message);
  }
};

initialPuzzle();