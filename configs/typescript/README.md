# ![Typescript](https://img.shields.io/badge/Typescript-659DD4?style=flat-square&logo=typescript) Slango Typescript Configs (@slango.configs/typescript)

Typescript configurations for easy setup

## Available configurations

| Name      | Description                                                                              |
| --------- | ---------------------------------------------------------------------------------------- |
| `default` | Base configuration for typescript packages (environment-agnostic)                        |
| `node`    | Node.js packages: extends `default`, loads `@types/node`, ES2022 lib only (no DOM types) |
| `next`    | Next.js apps: DOM libs, bundler resolution, `next` plugin, no declaration output         |
| `react`   | React (non-Next) apps: like `next` without the Next.js plugin and `next-env.d.ts`        |

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@slango.configs/typescript/node.json"
}
```

## Notes

- **No path aliases in the presets.** Declare them in your own tsconfig, relative to it:

  ```json
  { "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }
  ```

  That works for both `tsc` and Next.js. Next's Turbopack does not resolve `${configDir}` in `paths`, and an alias
  inherited from a preset with `./src/*` resolves inside `node_modules` for `tsc`. In Node packages compiled by `tsc`,
  aliases are not rewritten in the output, so prefer package.json `imports` (`#src/*`) there.

- **No `composite` or `incremental` by default.** Turbo already caches builds, and TypeScript's incremental state
  (`*.tsbuildinfo`) lives outside the cached `dist/`, so a cache restore can leave the two out of sync and `tsc` then
  skips re-emitting stale output. Opt in per project if you use project references, and add `*.tsbuildinfo` to the
  task's Turbo `outputs`.
- **`include`/`exclude` of the `next` and `react` presets use `${configDir}`**, so they resolve against the tsconfig
  that extends them. `tsc` (and Next's type check) support this; only module resolution of `paths` does not.
- **TypeScript 7 no longer loads `@types/*` automatically** (`types` defaults to `[]`). Node packages should extend
  `node.json`, which sets `"types": ["node"]` (requires `@types/node` in the package). Next.js apps get Node and React
  types through `next-env.d.ts`.
- **`default.json` sets no `lib`**, so `target: ES2022` brings in the DOM types. That keeps existing consumers working;
  prefer `node.json` for server code so browser globals are not silently available.
