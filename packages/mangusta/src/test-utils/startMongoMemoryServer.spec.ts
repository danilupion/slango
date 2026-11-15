import { MongoMemoryServer } from 'mongodb-memory-server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { startMongoMemoryServer } from './startMongoMemoryServer.js';

const portInUse = () => new Error('Port "52829" already in use');

describe('startMongoMemoryServer', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('retries when the port was taken before mongod bound it', async () => {
    const server = {} as MongoMemoryServer;
    const create = vi
      .spyOn(MongoMemoryServer, 'create')
      .mockRejectedValueOnce(portInUse())
      .mockRejectedValueOnce(portInUse())
      .mockResolvedValueOnce(server);

    await expect(startMongoMemoryServer()).resolves.toBe(server);
    expect(create).toHaveBeenCalledTimes(3);
  });

  it('gives up after the given attempts', async () => {
    const create = vi.spyOn(MongoMemoryServer, 'create').mockRejectedValue(portInUse());

    await expect(startMongoMemoryServer(3)).rejects.toThrow('Port "52829" already in use');
    expect(create).toHaveBeenCalledTimes(3);
  });

  it('does not retry any other failure', async () => {
    const create = vi
      .spyOn(MongoMemoryServer, 'create')
      .mockRejectedValue(new Error('spawn Unknown system error -86'));

    await expect(startMongoMemoryServer()).rejects.toThrow('spawn Unknown system error -86');
    expect(create).toHaveBeenCalledTimes(1);
  });
});
