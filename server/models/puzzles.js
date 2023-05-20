const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Allow guests to see a single sample puzzle for now
MONGO_URI="mongodb+srv://markteets:PV0m4ZjwEg3wZwIT@sudoku-db.ox6sdpn.mongodb.net/?retryWrites=true&w=majority"
//const MONGO_URI = process.env.SUDOKU_MONGO_URI;

mongoose.connect(MONGO_URI, {
  dbName: 'sudoku'
})
  .then(() => console.log('Connected to Mongo DB!'))
  .catch(err => console.log('Database error: ', err.message))

const Schema = mongoose.Schema;

const puzzleSchema = new Schema({
  number: Number,
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