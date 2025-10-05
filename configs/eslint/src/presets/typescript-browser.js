import globals from 'globals';
import tsEslint from 'typescript-eslint';

import { globs, normalizeConfig, normalizeOptions, typescriptConfigs } from '../common.js';
import { createJavascriptNodeConfig } from './javascript-node.js';
import { baseTypescriptConfig } from './typescript.js';

export const browserTypescriptBrowserConfig = (options = {}) => {
  const opts = normalizeOptions(options);
  const base = baseTypescriptConfig(opts);
  return {
    ...base,
    languageOptions: {
      ...base.languageOptions,
      ecmaVersion: 2022,
      globals: {
        ...base.languageOptions.globals,
        ...globals['2022'],
        ...globals.browser,
      },
    },
    name: '@slango.configs/eslint/typescript-browser',
  };
};

export const createTypescriptBrowserConfig = (options = {}) => {
  const opts = normalizeOptions(options);
  return [
    ...createJavascriptNodeConfig(opts),
    ...normalizeConfig(
      tsEslint.config(...typescriptConfigs(globs.typescript), browserTypescriptBrowserConfig(opts)),
    ),
  ];
};

const typescriptBrowserConfig = createTypescriptBrowserConfig();

export default typescriptBrowserConfig;
