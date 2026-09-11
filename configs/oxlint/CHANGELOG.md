# @slango.configs/oxlint

## 0.1.3

### Patch Changes

- 38adbaa: Dependencies bump

## 0.1.2

### Patch Changes

- 63130ba: React presets: turn off `jsx-a11y/prefer-tag-over-role` (not part of eslint-plugin-jsx-a11y recommended/strict; it rejects ARIA composite widgets such as combobox listboxes that must use `role`).

## 0.1.1

### Patch Changes

- 5a48a9a: Dependencies bump

## 0.1.0

### Minor Changes

- c1dfac0: Add `@slango.configs/oxlint` presets (oxlint's `correctness` category + tsgolint type-aware rules, perfectionist tiers and regexp recommended via JS plugins; replaces `@slango.configs/eslint` on TypeScript 7) and `javascript-oxlint` / `typescript-oxlint` / `typescript-oxlint-no-tests` lint-staged presets.
