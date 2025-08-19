import globals from 'globals';
import tsEslint from 'typescript-eslint';

import { globs, typescriptConfigs } from '../common.js';
import { createJavascriptNodeConfig } from './javascript-node.js';
import { browserTypescriptBrowserConfig } from './typescript-browser.js';

export const isomorphicTypescriptBrowserConfig = (perfectionist = 'relaxed') => {
  const browserConfig = browserTypescriptBrowserConfig(perfectionist);
  return {
    ...browserConfig,
    languageOptions: {
      ...browserConfig.languageOptions,
      globals: {
        ...browserConfig.languageOptions.globals,
        ...globals.node,
      },
    },
    name: '@slango.configs/eslint/typescript-isomorphic',
  };
};

export const createTypescriptIsomorphicConfig = (perfectionist = 'relaxed') => [
  ...createJavascriptNodeConfig(perfectionist),
  ...tsEslint.config(
    ...typescriptConfigs(globs.typescript),
    isomorphicTypescriptBrowserConfig(perfectionist),
  ),
];

const typescriptIsomorphicConfig = createTypescriptIsomorphicConfig();

export default typescriptIsomorphicConfig;
