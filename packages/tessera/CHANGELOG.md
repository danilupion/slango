# @slango/tessera

## 1.0.30

### Patch Changes

- dbbab76: Add explicit `files` field to all published packages. pnpm 11.13 changed `pnpm pack` to respect the workspace-root `.gitignore` (which lists `dist/`), so the last release shipped tarballs without build output, making packages that export from `dist` (mangusta, reazione, ristretto) unusable. An explicit `files` whitelist takes precedence over ignore files and keeps packing deterministic.

## 1.0.29

### Patch Changes

- 7d321c6: Dependencies bump

## 1.0.28

### Patch Changes

- 463d9ce: Dependencies bump

## 1.0.27

### Patch Changes

- 02b8cd1: Dependencies bump

## 1.0.26

### Patch Changes

- 75b71f7: Dependencies bump

## 1.0.25

### Patch Changes

- 7b9def8: Dependencies bump

## 1.0.24

### Patch Changes

- 59effbe: Dependencies bump

## 1.0.23

### Patch Changes

- 3e79aa6: Dependencies bump

## 1.0.22

### Patch Changes

- 70230d2: Dependencies bump

## 1.0.21

### Patch Changes

- f4e8645: Dependencies bump

## 1.0.20

### Patch Changes

- e80d5ac: Dependencies bump

## 1.0.19

### Patch Changes

- a692cf9: Dependencies bump

## 1.0.18

### Patch Changes

- dca0a26: Dependencies bump

## 1.0.17

### Patch Changes

- df2e3c2: Dependencies bump

## 1.0.16

### Patch Changes

- 6ab8613: Dependencies bump

## 1.0.15

### Patch Changes

- 07ec4aa: Dependencies bump

## 1.0.14

### Patch Changes

- 57f6c46: Dependencies bump

## 1.0.13

### Patch Changes

- 4ba0ccb: Dependencies bump

## 1.0.12

### Patch Changes

- 09ac7a7: Dependencies bump

## 1.0.11

### Patch Changes

- ad32208: Dependencies bump

## 1.0.10

### Patch Changes

- fafa8e1: Dependencies bump

## 1.0.9

### Patch Changes

- 3ceebbb: Dependencies bump

## 1.0.8

### Patch Changes

- 4e2e552: Dependencies bump

## 1.0.7

### Patch Changes

- b6cdd05: Dependencies bump

## 1.0.6

### Patch Changes

- 86530f1: Dependencies bump

## 1.0.5

### Patch Changes

- 8519268: Dependencies bump

## 1.0.4

### Patch Changes

- 5bcda82: Dependencies bump

## 1.0.3

### Patch Changes

- fb024e5: Dependencies bump

## 1.0.2

### Patch Changes

- 7d6305d: Dependencies bump

## 1.0.1

### Patch Changes

- 87e2b79: Dependencies bump

## 1.0.0

### Major Changes

- 9d73d40: First version (renamed from @slango/ts-utils)
