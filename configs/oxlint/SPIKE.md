# oxlint spike — findings (2026-09-06)

> Record of the investigation that led to this package. The package itself is documented in
> [README.md](README.md); the "proposed shape" below has since been implemented.

Goal: decide whether `@slango.configs/eslint` can be replaced by an oxlint-based
preset package with no ESLint left behind (no hybrid phase), on TypeScript 7.

Tooling under test: `oxlint@1.81.0`, `oxlint-tsgolint@7.0.2001` (tracks TS 7.0.2),
`@oxlint/migrate@1.81.0`. Consumers exercised: `packages/tessera` (slango) and the
whole velvet monorepo (15 packages, 692 TS/TSX files, TS 6.0.3 pinned there).

## Verdict: no blocker found

| Check                                                                                              | Result                                                                                                 |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| perfectionist via `jsPlugins` (sort-imports, named-imports, modules) with our natural-sort options | pass, `--fix` works (see caveat 1)                                                                     |
| regexp via `jsPlugins`                                                                             | pass                                                                                                   |
| eslint-comments via `jsPlugins`                                                                    | loads, but `no-unlimited-disable` never fires (see caveat 2)                                           |
| type-aware rules on TS 7 (tsgolint)                                                                | pass; `no-floating-promises`, `require-await`, `no-unsafe-*` etc. fire as in ESLint                    |
| workspace `exports` + `types` resolution for `import/*` rules                                      | pass, no false positives on `@velvet/*` imports                                                        |
| tsconfig `paths` (`@/*`, `@styled-system/*`)                                                       | pass (organizer/web)                                                                                   |
| react-hooks parity (`exhaustive-deps`, `rules-of-hooks`)                                           | identical findings to eslint-plugin-react-hooks 7.1.1 on the same files                                |
| `oxlint.config.ts` importing a preset from a package                                               | pass; `jsPlugins` resolved with `import.meta.resolve` inside the preset, consumers need no plugin deps |
| velvet type-checks under TS 7 (`--type-check`)                                                     | pass, zero compiler diagnostics across all packages                                                    |
| Next.js 16.3 on TS 7                                                                               | supported (`next build` uses the local `tsc` CLI by default)                                           |
| WebStorm                                                                                           | unofficial JetBrains plugin exists (oxc-intellij-plugin), untested                                     |

Rule coverage of the _effective_ ESLint rule sets (from `eslint --print-config`):

| preset (sample file)              | enabled | native | typed native | via JS plugin | missing |
| --------------------------------- | ------- | ------ | ------------ | ------------- | ------- |
| typescript-node (velvet api .ts)  | 169     | 72     | 22           | 73            | 2       |
| typescript-next (velvet web .tsx) | 223     | 124    | 23           | 73            | 3       |

- "via JS plugin" = 66 regexp + 5 eslint-comments + 1 prettier + 7 perfectionist.
- missing: `no-octal` (superseded by strict mode), `import-x/no-unresolved` (oxlint
  refuses to implement; `tsc` covers it), `@next/next/no-location-assign-relative-destination`.
- tsgolint ships 59 typed rules; every typed rule in `recommendedTypeChecked` is present.

Speed (Apple Silicon, warm):

| target                              | ESLint | oxlint type-aware   |
| ----------------------------------- | ------ | ------------------- |
| velvet apps/downloader/api          | 2.3 s  | 0.31 s              |
| velvet apps/organizer/web           | 7.7 s  | 0.55 s              |
| whole velvet (turbo lint, no cache) | 14.0 s | 1.35 s, 225 MB peak |

## Caveats

1. `--fix` for JS-plugin rules is single-pass: `sort-imports` and
   `sort-named-imports` needed two `oxlint --fix` runs to converge. Native rules
   were not affected. Options: run fix twice in lint-staged, or move import sorting
   to Oxfmt's `sortImports` (based on perfectionist) — not pursued, we keep prettier.
2. eslint-comments rules load but do not report; oxlint applies the disable
   directive before the plugin sees it. Replace with oxlint's built-in
   `--report-unused-disable-directives`.
3. `oxlint.config.js` is **not** auto-discovered, only `oxlint.config.ts` / `.mts`
   (or any JS/TS path via `-c`). Consumers should use `oxlint.config.ts`.
4. Typed rules must be scoped to `**/*.{ts,tsx}` via `overrides`, otherwise
   `eslint.config.js` and other JS files get `no-unsafe-*` noise.
5. Files outside the package tsconfig (`prisma.config.ts`) get an error-typed
   program; keep them in `ignorePatterns` like the ESLint configs already do.
6. `@oxlint/migrate` output is a reference, not a base: it emits eslint-config-prettier's
   "off" rules as JS-plugin references (`@babel/eslint-plugin`, `@stylistic/*`) that
   fail to load, and refuses to migrate `sort-imports` in favour of Oxfmt.

## Latent bugs in the current ESLint presets (surfaced by parity diffing)

- `typescript.js#baseTypescriptConfig` does not spread `baseConfig.rules`, so
  `import-x/first` and `import-x/no-anonymous-default-export` are silently off
  for `.ts/.tsx` files (verified with `--print-config`).
- `typescript-react.js` registers `react-hooks` and `react-refresh` plugins but
  enables no rules; velvet has 12 real `exhaustive-deps` violations ESLint never
  reported. The oxlint preset will surface these; consumers must fix or opt out.
- `@slango.configs/typescript` peers on `typescript ^7.0.2` while
  `@slango.configs/eslint` cannot run on TS 7; consumers that do not pin TS get a
  broken ESLint. Moot once ESLint is gone.

## Proposed shape of `@slango.configs/oxlint`

- `src/presets/{javascript-node,typescript,typescript-node,typescript-browser,typescript-react,typescript-next}.js`
  exporting `create*Config(options)` factories + default export, same
  `{ perfectionist: 'off' | 'relaxed' | 'moderate' | 'strict' }` option API.
- Dependencies: `eslint-plugin-perfectionist`, `eslint-plugin-regexp` (loaded as
  `jsPlugins` by absolute path). Peers: `oxlint`, `oxlint-tsgolint`.
- Drop: eslint-plugin-prettier (prettier already runs in lint-staged), eslint-comments.
- Consumer: `oxlint.config.ts` = `export { default } from '@slango.configs/oxlint/typescript-node.js'`,
  scripts `oxlint --type-aware .` / `oxlint --type-aware --fix .`.
- `@slango.configs/lint-staged`: swap `eslintFix` for `oxlint --fix --type-aware`.

`src/presets/typescript-node.js` in this package is the proof-of-concept used in
the spike, not the final preset.
