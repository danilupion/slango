# Slango Monorepo

Slango is a collection of reusable TypeScript configuration and utility packages for Node.js projects.

## Installation

1. Use the Node.js version defined in `.nvmrc`:

   ```bash
   nvm use
   ```

   If the version is not installed yet:

   ```bash
   nvm install
   ```

2. Enable corepack to activate `pnpm`:

   ```bash
   corepack enable
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. (Optional) initialize Husky when using external tools that trigger git hooks:

   ```bash
   mkdir -p ~/.config/husky
   echo 'export NVM_DIR="$HOME/.nvm"' > ~/.config/husky/init.sh
   echo '[ -s "$NVM_DIR/nvm.sh" ] && \\ "$NVM_DIR/nvm.sh"' >> ~/.config/husky/init.sh
   ```

## Usage

### Configuration Packages

- [![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint) `@slango.configs/eslint`](configs/eslint/README.md)
- [![Lint-staged](https://img.shields.io/badge/lint--staged-3AC486?style=flat-square) `@slango.configs/lint-staged`](configs/lint-staged/README.md)
- [![Prettier](https://img.shields.io/badge/Prettier-1A2B34?style=flat-square&logo=prettier) `@slango.configs/prettier`](configs/prettier/README.md)
- [![Scripts](https://img.shields.io/badge/scripts-AFD89C?style=flat-square&logo=gnu-bash) `@slango.configs/scripts`](configs/scripts/README.md)
- [![Typescript](https://img.shields.io/badge/Typescript-659DD4?style=flat-square&logo=typescript) `@slango.configs/typescript`](configs/typescript/README.md)
- [![Vitest](https://img.shields.io/badge/Vitest-F9C72C?style=flat-square&logo=vitest) `@slango.configs/vitest`](configs/vitest/README.md)

### Utility Packages

- [`@slango/mangusta`](packages/mangusta/README.md) – Mongoose middlewares and utilities
- [`@slango/ristretto`](packages/ristretto/README.md) – Opinionated REST client
- [`@slango/tessera`](packages/tessera/README.md) – Collection of TypeScript utilities

## Testing

Run the test suite across all packages:

```bash
pnpm test
```

If lint-staged fails during commits, run in verbose mode:

```bash
npx lint-staged --verbose
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
