import nextPlugin from '@next/eslint-plugin-next';
import tsEslint from 'typescript-eslint';

import { globs, normalizeConfig, normalizeOptions, typescriptConfigs } from '../common.js';
import { browserTypescriptBrowserConfig } from './typescript-browser.js';
import { createTypescriptReactConfig } from './typescript-react.js';

const { flatConfig: nextFlatConfig } = nextPlugin;

export const createTypescriptNextConfig = (options = {}) => {
  const opts = normalizeOptions(options);
  const browserConfig = browserTypescriptBrowserConfig(opts);

  return [
    ...createTypescriptReactConfig(opts),
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
