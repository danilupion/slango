---
'@slango.configs/vitest': minor
---

Rewrite the presets in TypeScript and publish them from `dist/` with generated type declarations, so consumers can
use `vitest.config.ts`. Import paths are unchanged. The coverage `exclude` spread now tolerates an undefined default.
