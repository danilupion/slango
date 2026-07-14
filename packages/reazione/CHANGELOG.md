# @slango/reazione

## 1.0.8

### Patch Changes

- dbbab76: Add explicit `files` field to all published packages. pnpm 11.13 changed `pnpm pack` to respect the workspace-root `.gitignore` (which lists `dist/`), so the last release shipped tarballs without build output, making packages that export from `dist` (mangusta, reazione, ristretto) unusable. An explicit `files` whitelist takes precedence over ignore files and keeps packing deterministic.

## 1.0.7

### Patch Changes

- 7d321c6: Dependencies bump

## 1.0.6

### Patch Changes

- 463d9ce: Dependencies bump

## 1.0.5

### Patch Changes

- 02b8cd1: Dependencies bump

## 1.0.4

### Patch Changes

- 75b71f7: Dependencies bump

## 1.0.3

### Patch Changes

- 7b9def8: Dependencies bump

## 1.0.2

### Patch Changes

- 1052e1d: Dependencies bump

## 1.0.1

### Patch Changes

- 52a706b: Dependencies bump

## 1.0.0

### Major Changes

- a0c8af4: First version. Generic react hooks: useDebouncedCallback, useMounted, useClickOutside, useClientValue, usePreventScrolling and useScrollEdge.
