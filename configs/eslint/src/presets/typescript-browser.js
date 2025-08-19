import globals from 'globals';
import tsEslint from 'typescript-eslint';

import { globs, typescriptConfigs } from '../common.js';
import { createJavascriptNodeConfig } from './javascript-node.js';
import { baseTypescriptConfig } from './typescript.js';

export const browserTypescriptBrowserConfig = (perfectionist = 'relaxed') => {
  const base = baseTypescriptConfig(perfectionist);
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

export const createTypescriptBrowserConfig = (perfectionist = 'relaxed') => [
  ...createJavascriptNodeConfig(perfectionist),
  ...tsEslint.config(
    ...typescriptConfigs(globs.typescript),
    browserTypescriptBrowserConfig(perfectionist),
  ),
];

const typescriptBrowserConfig = createTypescriptBrowserConfig();

export default typescriptBrowserConfig;
