import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const fileCandidates = ['tsconfig.lint.json', 'tsconfig.json'];

export const getTsConfigFile = () => {
  return fileCandidates
    .map((file) => resolve(process.cwd(), file))
    .find((file) => existsSync(file));
};
