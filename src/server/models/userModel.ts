import { Schema, model } from 'mongoose';

// Types
import { UserDocument } from '../backendTypes';

const userSchema = new Schema<UserDocument>({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  displayName: { type: String, required: true },
  lastPuzzle: { type: Number, default: 0 },
  allPuzzles: [
    {
      puzzleNumber: Number,
      progress: String,
      pencilProgress: String
    }
  ]
});

const UserModel = model('users', userSchema);

export default UserModel;
