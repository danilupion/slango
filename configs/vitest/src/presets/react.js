import react from '@vitejs/plugin-react';
import cv8 from '@vitest/coverage-v8';
import { configDefaults, defineConfig } from 'vitest/config';

const vitestReactConfig = defineConfig({
  plugins: [cv8.getProvider(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      ...configDefaults.coverage,
      exclude: [...configDefaults.coverage.exclude, '**/lint-staged.config.js'],
    },
  },
  isolate: true,
});

export default vitestReactConfig;
