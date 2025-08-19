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

export const commonConfigs = (files) =>
  [
    eslintJs.configs.recommended,
    eslintPluginImportX.flatConfigs.recommended,
    comments.recommended,
    perfectionistPlugin.configs['recommended-natural'],
    prettierPluginRecommendedConfig,
    regexPluginConfigs['flat/recommended'],
  ].map((config) => ({ ...config, files }));

const sortModulesRule = ['error', { partitionByNewLine: true }];

export const perfectionistLevels = {
  off: {
    'perfectionist/sort-enums': 'off',
    'perfectionist/sort-modules': 'off',
    'perfectionist/sort-object-types': 'off',
    'perfectionist/sort-objects': 'off',
  },
  relaxed: {
    'perfectionist/sort-enums': 'off',
    'perfectionist/sort-modules': sortModulesRule,
    'perfectionist/sort-object-types': 'off',
    'perfectionist/sort-objects': 'off',
  },
  strict: {
    'perfectionist/sort-enums': 'error',
    'perfectionist/sort-modules': sortModulesRule,
    'perfectionist/sort-object-types': 'error',
    'perfectionist/sort-objects': 'error',
  },
};

export const commonRules = (perfectionist = 'relaxed') =>
  perfectionistLevels[perfectionist] ?? perfectionistLevels.relaxed;

export const typescriptConfigs = (files) => [
  ...commonConfigs(files),
  ...tsEslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files,
  })),
];
