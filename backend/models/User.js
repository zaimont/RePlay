import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required:true,
    enum: ['admin', 'manager', 'user'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
},{
  timestamps: true
});

export default mongoose.model('User', userSchema);
