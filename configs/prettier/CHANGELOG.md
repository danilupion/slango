# @slango.configs/prettier

## 1.0.24

### Patch Changes

- dbbab76: Add explicit `files` field to all published packages. pnpm 11.13 changed `pnpm pack` to respect the workspace-root `.gitignore` (which lists `dist/`), so the last release shipped tarballs without build output, making packages that export from `dist` (mangusta, reazione, ristretto) unusable. An explicit `files` whitelist takes precedence over ignore files and keeps packing deterministic.

## 1.0.23

### Patch Changes

- 7d321c6: Dependencies bump

## 1.0.22

### Patch Changes

- 02b8cd1: Dependencies bump

## 1.0.21

### Patch Changes

- a724ce8: Dependencies bump

## 1.0.20

### Patch Changes

- 7b9def8: Dependencies bump

## 1.0.19

### Patch Changes

- 3e79aa6: Dependencies bump

## 1.0.18

### Patch Changes

- f4e8645: Dependencies bump

## 1.0.17

### Patch Changes

- 424a2cf: Dependencies bump

## 1.0.16

### Patch Changes

- e80d5ac: Dependencies bump

## 1.0.15

### Patch Changes

- a692cf9: Dependencies bump

## 1.0.14

### Patch Changes

- dca0a26: Dependencies bump

## 1.0.13

### Patch Changes

- 6ab8613: Dependencies bump

## 1.0.12

### Patch Changes

- 4ba0ccb: Dependencies bump

## 1.0.11

### Patch Changes

- ad32208: Dependencies bump

## 1.0.10

### Patch Changes

- fafa8e1: Dependencies bump

## 1.0.9

### Patch Changes

- e0ffe5d: Dependencies bump

## 1.0.8

### Patch Changes

- 2077ac1: Dependencies bump

## 1.0.7

### Patch Changes

- 79e1b7e: Dependencies bump

## 1.0.6

### Patch Changes

- 5bcda82: Dependencies bump

## 1.0.5

### Patch Changes

- fb024e5: Dependencies bump

## 1.0.4

### Patch Changes

- 87e2b79: Dependencies bump

## 1.0.3

### Patch Changes

- Dependencies bumps and devDependencies rework

## 1.0.2

### Patch Changes

- Dependencies bump

## 1.0.1

### Patch Changes

- Dependencies bump

## 1.0.0

### Major Changes

- 26855a3: Initial release
