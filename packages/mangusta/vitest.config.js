import defaultConfig from '@slango.configs/vitest/default';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  defaultConfig,
  defineConfig({
    test: {
      globalSetup: ['./vitest.globalSetup.ts'],
    },
  }),
);
