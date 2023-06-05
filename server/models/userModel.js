const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  nickname: String,
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  allPuzzles: [
    {
      progress: String,
      puzzle: {
        type: Schema.Types.ObjectId,
        ref: 'Puzzle'
      }
    }
  ]
});

const User = mongoose.model('users', userSchema);


module.exports = User;