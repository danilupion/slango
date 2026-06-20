import { dirname } from 'node:path';
import tsEslint from 'typescript-eslint';

import {
  commonRules,
  globs,
  ignorePatterns,
  normalizeConfig,
  normalizeOptions,
  typescriptConfigs,
} from '../common.js';
import { getTsConfigFile } from '../utils.js';
import { baseJavascriptConfig, createJavascriptNodeConfig } from './javascript-node.js';

const project = getTsConfigFile();

export const baseTypescriptConfig = (options = {}) => {
  const opts = normalizeOptions(options);
  const baseConfig = baseJavascriptConfig(opts);
  return {
    ...baseConfig,
    files: globs.typescript,
    languageOptions: {
      ...baseConfig.languageOptions,
      parserOptions: {
        ...baseConfig.languageOptions?.parserOptions,
        // `project` is resolved from the current working directory. When ESLint
        // resolves this config for a file but cwd has no tsconfig — e.g.
        // lint-staged invoking eslint from a monorepo root, where ESLint 10
        // looks up each file's nearest config and loads this preset — `project`
        // is undefined. Guard so loading the config never throws on
        // `dirname(undefined)`; type-aware linting just stays off for that
        // invocation (only relevant for .ts files, which are linted from their
        // own package directory where a tsconfig exists).
        ...(project ? { project, tsconfigRootDir: dirname(project) } : {}),
      },
    },
    name: '@slango.configs/eslint/typescript',
    rules: {
      // Allow destructuring (to remove unused properties)
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
      // Disable as @typescript-eslint/no-unused-vars is used (and no-unused-vars has issues with enums)
      'no-unused-vars': 'off',
      ...commonRules(opts),
    },
  };
};

export const createTypescriptConfig = (options = {}) => {
  const opts = normalizeOptions(options);
  return [
    ...createJavascriptNodeConfig(opts),
    ...normalizeConfig(
      tsEslint.config(...typescriptConfigs(globs.typescript), baseTypescriptConfig(opts)),
    ),
    { ignores: ignorePatterns },
  ];
};

const typescriptConfig = createTypescriptConfig();

export default typescriptConfig;
