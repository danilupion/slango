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
    perfectionistPlugin.configs['recommended-natural'],
    prettierPluginRecommendedConfig,
    regexPluginConfigs['flat/recommended'],
  ];

  return configs.flatMap((config) => applyFilesGlob(normalizeConfig(config), files));
};

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
