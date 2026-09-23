import { MongoBinary } from 'mongodb-memory-server';

/**
 * Ensures the MongoDB binary is downloaded once before test workers start.
 * Without this, parallel test files race to download it into the same cache path on a cold
 * cache (e.g. CI), failing with ENOENT on rename and hook timeouts.
 */
export async function setup() {
  await MongoBinary.getPath();
}
