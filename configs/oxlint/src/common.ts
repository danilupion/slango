import type { OxlintConfig, OxlintEnv, OxlintGlobals, OxlintOverride } from 'oxlint';

import { configs as regexpConfigs } from 'eslint-plugin-regexp';
import { fileURLToPath } from 'node:url';

export type Plugins = NonNullable<OxlintConfig['plugins']>;
export type Rules = NonNullable<OxlintConfig['rules']>;

export type PerfectionistLevel = 'off' | 'relaxed' | 'moderate' | 'strict';

export interface PresetOptions {
  /** Perfectionist sorting strictness. Default: `'relaxed'`. */
  perfectionist?: PerfectionistLevel;
}

export const globs = {
  javascript: ['**/*.{js,cjs,mjs,jsx}'],
  typescript: ['**/*.{ts,tsx}'],
};

export const ignorePatterns = ['**/dist/**', '**/coverage/**'];

const resolvePlugin = (name: string): string => fileURLToPath(import.meta.resolve(name));

// ESLint plugins oxlint has no native port for, loaded through oxlint's JS
// plugin bridge. Resolved from this package so consumers need no extra deps.
export const jsPlugins = (): string[] => [
  resolvePlugin('eslint-plugin-perfectionist'),
  resolvePlugin('eslint-plugin-regexp'),
];

// oxlint's own recommended set: the `correctness` category ("code that is
// definitely wrong or useless"). Categories only cover native rules, JS plugin
// rules are enabled explicitly below.
export const categories: OxlintConfig['categories'] = { correctness: 'error' };

// eslint-plugin-regexp recommended, as published by the plugin.
export const regexpRules: Rules = Object.fromEntries(
  Object.entries(regexpConfigs['flat/recommended'].rules ?? {}).filter(([name]) =>
    name.startsWith('regexp/'),
  ),
) as Rules;

const naturalSort = { type: 'natural', order: 'asc' } as const;
const sortModulesRule = ['error', { ...naturalSort, partitionByNewLine: true }] as const;
const sortRule = ['error', naturalSort] as const;

const tier1 = [
  'sort-imports',
  'sort-named-imports',
  'sort-named-exports',
  'sort-exports',
  'sort-import-attributes',
  'sort-export-attributes',
  'sort-modules',
];
const tier2 = [
  'sort-union-types',
  'sort-intersection-types',
  'sort-heritage-clauses',
  'sort-object-types',
  'sort-interfaces',
  'sort-enums',
];
const tier3 = [
  'sort-objects',
  'sort-classes',
  'sort-jsx-props',
  'sort-decorators',
  'sort-switch-case',
  'sort-variable-declarations',
  'sort-array-includes',
  'sort-sets',
  'sort-maps',
];

const tierRules = (names: string[], enabled: boolean): Rules =>
  Object.fromEntries(
    names.map((name) => [
      `perfectionist/${name}`,
      enabled ? (name === 'sort-modules' ? sortModulesRule : sortRule) : 'off',
    ]),
  ) as Rules;

/**
 * Perfectionist strictness levels:
 *
 * - off: all perfectionist rules disabled
 * - relaxed (default): import/export sorting only
 * - moderate: adds type sorting (interfaces, unions, enums)
 * - strict: full sorting (objects, classes, JSX props, switch cases, ...)
 */
export const perfectionistLevels: Record<PerfectionistLevel, Rules> = {
  off: { ...tierRules(tier1, false), ...tierRules(tier2, false), ...tierRules(tier3, false) },
  relaxed: { ...tierRules(tier1, true), ...tierRules(tier2, false), ...tierRules(tier3, false) },
  moderate: { ...tierRules(tier1, true), ...tierRules(tier2, true), ...tierRules(tier3, false) },
  strict: { ...tierRules(tier1, true), ...tierRules(tier2, true), ...tierRules(tier3, true) },
};

const defaultOptions: Required<PresetOptions> = { perfectionist: 'relaxed' };

export const normalizeOptions = (options: PresetOptions = {}): Required<PresetOptions> => {
  if (options === null || typeof options !== 'object' || Array.isArray(options)) {
    throw new Error('options must be an object');
  }

  const { perfectionist = defaultOptions.perfectionist, ...rest } = options;

  if (!Object.hasOwn(perfectionistLevels, perfectionist)) {
    throw new Error(
      `Invalid perfectionist level "${String(perfectionist)}". Expected one of: ${Object.keys(perfectionistLevels).join(', ')}`,
    );
  }

  const unknown = Object.keys(rest);
  if (unknown.length > 0) {
    throw new Error(`Unknown option(s): ${unknown.join(', ')}`);
  }

  return { perfectionist };
};

// Rules on top of the correctness category, kept from the ESLint presets.
export const baseRules: Rules = {
  'no-unused-vars': ['error', { ignoreRestSiblings: true }],
  'import/first': 'error',
  'import/no-anonymous-default-export': 'error',
};

// oxlint's default plugins plus module resolution and async correctness.
export const basePlugins: Plugins = ['typescript', 'unicorn', 'oxc', 'import', 'node', 'promise'];

export interface BuildConfigInput {
  options: PresetOptions;
  plugins?: Plugins;
  env?: OxlintEnv;
  globals?: OxlintGlobals;
  typescriptEnv?: OxlintEnv;
  typescriptGlobals?: OxlintGlobals;
  rules?: Rules;
  typescriptRules?: Rules;
  ignores?: string[];
}

/**
 * Builds an oxlint config: oxlint's `correctness` category for the given
 * plugins, the JS-plugin rule sets (regexp recommended, perfectionist tier) and
 * preset-specific rules. `typescript*` settings apply only to TypeScript files.
 */
export const buildConfig = ({
  options,
  plugins = [],
  env = {},
  globals = {},
  typescriptEnv,
  typescriptGlobals,
  rules = {},
  typescriptRules = {},
  ignores = [],
}: BuildConfigInput): OxlintConfig => {
  const { perfectionist } = normalizeOptions(options);
  const overrides: OxlintOverride[] = [];
  if (typescriptEnv || typescriptGlobals || Object.keys(typescriptRules).length > 0) {
    overrides.push({
      files: globs.typescript,
      ...(typescriptEnv ? { env: typescriptEnv } : {}),
      ...(typescriptGlobals ? { globals: typescriptGlobals } : {}),
      rules: typescriptRules,
    });
  }

  return {
    plugins: [...basePlugins, ...plugins],
    jsPlugins: jsPlugins(),
    categories,
    env: { builtin: true, ...env },
    globals,
    ignorePatterns: [...ignorePatterns, ...ignores],
    rules: { ...regexpRules, ...perfectionistLevels[perfectionist], ...baseRules, ...rules },
    overrides,
  };
};
