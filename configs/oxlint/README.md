# ![oxlint](https://img.shields.io/badge/oxlint-00F7F1?style=flat-square&logo=oxc) Slango oxlint Configs (@slango.configs/oxlint)

This package exposes oxlint configurations for easy setup, replacing [`@slango.configs/eslint`](../eslint/README.md) for projects on
TypeScript 7, where typescript-eslint can no longer run. Type-aware rules are provided by
[tsgolint](https://github.com/oxc-project/tsgolint) (built on TypeScript 7), everything
oxlint has no native port for (`perfectionist`, `regexp`) is loaded through oxlint's JS plugin
bridge from this package, so consumers need no extra plugin dependencies.

| Name                    | Description                                                                  | Includes                         |
| ----------------------- | ---------------------------------------------------------------------------- | -------------------------------- |
| `javascript-node`       | Tooling javascript files (eg: `lint-staged.config.js`, `prettier.config.js`) | -                                |
| `typescript`            | Typescript based projects and libraries                                      | `javascript-node`                |
| `typescript-node`       | Typescript based node projects and libraries                                 | `javascript-node` + `typescript` |
| `typescript-browser`    | Typescript based browser projects and libraries                              | `javascript-node` + `typescript` |
| `typescript-isomorphic` | Typescript libraries targeting node and browsers                             | `javascript-node` + `typescript` |
| `typescript-react`      | Typescript based react projects (Vite, WXT, ...)                             | `typescript-browser`             |
| `typescript-next`       | Typescript based next.js applications                                        | `typescript-react`               |

## Included rules

Presets enable oxlint's own recommended set, the **`correctness`** category ("code that is
definitely wrong or useless"), for oxlint's default plugins (`eslint`, `typescript`, `unicorn`,
`oxc`) plus `import`, `node` and `promise`. React presets add the `react` and `jsx-a11y` plugins,
the Next preset adds `nextjs`. With `--type-aware`, the category also covers tsgolint's typed
rules (`no-floating-promises`, `await-thenable`, `unbound-method`, ...).

On top of the category:

| Source                                                                                        | Available in preset                                                                               | How                                         |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `eslint-plugin-regexp` recommended                                                            | `all`                                                                                             | JS plugin, rule list read from the plugin   |
| `eslint-plugin-perfectionist` (tiered)                                                        | `all`                                                                                             | JS plugin, see options                      |
| `no-unused-vars` (`ignoreRestSiblings`), `import/first`, `import/no-anonymous-default-export` | `all`                                                                                             | explicit                                    |
| `react/rules-of-hooks`                                                                        | `typescript-react`, `-next`                                                                       | explicit (oxlint files it under `pedantic`) |
| `react/only-export-components`                                                                | `typescript-react` (`eslint-plugin-react-refresh` vite options), `typescript-next` (next options) | explicit                                    |

Other categories (`suspicious`, `pedantic`, `perf`, `style`, `restriction`, `nursery`) are off.
Enable them in your own config if wanted, e.g. `categories: { suspicious: 'warn' }`. Note that
oxlint files typescript-eslint's `no-unsafe-*`, `no-misused-promises` and `require-await` under
`pedantic`, so unlike `@slango.configs/eslint` they are not on by default.

Intentionally not carried over from `@slango.configs/eslint`:

- `eslint-plugin-prettier`: run prettier directly (lint-staged already does).
- `eslint-plugin-eslint-comments`: use `oxlint --report-unused-disable-directives`.

## Usage

The package is written in TypeScript and ships `dist` with declarations, so `oxlint.config.ts`
files are fully typed against oxlint's `OxlintConfig`.

Add `@slango.configs/oxlint`, `oxlint` and `oxlint-tsgolint` as dev dependencies, then create
an `oxlint.config.ts` in the package (only `.ts` / `.mts` config files are auto-discovered):

```ts
// oxlint.config.ts
export { default } from '@slango.configs/oxlint/typescript-node.js';
```

```jsonc
// package.json
{
  "scripts": {
    "lint": "oxlint --type-aware --max-warnings 0 .",
    "lint:fix": "oxlint --type-aware --fix --max-warnings 0 .",
  },
}
```

To customise, extend the preset with `defineConfig` (ignore patterns are resolved relative to
the config file, later entries win):

```ts
// oxlint.config.ts
import { defineConfig } from 'oxlint';
import { createTypescriptNodeConfig } from '@slango.configs/oxlint/typescript-node.js';

export default defineConfig({
  extends: [createTypescriptNodeConfig({ perfectionist: 'moderate' })],
  ignorePatterns: ['src/generated/**'],
  overrides: [{ files: ['**/*.ts'], rules: { 'typescript/require-await': 'off' } }],
});
```

### Options

| Option          | Values                                         | Default     | Presets |
| --------------- | ---------------------------------------------- | ----------- | ------- |
| `perfectionist` | `'off' \| 'relaxed' \| 'moderate' \| 'strict'` | `'relaxed'` | all     |

`perfectionist` tiers are the same as in `@slango.configs/eslint`.

## Migrating from `@slango.configs/eslint`

- Swap `eslint.config.js` for `oxlint.config.ts` and the `lint` scripts as above; delete
  `eslint`, `@slango.configs/eslint` and any `eslint-plugin-*` dev dependencies.
- `// eslint-disable` comments keep working; prefer `// oxlint-disable`.
- Type-aware linting needs TypeScript 7 semantics (tsgolint bundles its own compiler): a
  `tsconfig.json` per package, files outside its `include` should be ignored.
- JS plugin fixes are single-pass: `oxlint --fix` may need a second run to fully sort
  imports and named imports.
- Rule selection follows oxlint's `correctness` category, not typescript-eslint's
  `recommendedTypeChecked`: expect a few new `unicorn/*` and `oxc/*` findings, and no
  `no-unsafe-*` findings unless you enable `pedantic` rules yourself.
- Expect new findings the ESLint presets missed before `@slango.configs/eslint` 1.3:
  `import/first` (silently off for TypeScript files) and the `react/*` hooks and React Compiler
  rules (the plugins were registered without rules).
