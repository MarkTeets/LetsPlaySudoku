const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.SUDOKU_MONGO_URI;

// console.log(MONGO_URI);

mongoose.connect(MONGO_URI, {
  dbName: 'sudoku'
})
  .then(() => console.log('Connected to Mongo DB!'))
  .catch(err => console.log('Database error: ', err.message))

const Schema = mongoose.Schema;

const puzzleSchema = new Schema({
  puzzle:	String,
  solution:	String,
  difficulty:	Number,
  solvable_level: {
    type: Schema.Types.ObjectId,
    ref: 'solveLevel'
  },
    unique_solution: Boolean
})

const Puzzle = mongoose.model('puzzles', puzzleSchema)



module.exports = {
  Puzzle
}