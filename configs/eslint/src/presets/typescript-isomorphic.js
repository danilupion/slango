import globals from 'globals';
import tsEslint from 'typescript-eslint';

import { globs, typescriptConfigs } from '../common.js';
import javascriptNode from './javascript-node.js';
import { browserTypescriptBrowserConfig } from './typescript-browser.js';

export const isomorphicTypescriptBrowserConfig = {
  ...browserTypescriptBrowserConfig,
  languageOptions: {
    ...browserTypescriptBrowserConfig.languageOptions,
    globals: {
      ...browserTypescriptBrowserConfig.languageOptions.globals,
      ...globals.node,
    },
  },
  name: '@slango.configs/eslint/typescript-isomorphic',
};

const typescriptIsomorphicConfig = [
  ...javascriptNode,
  ...tsEslint.config(...typescriptConfigs(globs.typescript), isomorphicTypescriptBrowserConfig),
];

export default typescriptIsomorphicConfig;
