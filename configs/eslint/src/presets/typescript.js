import { dirname } from 'node:path';
import tsEslint from 'typescript-eslint';

import { commonConfigs, commonRules, globs, ignorePatterns, typescriptConfigs } from '../common.js';
import { getTsConfigFile } from '../utils.js';
import { baseJavascriptConfig, createJavascriptNodeConfig } from './javascript-node.js';

const project = getTsConfigFile();

export const baseTypescriptConfig = (perfectionist = 'relaxed') => ({
  ...baseJavascriptConfig(perfectionist),
  extends: [...commonConfigs(globs.typescript)],
  files: [globs.typescript],
  languageOptions: {
    parserOptions: {
      project,
      tsconfigRootDir: dirname(project),
    },
  },
  name: '@slango.configs/eslint/typescript',
  rules: {
    // Allow destructuring (to remove unused properties)
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    // Disable as @typescript-eslint/no-unused-vars is used (and no-unused-vars has issues with enums)
    'no-unused-vars': 'off',
    ...commonRules(perfectionist),
  },
});

export const createTypescriptConfig = (perfectionist = 'relaxed') => [
  ...createJavascriptNodeConfig(perfectionist),
  ...tsEslint.config(...typescriptConfigs(globs.typescript), baseTypescriptConfig(perfectionist)),
  { ignores: ignorePatterns },
];

const typescriptConfig = createTypescriptConfig();

export default typescriptConfig;
