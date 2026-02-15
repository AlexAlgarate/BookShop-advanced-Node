import mongoose from 'mongoose';
import { environmentService } from '@infrastructure/services/environment-service';

export const connectToMongoDb = async (): Promise<void> => {
  const { MONGO_USER, MONGO_PASSWORD, MONGO_HOST } = environmentService.get();

  try {
    await mongoose.connect(
      `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/db_project?authSource=admin`
    );
    console.log('Mongodb connected!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};
