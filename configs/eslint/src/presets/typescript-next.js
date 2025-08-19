import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import eslintJs from '@eslint/js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tsEslint from 'typescript-eslint';

import { globs, typescriptConfigs } from '../common.js';
import { getTsConfigFile } from '../utils.js';
import { createJavascriptNodeConfig } from './javascript-node.js';
import { browserTypescriptBrowserConfig } from './typescript-browser.js';

const project = getTsConfigFile();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  allConfig: eslintJs.configs.all,
  baseDirectory: __dirname,
  recommendedConfig: eslintJs.configs.recommended,
});

const patchedConfig = fixupConfigRules([...compat.extends('next/core-web-vitals')]).map(
  (config) => ({
    ...config,
    languageOptions: {
      parserOptions: {
        project,
      },
    },
  }),
);

export const createTypescriptNextConfig = (perfectionist = 'relaxed') => {
  const browserConfig = browserTypescriptBrowserConfig(perfectionist);

  return [
    ...createJavascriptNodeConfig(perfectionist),
    ...tsEslint.config(
      ...typescriptConfigs(globs.typescript),
      {
        ...browserConfig,
        languageOptions: {
          ...browserConfig.languageOptions,
          globals: {
            ...browserConfig.languageOptions.globals,
            process: true,
            NodeJS: 'readonly',
          },
        },
      },
      ...patchedConfig,
      {
        ignores: ['.next/*'],
      },
    ),
  ];
};

const typescriptNextConfig = createTypescriptNextConfig();

export default typescriptNextConfig;
