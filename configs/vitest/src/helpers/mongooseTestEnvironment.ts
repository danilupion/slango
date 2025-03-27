import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { ConnectionStates } from 'mongoose';
import { afterAll, afterEach, beforeAll } from 'vitest';

type SetupMongoTestEnvironmentOptions = {
  preserveCollections?: string[];
};

export function setupMongoTestEnvironment({
  preserveCollections = [],
}: SetupMongoTestEnvironmentOptions = {}) {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGO_URI = uri;
    await mongoose.connect(uri, { dbName: 'test-db' });

    await waitForDatabaseConnection();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.collections();
      for (const collection of collections) {
        if (!preserveCollections.includes(collection.collectionName)) {
          await collection.deleteMany({});
        }
      }
    }
  });
}

async function waitForDatabaseConnection(maxRetries = 5, interval = 1000) {
  let retries = 0;

  while (mongoose.connection.readyState !== ConnectionStates.connected && retries < maxRetries) {
    await new Promise((resolve) => setTimeout(resolve, interval));
    retries++;
    console.log(`Retrying database connection (${retries}/${maxRetries})...`);
  }

  if (mongoose.connection.readyState !== ConnectionStates.connected) {
    throw new Error('Failed to connect to the database within the allowed retries.');
  }
}
