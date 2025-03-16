# Slango Monorepo ![CI Workflow](https://github.com/tomaccodev/gifcept/actions/workflows/ci.yml/badge.svg)

## Configuration Packages

- [![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint) `@slango.configs/eslint`](configs/eslint/README.md)
- [![Lint-staged](https://img.shields.io/badge/lint--staged-3AC486?style=flat-square) `@slango.configs/lint-staged`](configs/lint-staged/README.md)
- [![Prettier](https://img.shields.io/badge/Prettier-1A2B34?style=flat-square&logo=prettier) `@slango.configs/prettier`](configs/prettier/README.md)
- [![Scripts](https://img.shields.io/badge/scripts-AFD89C?style=flat-square&logo=gnu-bash) `@slango.configs/scripts`](configs/scripts/README.md)
- [![Typescript](https://img.shields.io/badge/Typescript-659DD4?style=flat-square&logo=typescript) `@slango.configs/typescript`](configs/typescript/README.md)
- [![Vitest](https://img.shields.io/badge/Vitest-F9C72C?style=flat-square&logo=vitest) `@slango.configs/vitest`](configs/vitest/README.md)

## Utility Packages

- [`@slango/mongoose`](packages/mongoose/README.md)
- [`@slango/rest-client`](packages/rest-client/README.md)
- [`@slango/ts-utils`](packages/ts-utils/README.md)

## Dev recommendations

#### [NVM](https://github.com/nvm-sh/nvm)

To use the correct node version, run the following command:

```bash
nvm use
```

If you get an error saying node version is not available, run the following command:

```bash
nvm install
```

#### [Corepack](https://github.com/nodejs/corepack)

The following needs to be run every time a new node version is installed with nvm

```bash
corepack enable
```

#### Husky init (if using NVM)

When using external tools that might trigger git hooks, husky needs to be initialized, this can be done with the
following command:

```bash
mkdir -p ~/.config/husky
echo 'export NVM_DIR="$HOME/.nvm"' > ~/.config/husky/init.sh
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.config/husky/init.sh
```

### Debugging

#### lint-staged

At times understanding why lint-staged is failing can be difficult. To help with this, you can run the following command:

```bash
npx lint-staged --verbose
```
