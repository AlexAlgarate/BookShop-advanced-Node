import { BookStatus } from '@domain/entities/Book';
import mongoose, { Types } from 'mongoose';

export interface BookMongoDb {
  title: string;
  description: string;
  price: number;
  author: string;
  status: BookStatus;
  soldAt: null | Date;
  createdAt: Date;
  updatedAt: Date;
  ownerId: Types.ObjectId;
  _id: Types.ObjectId;
}

const BookSchema = new mongoose.Schema<BookMongoDb>(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    author: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: [BookStatus.PUBLISHED, BookStatus.SOLD],
      default: BookStatus.PUBLISHED,
      required: true,
    },
    ownerId: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    soldAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const BookModel = mongoose.model('Book', BookSchema, 'Books');
