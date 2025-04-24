import cv8 from '@vitest/coverage-v8';
import swc from 'unplugin-swc';
import { configDefaults, defineConfig } from 'vitest/config';

const vitestNestJsConfig = defineConfig({
  plugins: [cv8.getProvider(), swc.vite()],
  test: {
    coverage: {
      ...configDefaults.coverage,
      exclude: [...configDefaults.coverage.exclude, '**/lint-staged.config.js'],
    },
    isolate: true,
  },
});

export default vitestNestJsConfig;
