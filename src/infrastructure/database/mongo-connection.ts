import mongoose from 'mongoose';
import { environmentService } from '@infrastructure/services/environment-service';
import { getLogger } from '@infrastructure/services/logger-init';

const logger = getLogger();

export const connectToMongoDb = async (): Promise<void> => {
  const { MONGO_USER, MONGO_PASSWORD, MONGO_HOST } = environmentService.get();

  await mongoose.connect(
    `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/db_project?authSource=admin`
  );
  logger.log('Mongodb connected!');
};
