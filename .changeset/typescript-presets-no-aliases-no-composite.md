---
'@slango.configs/typescript': major
---

Remove the `@/*` path alias from all presets and stop setting `composite` and `incremental` in `default.json`.
Next's Turbopack does not resolve `${configDir}` in `paths` (so the inherited alias broke `next build`), and `tsc`
never rewrites aliases in Node build output. Declare aliases in your own tsconfig relative to it (`"@/*":
["./src/*"]`). Without `composite`/`incremental`, Turbo's cache can no longer drift from TypeScript's `.tsbuildinfo`
state and leave stale build output; opt back in per project if you use project references.
