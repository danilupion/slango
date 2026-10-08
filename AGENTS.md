# Agent Guidelines

Guidelines for AI assistants and human contributors working in the `slango` monorepo.

## Repository Overview

- **Package manager:** pnpm (v12.10.1)
- **Node version:** ≥26.10.0 (`nvm use` recommended)
- **Structure**
  - `/packages/*` – distributable packages (`mangusta` mongoose middlewares, `reazione` generic react utilities, `ristretto` opinionated rest client, `tessera` typescript utilities)
  - `/configs/*` – distributable config packages (`oxlint`, `prettier`, `typescript`, `lint-staged`, `vitest`, `scripts`)

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
- Follow the repo's oxlint (`@slango.configs/oxlint`) and Prettier configurations. (`@slango.configs/eslint` is deprecated on npm and no longer maintained here.)

## Security & Secrets

- Never commit secrets. Use environment variables or secret managers.
- For local Docker/Helm usage, ensure `.env` files are excluded (check `.gitignore`).

## Documentation

See the [root README](README.md) for project overview and tooling.
Package-specific documentation can be found in:

- [packages/mangusta/README.md](packages/mangusta/README.md)
- [packages/reazione/README.md](packages/reazione/README.md)
- [packages/ristretto/README.md](packages/ristretto/README.md)
- [packages/tessera/README.md](packages/tessera/README.md)

Configuration packages are documented under `configs/*/README.md`.
Tooling candidates and when to adopt them: [docs/tooling-radar.md](docs/tooling-radar.md).

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
