import 'reflect-metadata';

import { environmentService } from '@infrastructure/services/environment-service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { container } from '@di/container';
import { EMAIL_SERVICE } from '@di/tokens';

import { Application } from 'express';
import { registerTestBindings } from '@di/tests-bindings';
import { createApp } from '@ui/api';

let mongo: MongoMemoryServer;

let testApp: Application;
beforeAll(async () => {
  environmentService.load();
  registerTestBindings();
  container.rebind(EMAIL_SERVICE).toConstantValue({
    sendEmailToSeller: vi.fn(),
  });
  mongo = await MongoMemoryServer.create({
    binary: { version: '7.0.11' },
  });

  await mongoose.connect(mongo.getUri());
  testApp = createApp();
}, 120000);

export const getTestApp = (): Application => testApp;

afterEach(async () => {
  const collections = (await mongoose.connection.db?.collections()) ?? [];
  await Promise.all(collections.map(c => c.deleteMany({})));

  await mongoose.connection.syncIndexes();
  mongoose.deleteModel(/.*/);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo?.stop();
});
