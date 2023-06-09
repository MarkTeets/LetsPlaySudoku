const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Each puzzle document will include the following details. The names of different techniques denotes if said technique is required to 
// solve the puzzle

const puzzleSchema = new Schema({
  puzzleNumber: Number,
  puzzle: String,
  solution: String,
  difficultyString: {
    type: String,
    default: 'easy'
  },
  difficultyScore: {
    type: Number,
    default: 1
  },
  uniqueSolution: {
    type: Boolean,
    default: false
  },
  singleCandidate: {
    type: Boolean,
    default: true
  },
  singlePosition: {
    type: Boolean,
    default: false
  },
  candidateLines: {
    type: Boolean,
    default: false
  },
  doublePairs: {
    type: Boolean,
    default: false
  },
  multipleLines: {
    type: Boolean,
    default: false
  },
  nakedPair: {
    type: Boolean,
    default: false
  },
  hiddenPair: {
    type: Boolean,
    default: false
  },
  nakedTriple: {
    type: Boolean,
    default: false
  },
  hiddenTriple: {
    type: Boolean,
    default: false
  },
  xWing: {
    type: Boolean,
    default: false
  },
  forcingChains: {
    type: Boolean,
    default: false
  },
  nakedQuad: {
    type: Boolean,
    default: false
  },
  hiddenQuad: {
    type: Boolean,
    default: false
  },
  swordfish: {
    type: Boolean,
    default: false
  }
});

const Puzzle = mongoose.model('puzzles', puzzleSchema);


module.exports = Puzzle;