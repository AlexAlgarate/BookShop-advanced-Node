import { environmentService } from '@infrastructure/services/environment-service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  environmentService.load();
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri);
});

afterEach(async () => {
  const collections = (await mongoose.connection.db?.collections()) ?? [];

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});
