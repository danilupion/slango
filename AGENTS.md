# Agent Guidelines

Guidelines for AI assistants and human contributors working in the `gifcept` monorepo.

## Repository Overview

- **Package manager:** pnpm (v10.15.1)
- **Node version:** ≥24.8.0 (`nvm use` recommended)
- **Structure**
  - `/packages/*` – distributable packages (`expresso` opinionated express wrapper, `mangusta` mongoose middlewares, `ristretto` opinionated rest client, `tessera` typescript utilities)
  - `/configs/*` – distributable config packages(`eslint`, `prettier`, `typescript`, `lint-staged`, `vytest`)

## Workflow

1. **Install deps**: `pnpm install`
2. **Run checks before commit**
   ```bash
   pnpm lint
   pnpm test            # runs turbo test across packages/apps
   pnpm build:check     # ensure builds succeed
   pnpm release:check   # verify changeset notes
   ```
3. **Formatting**: `pnpm format` (Prettier)
4. **Commit**
   - Use clear, conventional commit messages.
   - If code changes affect package versions, run `pnpm release:note` to add a changeset.
   - Review documentation, including this file as part of the development process in case updates are needed.
5. **Pull Requests**
   - Include test results and link to relevant changeset entry.
   - Keep PRs focused on a single topic.

## Style Notes

- Use TypeScript with ECMAScript modules (ESM).
- Prefer explicit types and avoid `any` when possible.
- Follow the repo's ESLint and Prettier configurations.

## Security & Secrets

- Never commit secrets. Use environment variables or secret managers.
- For local Docker/Helm usage, ensure `.env` files are excluded (check `.gitignore`).

## Documentation

See the [root README](README.md) for project overview and tooling.
Package-specific documentation can be found in:

- [packages/mangusta/README.md](packages/mangusta/README.md)
- [packages/ristretto/README.md](packages/ristretto/README.md)
- [packages/tessera/README.md](packages/tessera/README.md)

Configuration packages are documented under `configs/*/README.md`.
