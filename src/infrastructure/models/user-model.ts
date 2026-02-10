import mongoose, { Types } from 'mongoose';

export interface UserMongoDb {
  email: string;
  password: string;
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<UserMongoDb>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('User', UserSchema, 'Users');
