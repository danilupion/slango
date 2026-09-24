---
'@slango.configs/lint-staged': patch
---

Pass `--no-error-on-unmatched-pattern` to the oxlint tasks. Since oxlint 1.83, committing only files that match a package's `ignorePatterns` (e.g. `next-env.d.ts`) made oxlint exit with "No files found to lint" and aborted the commit.
