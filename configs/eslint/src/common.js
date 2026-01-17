import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import eslintJs from '@eslint/js';
import eslintPluginImportX from 'eslint-plugin-import-x';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import prettierPluginRecommendedConfig from 'eslint-plugin-prettier/recommended';
import { configs as regexPluginConfigs } from 'eslint-plugin-regexp';
import tsEslint from 'typescript-eslint';

export const globs = {
  javascript: ['**/*.{js,cjs,mjs,jsx}'],
  typescript: ['**/*.{ts,tsx}'],
};

export const ignorePatterns = ['dist/**', 'coverage/**'];

export const normalizeConfig = (config) => (Array.isArray(config) ? config : [config]);

export const applyFilesGlob = (configs, files) => configs.map((config) => ({ ...config, files }));

export const commonConfigs = (files) => {
  const configs = [
    eslintJs.configs.recommended,
    eslintPluginImportX.flatConfigs.recommended,
    comments.recommended,
    // Perfectionist plugin only (no preset) - rules configured via perfectionistLevels
    { plugins: { perfectionist: perfectionistPlugin } },
    prettierPluginRecommendedConfig,
    regexPluginConfigs['flat/recommended'],
  ];

  return configs.flatMap((config) => applyFilesGlob(normalizeConfig(config), files));
};

// Common rule configurations
const naturalSort = { type: 'natural', order: 'asc' };
const sortModulesRule = ['error', { ...naturalSort, partitionByNewLine: true }];
const sortRule = ['error', naturalSort];

/**
 * Perfectionist strictness levels:
 *
 * - off: All perfectionist rules disabled
 * - relaxed (default): Core import/export sorting only - universally accepted rules
 * - moderate: Adds type sorting (interfaces, unions, enums) - good for type-heavy codebases
 * - strict: Full sorting including objects, classes, JSX props, switch cases, etc.
 *
 * Rules are organized in tiers:
 * - Tier 1 (relaxed+): Import/export sorting - industry standard, high value
 * - Tier 2 (moderate+): Type-related sorting - consistency for TypeScript
 * - Tier 3 (strict only): Everything else - can be controversial or break intentional ordering
 */
export const perfectionistLevels = {
  off: {
    // Tier 1: Import/export sorting - ALL OFF
    'perfectionist/sort-imports': 'off',
    'perfectionist/sort-named-imports': 'off',
    'perfectionist/sort-named-exports': 'off',
    'perfectionist/sort-exports': 'off',
    'perfectionist/sort-import-attributes': 'off',
    'perfectionist/sort-export-attributes': 'off',
    'perfectionist/sort-modules': 'off',
    // Tier 2: Type sorting - ALL OFF
    'perfectionist/sort-union-types': 'off',
    'perfectionist/sort-intersection-types': 'off',
    'perfectionist/sort-heritage-clauses': 'off',
    'perfectionist/sort-object-types': 'off',
    'perfectionist/sort-interfaces': 'off',
    'perfectionist/sort-enums': 'off',
    // Tier 3: Controversial sorting - ALL OFF
    'perfectionist/sort-objects': 'off',
    'perfectionist/sort-classes': 'off',
    'perfectionist/sort-jsx-props': 'off',
    'perfectionist/sort-decorators': 'off',
    'perfectionist/sort-switch-case': 'off',
    'perfectionist/sort-variable-declarations': 'off',
    'perfectionist/sort-array-includes': 'off',
    'perfectionist/sort-sets': 'off',
    'perfectionist/sort-maps': 'off',
  },
  relaxed: {
    // Tier 1: Import/export sorting - ENABLED (industry standard)
    'perfectionist/sort-imports': sortRule,
    'perfectionist/sort-named-imports': sortRule,
    'perfectionist/sort-named-exports': sortRule,
    'perfectionist/sort-exports': sortRule,
    'perfectionist/sort-import-attributes': sortRule,
    'perfectionist/sort-export-attributes': sortRule,
    'perfectionist/sort-modules': sortModulesRule,
    // Tier 2: Type sorting - OFF
    'perfectionist/sort-union-types': 'off',
    'perfectionist/sort-intersection-types': 'off',
    'perfectionist/sort-heritage-clauses': 'off',
    'perfectionist/sort-object-types': 'off',
    'perfectionist/sort-interfaces': 'off',
    'perfectionist/sort-enums': 'off',
    // Tier 3: Controversial sorting - OFF
    'perfectionist/sort-objects': 'off',
    'perfectionist/sort-classes': 'off',
    'perfectionist/sort-jsx-props': 'off',
    'perfectionist/sort-decorators': 'off',
    'perfectionist/sort-switch-case': 'off',
    'perfectionist/sort-variable-declarations': 'off',
    'perfectionist/sort-array-includes': 'off',
    'perfectionist/sort-sets': 'off',
    'perfectionist/sort-maps': 'off',
  },
  moderate: {
    // Tier 1: Import/export sorting - ENABLED
    'perfectionist/sort-imports': sortRule,
    'perfectionist/sort-named-imports': sortRule,
    'perfectionist/sort-named-exports': sortRule,
    'perfectionist/sort-exports': sortRule,
    'perfectionist/sort-import-attributes': sortRule,
    'perfectionist/sort-export-attributes': sortRule,
    'perfectionist/sort-modules': sortModulesRule,
    // Tier 2: Type sorting - ENABLED (good for TypeScript codebases)
    'perfectionist/sort-union-types': sortRule,
    'perfectionist/sort-intersection-types': sortRule,
    'perfectionist/sort-heritage-clauses': sortRule,
    'perfectionist/sort-object-types': sortRule,
    'perfectionist/sort-interfaces': sortRule,
    'perfectionist/sort-enums': sortRule,
    // Tier 3: Controversial sorting - OFF
    'perfectionist/sort-objects': 'off',
    'perfectionist/sort-classes': 'off',
    'perfectionist/sort-jsx-props': 'off',
    'perfectionist/sort-decorators': 'off',
    'perfectionist/sort-switch-case': 'off',
    'perfectionist/sort-variable-declarations': 'off',
    'perfectionist/sort-array-includes': 'off',
    'perfectionist/sort-sets': 'off',
    'perfectionist/sort-maps': 'off',
  },
  strict: {
    // Tier 1: Import/export sorting - ENABLED
    'perfectionist/sort-imports': sortRule,
    'perfectionist/sort-named-imports': sortRule,
    'perfectionist/sort-named-exports': sortRule,
    'perfectionist/sort-exports': sortRule,
    'perfectionist/sort-import-attributes': sortRule,
    'perfectionist/sort-export-attributes': sortRule,
    'perfectionist/sort-modules': sortModulesRule,
    // Tier 2: Type sorting - ENABLED
    'perfectionist/sort-union-types': sortRule,
    'perfectionist/sort-intersection-types': sortRule,
    'perfectionist/sort-heritage-clauses': sortRule,
    'perfectionist/sort-object-types': sortRule,
    'perfectionist/sort-interfaces': sortRule,
    'perfectionist/sort-enums': sortRule,
    // Tier 3: Full sorting - ENABLED (use with caution)
    'perfectionist/sort-objects': sortRule,
    'perfectionist/sort-classes': sortRule,
    'perfectionist/sort-jsx-props': sortRule,
    'perfectionist/sort-decorators': sortRule,
    'perfectionist/sort-switch-case': sortRule,
    'perfectionist/sort-variable-declarations': sortRule,
    'perfectionist/sort-array-includes': sortRule,
    'perfectionist/sort-sets': sortRule,
    'perfectionist/sort-maps': sortRule,
  },
};

const defaultOptions = { perfectionist: 'relaxed' };

export const normalizeOptions = (options = {}) => {
  if (options === null || typeof options !== 'object' || Array.isArray(options)) {
    throw new Error('options must be an object');
  }

  const { perfectionist = defaultOptions.perfectionist, ...rest } = options;

  if (!Object.hasOwn(perfectionistLevels, perfectionist)) {
    throw new Error(
      `Invalid perfectionist level "${perfectionist}". Expected one of: ${Object.keys(perfectionistLevels).join(', ')}`,
    );
  }

  const unknown = Object.keys(rest);
  if (unknown.length > 0) {
    throw new Error(`Unknown option(s): ${unknown.join(', ')}`);
  }

  return { perfectionist };
};

export const commonRules = (options) => {
  const { perfectionist } = normalizeOptions(options);
  return perfectionistLevels[perfectionist];
};

export const typescriptConfigs = (files) => [
  ...commonConfigs(files),
  ...applyFilesGlob(normalizeConfig(tsEslint.configs.recommendedTypeChecked), files),
];
