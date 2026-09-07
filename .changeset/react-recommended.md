---
'@slango.configs/eslint': minor
---

`typescript-react` and `typescript-next` presets now enable `eslint-plugin-react-hooks` recommended rules (`rules-of-hooks`, `exhaustive-deps` and the React Compiler rules) and `eslint-plugin-react-refresh` (`vite` config for react, `next` config for next). Both plugins were previously registered without enabling any rule.
