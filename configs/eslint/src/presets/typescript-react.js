import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

import { globs, normalizeOptions, typescriptConfigs } from '../common.js';
import { createJavascriptNodeConfig } from './javascript-node.js';
import { browserTypescriptBrowserConfig } from './typescript-browser.js';
import { baseTypescriptConfig } from './typescript.js';

export const reactTypescriptBrowserConfig = (options = {}) => {
  const opts = normalizeOptions(options);
  const base = baseTypescriptConfig(opts);
  return {
    ...base,
    languageOptions: {
      ...base.languageOptions,
      globals: {
        ...base.languageOptions.globals,
        ...globals.browser,
      },
    },
    name: '@slango.configs/eslint/typescript-react',
  };
};

export const createTypescriptReactConfig = (options = {}) => {
  const opts = normalizeOptions(options);
  return [
    ...createJavascriptNodeConfig(opts),
    reactHooks.configs['recommended-latest'],
    reactRefresh.configs.recommended,
    ...tsEslint.config(
      ...typescriptConfigs(globs.typescript),
      browserTypescriptBrowserConfig(opts),
    ),
  ];
};

const typescriptReactConfig = createTypescriptReactConfig();

export default typescriptReactConfig;
