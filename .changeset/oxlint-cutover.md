---
'@slango/mangusta': patch
'@slango/reazione': patch
'@slango/ristretto': patch
'@slango/tessera': patch
'@slango.configs/eslint': patch
'@slango.configs/prettier': patch
'@slango.configs/scripts': patch
'@slango.configs/typescript': patch
'@slango.configs/vitest': patch
---

Lint with oxlint (`@slango.configs/oxlint`) instead of ESLint. No runtime changes, except in `@slango/reazione` where `useMounted`, `useDebouncedCallback` and `useClickOutside` were reworked to satisfy the React Compiler rules (`useSyncExternalStore`, ref updates in a layout effect, `useEffectEvent`) with unchanged behaviour, and in `@slango/ristretto` where `withBearerToken` / `withJsonBody` now merge `Headers` instances and header entry arrays correctly instead of spreading them as arrays.
