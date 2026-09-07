import preset from '@slango.configs/oxlint/javascript-node.js';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [preset],
  ignorePatterns: ['apps/**', 'configs/**', 'packages/**'],
});
