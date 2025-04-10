import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

import { globs, typescriptConfigs } from '../common.js';
import javascriptNode from './javascript-node.js';
import { browserTypescriptBrowserConfig } from './typescript-browser.js';
import { baseTypescriptConfig } from './typescript.js';

export const reactTypescriptBrowserConfig = {
  ...baseTypescriptConfig,
  languageOptions: {
    ...baseTypescriptConfig.languageOptions,
    globals: {
      ...baseTypescriptConfig.languageOptions.globals,
      ...globals.browser,
    },
  },
  name: '@slango.configs/eslint/typescript-react',
};

const typescriptReactConfig = [
  ...javascriptNode,
  reactHooks.configs['recommended-latest'],
  reactRefresh.configs.recommended,
  ...tsEslint.config(...typescriptConfigs(globs.typescript), browserTypescriptBrowserConfig),
];

export default typescriptReactConfig;
