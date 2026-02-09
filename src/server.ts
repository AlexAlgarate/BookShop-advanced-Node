import mongoose from 'mongoose';
import { startHttpApi } from './ui/api';

const connectMongoDb = async (): Promise<void> => {
  await mongoose.connect('mongodb://admin:admin123@localhost:27017/db?authSource=admin');
  console.log('Mongodb connected!');
};

const executeApp = async (): Promise<void> => {
  try {
    await connectMongoDb();
    startHttpApi();
  } catch (error) {
    console.log('Unable to start application', error);
    process.exit(1);
  }
};

await executeApp();
