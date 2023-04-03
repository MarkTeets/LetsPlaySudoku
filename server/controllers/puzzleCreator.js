const models = require('../models/puzzles');
//https://cloud.mongodb.com/v2/642a4ee65670c5544553a07a#/metrics/replicaSet/642a5022807c220853bea4a5/explorer/sudoku/puzzles/find
const puzzle1 = '070000043040009610800634900094052000358460020000800530080070091902100005007040802';
const solution1 = '679518243543729618821634957794352186358461729216897534485276391962183475137945862';

const firstPuzzle = {
  puzzle:	puzzle1,
  solution:	solution1,
}

const initialPuzzle = async () => {
  try {
    const made = await models.Puzzle.create(firstPuzzle);
    console.log(made.id);
  } catch (err) {
    console.log('Error in puzzle creation:', err.message);
  }
}
// I ran it and it worked! I now have a puzzle in my database
// initialPuzzle();