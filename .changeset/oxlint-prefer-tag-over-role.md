---
'@slango.configs/oxlint': patch
---

React presets: turn off `jsx-a11y/prefer-tag-over-role` (not part of eslint-plugin-jsx-a11y recommended/strict; it rejects ARIA composite widgets such as combobox listboxes that must use `role`).
