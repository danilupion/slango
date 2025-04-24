import cv8 from '@vitest/coverage-v8';
import { configDefaults, defineConfig } from 'vitest/config';

const vitestConfig = defineConfig({
  plugins: [cv8.getProvider()],
  test: {
    coverage: {
      ...configDefaults.coverage,
      exclude: [...configDefaults.coverage.exclude, '**/lint-staged.config.js'],
    },
    isolate: true,
  },
});

export default vitestConfig;
