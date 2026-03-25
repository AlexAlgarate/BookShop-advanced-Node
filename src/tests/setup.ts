import 'reflect-metadata';

import { environmentService } from '@infrastructure/services/environment-service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { container } from '@di/container';
import { registerInfrastructureBindings } from '@di/infrastructure-bindings';
import { registerUseCaseBindings } from '@di/usecase-bindings';
import { EMAIL_SERVICE } from '@di/tokens';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  environmentService.load();
  registerInfrastructureBindings();
  registerUseCaseBindings();
  container.rebind(EMAIL_SERVICE).toConstantValue({
    sendEmailToSeller: vi.fn(),
  });
  mongo = await MongoMemoryServer.create({
    binary: { version: '7.0.11' },
  });

  await mongoose.connect(mongo.getUri());
}, 120000);

afterEach(async () => {
  const db = mongoose.connection.db;
  if (!db) return;

  await db.dropDatabase();
  await mongoose.connection.syncIndexes();
  mongoose.deleteModel(/.*/);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo?.stop();
});
