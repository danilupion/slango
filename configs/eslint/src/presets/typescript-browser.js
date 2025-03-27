import globals from 'globals';
import tsEslint from 'typescript-eslint';

import { globs, typescriptConfigs } from '../common.js';
import javascriptNode from './javascript-node.js';
import { baseTypescriptConfig } from './typescript.js';

export const browserTypescriptBrowserConfig = {
  ...baseTypescriptConfig,
  languageOptions: {
    ...baseTypescriptConfig.languageOptions,
    ecmaVersion: 2022,
    globals: {
      ...baseTypescriptConfig.languageOptions.globals,
      ...globals['2022'],
      ...globals.browser,
    },
  },
  name: '@slango.configs/eslint/typescript-browser',
};

const typescriptBrowserConfig = [
  ...javascriptNode,
  ...tsEslint.config(...typescriptConfigs(globs.typescript), browserTypescriptBrowserConfig),
];

export default typescriptBrowserConfig;
