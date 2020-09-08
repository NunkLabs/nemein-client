import mongoose from 'mongoose';

interface IUser {
  emailAddress: string;
  displayName: string;
  profilePic: string;
  createdAt: Date;
  scores: [
    {
      score: number;
      timestamp: Date;
    }
  ];
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
    type: Date,
    required: true,
  },
  scores: [
    {
      _id: false,
      score: {
        type: Number,
      },
      timestamp: {
        type: Date,
      },
    },
  ],
});

const User = mongoose.model<IUser & mongoose.Document>('User', UserSchema);

export default User;
