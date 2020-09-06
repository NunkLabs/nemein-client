import mongoose from 'mongoose';

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
    default: Date.now(),
  },
});

const User = mongoose.model('User', UserSchema);

export default User;
