import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  displayName: { type: String, required: true },
  lastPuzzle: { type: Number, default: 0 },
  allPuzzles: [
    {
      puzzleNumber: Number,
      progress: String
    }
  ]
});

const User = mongoose.model('users', userSchema);

export default User;
