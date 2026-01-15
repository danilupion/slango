import type { TestProject } from 'vitest/node';

import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

export async function setup(project: TestProject) {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Type assertion needed as vitest's ProvidedContext typing is complex
  (project.provide as (key: string, value: string) => void)('MONGO_URI', uri);

  console.log('[mangusta] MongoDB Memory Server started:', uri);
}

export async function teardown() {
  if (mongoServer) {
    await mongoServer.stop();
    console.log('[mangusta] MongoDB Memory Server stopped');
  }
}
