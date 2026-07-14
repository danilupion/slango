# @slango.configs/scripts

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
