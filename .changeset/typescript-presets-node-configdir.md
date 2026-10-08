---
'@slango.configs/typescript': minor
---

Add a `node` preset (`types: ["node"]`, ES2022 lib without DOM types) for TypeScript 7, which no longer loads `@types/*`
automatically. Resolve `paths`, and the `include`/`exclude` of the `next` and `react` presets, against the consuming
tsconfig via `${configDir}` (they previously resolved inside the preset package). Disable `declaration`,
`declarationMap` and `composite` in the `next` and `react` presets, fixing TS2883 "cannot be named" errors in no-emit
apps.
