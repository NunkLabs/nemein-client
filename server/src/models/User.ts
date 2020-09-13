import mongoose from 'mongoose';

interface IUser {
  emailAddress: string;
  displayName: string;
  profilePic: string;
  createdAt: string;
  scores: Array<{
    score: number,
    timestamp: string
  }>;
}

const UserSchema = new mongoose.Schema({
  emailAddress: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
  },
  createdAt: {
    type: String,
    required: true,
  },
  scores: [
    {
      _id: false,
      score: {
        type: Number,
      },
      timestamp: {
        type: String,
      },
    },
  ],
});

const User = mongoose.model<IUser & mongoose.Document>('User', UserSchema);

export default User;
