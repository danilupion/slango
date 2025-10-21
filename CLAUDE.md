# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Slango is a TypeScript monorepo containing reusable configuration packages and utility libraries for Node.js projects. The repository uses pnpm workspaces with Turbo for build orchestration.

## Setup

```bash
nvm use              # Use Node.js version from .nvmrc (24.10.0)
corepack enable      # Enable pnpm
pnpm install         # Install dependencies
```

## Common Commands

### Development

```bash
pnpm dev             # Start dev mode with file watching (turbo dev build:watch)
pnpm build           # Build all packages (turbo build)
pnpm build:check     # Type check without emitting files
```

### Testing

```bash
pnpm test            # Run all tests in parallel
pnpm test:serial     # Run tests serially (use when tests interfere with each other)
```

Individual package testing:

```bash
cd packages/mangusta
pnpm test            # Run tests once
pnpm test:watch      # Run tests in watch mode
pnpm test:coverage   # Run with coverage report
pnpm test:ui         # Open Vitest UI
```

### Linting & Formatting

```bash
pnpm lint            # Lint all packages (runs root ESLint + turbo lint)
pnpm lint:fix        # Auto-fix linting issues
pnpm format          # Format with Prettier
```

### Release Management

```bash
pnpm release:note    # Add a changeset for version bumping
pnpm release:bump    # Update package versions based on changesets
pnpm release:check   # Verify changesets against main branch
```

## Architecture

### Monorepo Structure

- **`/configs/*`** - Distributable configuration packages
  - `eslint` - ESLint presets and configurations
  - `prettier` - Prettier configuration
  - `typescript` - TypeScript base configs
  - `lint-staged` - Lint-staged configuration
  - `vitest` - Vitest test configuration
  - `scripts` - Shared build and utility scripts

- **`/packages/*`** - Distributable utility packages
  - `mangusta` - Mongoose middlewares and utilities (peer dep: mongoose ^8.19.0)
  - `ristretto` - Opinionated REST client with middleware support
  - `tessera` - TypeScript utilities (exports source .ts files directly, no build step)

### Build System

- **Turbo**: Orchestrates builds with dependency graph awareness. Tasks defined in `turbo.json`.
- **Task dependencies**: Most tasks depend on `^build` (upstream builds complete first)
- **Build outputs**: `dist/**` directories (TypeScript compilation)

### Package Export Patterns

- **mangusta/ristretto**: Use wildcard exports (`"./*"`) to expose individual built modules from `dist/`
- **tessera**: Exports source TypeScript files directly (`"./*": "./src/*.ts"`) - no build step required

### TypeScript Configuration

Packages use shared configs from `@slango.configs/typescript`:

- `tsconfig.json` - For type checking and IDE support
- `tsconfig.build.json` - For production builds (referenced by build scripts)

### Testing

All packages use Vitest with shared configuration from `@slango.configs/vitest`. Tests are co-located with source files (e.g., `maybe.spec.ts` alongside `maybe.ts`).

### Version Management

Uses Changesets for versioning. When making changes that affect published packages:

1. Run `pnpm release:note` to document the change
2. Select affected packages and change type (major/minor/patch)
3. Changesets are committed with the PR
4. Version bumps occur via `pnpm release:bump` (typically in CI/CD)

## Development Workflow

1. Make changes to code
2. Run `pnpm build:check` to verify TypeScript
3. Run `pnpm test` to verify tests pass
4. Run `pnpm lint` to verify linting
5. If changing published package APIs/behavior, run `pnpm release:note`
6. Commit with conventional commit messages

Husky hooks will run lint-staged on commit. If hooks fail, run `npx lint-staged --verbose` to debug.

## Important Notes

- **Node version**: Requires Node.js ^24.10.0 (enforced in package.json engines)
- **pnpm version**: Requires pnpm ^10.19.0
- **Module system**: All packages use ESM (`"type": "module"`)
- **Peer dependencies**: `mangusta` requires mongoose ^8.19.0; ensure it's installed in consuming projects
- **Workspace dependencies**: Config packages use `workspace:*` protocol for internal dependencies
