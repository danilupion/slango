# ![Typescript](https://img.shields.io/badge/Typescript-659DD4?style=flat-square&logo=typescript) Slango Typescript Configs (@slango.configs/typescript)

Typescript configurations for easy setup

## Available configurations

| Name      | Description                                        |
| --------- | -------------------------------------------------- |
| `default` | Default configuration for typescript packages      |
| `next`    | Next.js configuration for next+typescript packages |

## Troubleshooting

### Next.js

Typescript's include and exclude properties are local to the file where they are declared, thus when the presets are
exported, effectively they do not have include or exclude configuration, it serves as template of what needs to be
included in the final tsconfig.json file:

**tsconfig.json**

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@slango.configs/typescript/next.json",
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```
