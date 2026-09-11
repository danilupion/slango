# @slango.configs/scripts

## 1.2.3

### Patch Changes

- 38adbaa: Dependencies bump

## 1.2.2

### Patch Changes

- c1dfac0: Lint with oxlint (`@slango.configs/oxlint`) instead of ESLint. No runtime changes, except in `@slango/reazione` where `useMounted`, `useDebouncedCallback` and `useClickOutside` were reworked to satisfy the React Compiler rules (`useSyncExternalStore`, ref updates in a layout effect, `useEffectEvent`) with unchanged behaviour, and in `@slango/ristretto` where `withBearerToken` / `withJsonBody` now merge `Headers` instances and header entry arrays correctly instead of spreading them as arrays.

## 1.2.1

### Patch Changes

- dbbab76: Add explicit `files` field to all published packages. pnpm 11.13 changed `pnpm pack` to respect the workspace-root `.gitignore` (which lists `dist/`), so the last release shipped tarballs without build output, making packages that export from `dist` (mangusta, reazione, ristretto) unusable. An explicit `files` whitelist takes precedence over ignore files and keeps packing deterministic.

## 1.2.0

### Minor Changes

- 13f54b1: Add clean-docker-images script with scoped pruning based on the repo package name.

## 1.1.0

### Minor Changes

- fe4fee1: Support for .nextjs build artifacts

## 1.0.0

### Major Changes

- 26855a3: Initial release
