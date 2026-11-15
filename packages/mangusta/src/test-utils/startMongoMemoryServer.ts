import { MongoMemoryServer } from 'mongodb-memory-server';

const PORT_IN_USE = /^Port "\d+" already in use$/;

/**
 * Starts a MongoMemoryServer, retrying when the port it picked was taken before mongod bound it.
 *
 * mongodb-memory-server finds a free port by listening on it and closing it again, then starts
 * mongod on that port. Between the two, another process (a parallel test worker's server, or a
 * client socket's ephemeral port) can take it, and mongod exits with `Port "N" already in use`.
 * A new server picks a new port, so a retry is all it takes.
 */
export async function startMongoMemoryServer(attempts = 5): Promise<MongoMemoryServer> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await MongoMemoryServer.create();
    } catch (error) {
      if (attempt >= attempts || !(error instanceof Error) || !PORT_IN_USE.test(error.message)) {
        throw error;
      }
    }
  }
}
