import { defineConfig } from 'vitest/config';

const vitestReactConfig = defineConfig({
  test: {
    environment: 'jsdom',
  },
});

export default vitestReactConfig;
