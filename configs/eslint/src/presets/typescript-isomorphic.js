import globals from 'globals';
import tsEslint from 'typescript-eslint';

import { globs, normalizeOptions, typescriptConfigs } from '../common.js';
import { createJavascriptNodeConfig } from './javascript-node.js';
import { browserTypescriptBrowserConfig } from './typescript-browser.js';

export const isomorphicTypescriptBrowserConfig = (options = {}) => {
  const opts = normalizeOptions(options);
  const browserConfig = browserTypescriptBrowserConfig(opts);
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

export const createTypescriptIsomorphicConfig = (options = {}) => {
  const opts = normalizeOptions(options);
  return [
    ...createJavascriptNodeConfig(opts),
    ...tsEslint.config(
      ...typescriptConfigs(globs.typescript),
      isomorphicTypescriptBrowserConfig(opts),
    ),
  ];
};

const typescriptIsomorphicConfig = createTypescriptIsomorphicConfig();

export default typescriptIsomorphicConfig;
