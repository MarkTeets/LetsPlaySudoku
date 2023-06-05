const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// dotenv.config();

// // Allow guests to see a single sample puzzle for now
// const MONGO_URI='mongodb+srv://markteets:PV0m4ZjwEg3wZwIT@sudoku-db.ox6sdpn.mongodb.net/?retryWrites=true&w=majority';
// //const MONGO_URI = process.env.SUDOKU_MONGO_URI;

// mongoose.connect(MONGO_URI, {
//   dbName: 'sudoku'
// })
//   .then(() => console.log('Connected to Mongo DB!'))
//   .catch(err => console.log('Database error: ', err.message));

const Schema = mongoose.Schema;


const puzzleSchema = new Schema({
  number: Number,
  puzzle: String,
  solution: String,
  uniqueSolution: {
    type: Boolean,
    default: false
  },
  solveLevel: {
    difficultyScore: {
      type: Number,
      default: 1
    },
    singleCandidate: {
      type: Boolean,
      default: false
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
  }
});

const Puzzle = mongoose.model('puzzles', puzzleSchema);


module.exports = {
  Puzzle
};