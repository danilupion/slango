---
'@slango/mangusta': patch
'@slango/reazione': patch
'@slango/ristretto': patch
'@slango/tessera': patch
'@slango.configs/eslint': patch
'@slango.configs/lint-staged': patch
'@slango.configs/prettier': patch
'@slango.configs/scripts': patch
'@slango.configs/typescript': patch
'@slango.configs/vitest': patch
---

Add explicit `files` field to all published packages. pnpm 11.13 changed `pnpm pack` to respect the workspace-root `.gitignore` (which lists `dist/`), so the last release shipped tarballs without build output, making packages that export from `dist` (mangusta, reazione, ristretto) unusable. An explicit `files` whitelist takes precedence over ignore files and keeps packing deterministic.
