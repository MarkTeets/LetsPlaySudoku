const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  displayName: String,
  allPuzzles: [
    {
      puzzleNumber: Number,
      progress: String,
      puzzleId: {
        type: Schema.Types.ObjectId,
        ref: 'Puzzle'
      }
    }
  ]
});

const User = mongoose.model('users', userSchema);


module.exports = User;