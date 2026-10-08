# ![Typescript](https://img.shields.io/badge/Typescript-659DD4?style=flat-square&logo=typescript) Slango Typescript Configs (@slango.configs/typescript)

Typescript configurations for easy setup

## Available configurations

| Name      | Description                                                                                |
| --------- | ------------------------------------------------------------------------------------------ |
| `default` | Base configuration for typescript packages (environment-agnostic)                          |
| `node`    | Node.js packages: extends `default`, loads `@types/node`, ES2022 lib only (no DOM types)   |
| `next`    | Next.js apps: DOM libs, bundler resolution, `next` plugin, no declaration/composite output |
| `react`   | React (non-Next) apps: like `next` without the Next.js plugin and `next-env.d.ts`          |

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@slango.configs/typescript/node.json"
}
```

## Notes

- **Paths are relative to your tsconfig.** The presets use `${configDir}`, so `paths` (`@/*` → `src/*`), and the
  `include`/`exclude` of the `next` and `react` presets resolve against the tsconfig that extends them. You only need
  to override them when your layout differs.
- **TypeScript 7 no longer loads `@types/*` automatically** (`types` defaults to `[]`). Node packages should extend
  `node.json`, which sets `"types": ["node"]` (requires `@types/node` in the package). Next.js apps get Node and React
  types through `next-env.d.ts`.
- **`default.json` sets no `lib`**, so `target: ES2022` brings in the DOM types. That keeps existing consumers working;
  prefer `node.json` for server code so browser globals are not silently available.
