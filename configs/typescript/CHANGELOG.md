# @slango.configs/typescript

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
