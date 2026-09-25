---
'@slango.configs/vitest': patch
---

Move `isolate: true` under `test` in the React preset. It sat at the top level of the config, where Vitest ignores it, so the preset relied on the default instead of setting it explicitly like the other presets.
