import { flatConfig as nextFlatConfig } from '@next/eslint-plugin-next';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsEslint from 'typescript-eslint';

import { globs, normalizeConfig, normalizeOptions, typescriptConfigs } from '../common.js';
import { createJavascriptNodeConfig } from './javascript-node.js';
import { browserTypescriptBrowserConfig } from './typescript-browser.js';

export const createTypescriptNextConfig = (options = {}) => {
  const opts = normalizeOptions(options);
  const browserConfig = browserTypescriptBrowserConfig(opts);

  return [
    ...createJavascriptNodeConfig(opts),
    ...normalizeConfig(reactHooks.configs['recommended-latest']),
    ...normalizeConfig(reactRefresh.configs.recommended),
    ...normalizeConfig(
      tsEslint.config(
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
        nextFlatConfig.coreWebVitals,
        {
          ignores: ['.next/*'],
        },
      ),
    ),
  ];
};

const typescriptNextConfig = createTypescriptNextConfig();

export default typescriptNextConfig;
