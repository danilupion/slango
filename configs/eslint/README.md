# ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint) Slango Eslint Configs (@slango.configs/eslint)

This package exposes eslint configurations for easy setup, the following presets are available:

| Name                 | Description                                                                                         | Includes                         |
| -------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------- |
| `javascript-node`    | Intended to be used for tooling javascript files (eg: eslint.confg.js, linte-staged.config.js, ...) | -                                |
| `typescript`         | Intended to be used for typescript based projects and libraries                                     | `javascript-node`                |
| `typescript-node`    | Intended to be used for typescript based node projects and libraries                                | `javascript-node` + `typescript` |
| `typescript-browser` | Intended to be used for typescript based browser projects and libraries                             | `javascript-node` + `typescript` |
| `typescript-next`    | Intended to be used for typescript based next.js applications                                       | `javascript-node` + `typescript` |

## Included plugins/configs

| Name                                                                                                             | Available in Preset      | Description                                              |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------------------------------------- |
| [`@eslint/js` recommended](https://github.com/eslint/eslint)                                                     | `all`                    | @eslint/js official recommended configuration            |
| [`eslint-plugin-eslint-comments` recommended](https://github.com/eslint-community/eslint-plugin-eslint-comments) | `all`                    | Comments from @eslint-community for comments             |
| [`eslint-plugin-perfectionist`](https://github.com/azat-io/eslint-plugin-perfectionist)                          | `all`                    | Configurable sorting rules with tiered strictness levels |
| [`eslint-plugin-regex` recommended](https://github.com/ota-meshi/eslint-plugin-regexp)                           | `all`                    | Recommended config from regexp-eslint-plugin             |
| [`eslint-plugin-prettier` recommended](https://github.com/prettier/eslint-plugin-prettier)                       | `all`                    | Prettier official eslint plugin's recommended config     |
| [`eslint-plugin-import` recommended](https://github.com/import-js/eslint-plugin-import)                          | `all`                    | Prettier official eslint plugin's recommended config     |
| [`typescript-eslint` recommendedTypeChecked](https://github.com/typescript-eslint/typescript-eslint)             | `all typescript configs` | Typescript Eslint type checked recommended config        |
| [`next/core-web-vitals`](https://nextjs.org/docs/app/building-your-application/configuring/eslint)               | `typescript-next`        | Next.js official eslint config                           |

## Usage

Add @slango.configs/eslint to your package.json as a dev dependency, then create a eslint.config.js file in the package.

Unless you want to override the default configuration, you can simply extend the configuration as follows:

```js
// eslint.config.js
export { default } from '@slango.configs/eslint/{preset-you-wish-to-use}.js';
```

### Perfectionist rule strictness

Perfectionist sorting rules are organized into **tiers** and can be configured with four levels of strictness:

| Level      | Description                                        | Use Case                                 |
| ---------- | -------------------------------------------------- | ---------------------------------------- |
| `off`      | All perfectionist rules disabled                   | When you want no automatic sorting       |
| `relaxed`  | Import/export sorting only **(default)**           | Universally accepted, industry standard  |
| `moderate` | Adds type sorting (interfaces, unions, enums)      | Good for type-heavy TypeScript codebases |
| `strict`   | Full sorting including objects, classes, JSX props | Maximum consistency, use with caution    |

#### Rule tiers

**Tier 1 - Import/Export sorting** (`relaxed`+)

- `sort-imports`, `sort-named-imports`, `sort-named-exports`, `sort-exports`
- `sort-import-attributes`, `sort-export-attributes`, `sort-modules`

**Tier 2 - Type sorting** (`moderate`+)

- `sort-union-types`, `sort-intersection-types`, `sort-heritage-clauses`
- `sort-object-types`, `sort-interfaces`, `sort-enums`

**Tier 3 - Full sorting** (`strict` only)

- `sort-objects`, `sort-classes`, `sort-jsx-props`, `sort-decorators`
- `sort-switch-case`, `sort-variable-declarations`, `sort-array-includes`
- `sort-sets`, `sort-maps`

> **Note**: Tier 3 rules are disabled by default because they can be controversial or break intentional ordering. For example, `sort-decorators` can break functionality when decorator order matters semantically, and `sort-switch-case` often disrupts intentional case ordering (common cases first, fallbacks last).

To use a custom level, import the corresponding creator and pass an options object:

```js
// eslint.config.js
import { createTypescriptConfig } from '@slango.configs/eslint/typescript.js';

export default createTypescriptConfig({ perfectionist: 'moderate' });
```

Passing an unknown option or an invalid level throws a descriptive error.

## Things to take into account (and possibly review)

- At the time of writing eslint-config-prettier is needed as a dependency to use eslint-plugin-prettier
- eslint-plugin-import-x supports eslint 9 but eslint-plugin-import does not [usage comparison](https://npm-compare.com/eslint-plugin-import,eslint-plugin-import-x)
- eslint-import-resolver-node does not seem to play well with monorepo/pattern exports in package.json (thus eslint-import-resolver-typescript is used even for javascript)

## Interesting links

- [Eslint v9 supported community plugins](https://github.com/eslint/eslint/issues/18391)
