import nextPlugin from '@next/eslint-plugin-next';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsEslint from 'typescript-eslint';

import { globs, normalizeConfig, normalizeOptions, typescriptConfigs } from '../common.js';
import { browserTypescriptBrowserConfig } from './typescript-browser.js';
import { createTypescriptReactConfig } from './typescript-react.js';

export const createTypescriptNextConfig = (options = {}) => {
  const opts = normalizeOptions(options);
  const browserConfig = browserTypescriptBrowserConfig(opts);

  return [
    ...createTypescriptReactConfig(opts),
    // Next.js Fast Refresh allows the framework's special exports (metadata, ...).
    reactRefresh.configs.next,
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
        nextPlugin.configs['core-web-vitals'],
        {
          ignores: ['.next/*'],
        },
      ),
    ),
  ];
};

const typescriptNextConfig = createTypescriptNextConfig();

export default typescriptNextConfig;
