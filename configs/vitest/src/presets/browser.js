import cv8 from '@vitest/coverage-v8';
import { configDefaults, defineConfig } from 'vitest/config';

const vitestBrowserConfig = defineConfig({
  plugins: [cv8.getProvider()],

  test: {
    environment: 'jsdom',
    coverage: {
      ...configDefaults.coverage,
      exclude: [...configDefaults.coverage.exclude, '**/lint-staged.config.js'],
    },
    isolate: true,
  },
});

export default vitestBrowserConfig;
