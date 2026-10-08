# ![Vitest](https://img.shields.io/badge/Vitest-F9C72C?style=flat-square&logo=vitest) Slango Vitest Configs (@slango.configs/vitest)

This package exposes vitest configurations for easy setup.

## Usage

```ts
// vitest.config.ts (or vitest.config.js)
export { default } from '@slango.configs/vitest/default';
```

Presets: `default`, `browser` (jsdom), `react` (jsdom, globals, React plugin) and `nestjs` (SWC for decorators). They
are written in TypeScript and published with generated type declarations, so the config can be TypeScript too. Import
without the `.js` extension: the package's exports map adds it.
