# @slango.configs/typescript

## 3.0.0

### Major Changes

- 5d3eac8: Remove the `@/*` path alias from all presets and stop setting `composite` and `incremental` in `default.json`.
  Next's Turbopack does not resolve `${configDir}` in `paths` (so the inherited alias broke `next build`), and `tsc`
  never rewrites aliases in Node build output. Declare aliases in your own tsconfig relative to it (`"@/*":
["./src/*"]`). Without `composite`/`incremental`, Turbo's cache can no longer drift from TypeScript's `.tsbuildinfo`
  state and leave stale build output; opt back in per project if you use project references.

## 2.1.0

### Minor Changes

- 5f02ada: Add a `node` preset (`types: ["node"]`, ES2022 lib without DOM types) for TypeScript 7, which no longer loads `@types/*`
  automatically. Resolve `paths`, and the `include`/`exclude` of the `next` and `react` presets, against the consuming
  tsconfig via `${configDir}` (they previously resolved inside the preset package). Disable `declaration`,
  `declarationMap` and `composite` in the `next` and `react` presets, fixing TS2883 "cannot be named" errors in no-emit
  apps.

## 2.0.17

### Patch Changes

- 252346d: Dependencies bump

## 2.0.16

### Patch Changes

- c1dfac0: Lint with oxlint (`@slango.configs/oxlint`) instead of ESLint. No runtime changes, except in `@slango/reazione` where `useMounted`, `useDebouncedCallback` and `useClickOutside` were reworked to satisfy the React Compiler rules (`useSyncExternalStore`, ref updates in a layout effect, `useEffectEvent`) with unchanged behaviour, and in `@slango/ristretto` where `withBearerToken` / `withJsonBody` now merge `Headers` instances and header entry arrays correctly instead of spreading them as arrays.

## 2.0.15

### Patch Changes

- 4105a76: Dependencies bump

## 2.0.14

### Patch Changes

- 7bd8cbc: Dependencies bump

## 2.0.13

### Patch Changes

- d59333c: Dependencies bump

## 2.0.12

### Patch Changes

- edf7da7: Dependencies bump

## 2.0.11

### Patch Changes

- 8dd6862: Rolled bacy typescript upgrade
- de1db71: Dependencies bump

## 2.0.10

### Patch Changes

- dbbab76: Add explicit `files` field to all published packages. pnpm 11.13 changed `pnpm pack` to respect the workspace-root `.gitignore` (which lists `dist/`), so the last release shipped tarballs without build output, making packages that export from `dist` (mangusta, reazione, ristretto) unusable. An explicit `files` whitelist takes precedence over ignore files and keeps packing deterministic.

## 2.0.9

### Patch Changes

- 7d321c6: Dependencies bump

## 2.0.8

### Patch Changes

- 02b8cd1: Dependencies bump

## 2.0.7

### Patch Changes

- 7b9def8: Dependencies bump

## 2.0.6

### Patch Changes

- 3e79aa6: Dependencies bump

## 2.0.5

### Patch Changes

- f4e8645: Dependencies bump

## 2.0.4

### Patch Changes

- 424a2cf: Dependencies bump

## 2.0.3

### Patch Changes

- e80d5ac: Dependencies bump

## 2.0.2

### Patch Changes

- a692cf9: Dependencies bump

## 2.0.1

### Patch Changes

- 6ab8613: Dependencies bump

## 2.0.0

### Major Changes

- 57f6c46: Dependencies bump

## 1.0.10

### Patch Changes

- 4ba0ccb: Dependencies bump

## 1.0.9

### Patch Changes

- ad32208: Dependencies bump

## 1.0.8

### Patch Changes

- fafa8e1: Dependencies bump

## 1.0.7

### Patch Changes

- 5bcda82: Dependencies bump

## 1.0.6

### Patch Changes

- fb024e5: Dependencies bump

## 1.0.5

### Patch Changes

- 87e2b79: Dependencies bump

## 1.0.4

### Patch Changes

- Dependencies bump

## 1.0.3

### Patch Changes

- Dependencies bumps and devDependencies rework

## 1.0.2

### Patch Changes

- React config package

## 1.0.1

### Patch Changes

- Dependencies bump

## 1.0.0

### Major Changes

- 26855a3: Initial release
