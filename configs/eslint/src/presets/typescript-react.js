import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

import { globs, typescriptConfigs } from '../common.js';
import { createJavascriptNodeConfig } from './javascript-node.js';
import { browserTypescriptBrowserConfig } from './typescript-browser.js';
import { baseTypescriptConfig } from './typescript.js';

export const reactTypescriptBrowserConfig = (perfectionist = 'relaxed') => {
  const base = baseTypescriptConfig(perfectionist);
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

export const createTypescriptReactConfig = (perfectionist = 'relaxed') => [
  ...createJavascriptNodeConfig(perfectionist),
  reactHooks.configs['recommended-latest'],
  reactRefresh.configs.recommended,
  ...tsEslint.config(
    ...typescriptConfigs(globs.typescript),
    browserTypescriptBrowserConfig(perfectionist),
  ),
];

const typescriptReactConfig = createTypescriptReactConfig();

export default typescriptReactConfig;
