import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const vitestReactConfig = defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});

export default vitestReactConfig;
