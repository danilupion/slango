import cv8 from '@vitest/coverage-v8';
import { configDefaults, defineConfig, type ViteUserConfig } from 'vitest/config';

const vitestBrowserConfig: ViteUserConfig = defineConfig({
  plugins: [cv8.getProvider()],

  test: {
    environment: 'jsdom',
    coverage: {
      ...configDefaults.coverage,
      exclude: [...(configDefaults.coverage.exclude ?? []), '**/lint-staged.config.js'],
    },
    isolate: true,
  },
});

export default vitestBrowserConfig;
