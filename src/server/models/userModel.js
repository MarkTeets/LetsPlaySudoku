const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  displayName: { type: String, required: true },
  lastPuzzleNumber: {type: Number, default: 0},
  allPuzzles: [
    {
      puzzleNumber: Number,
      progress: String,
    }
  ]
});

const User = mongoose.model('users', userSchema);


module.exports = User;