import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsEslint from 'typescript-eslint';

import { globs, normalizeConfig, normalizeOptions, typescriptConfigs } from '../common.js';
import { createJavascriptNodeConfig } from './javascript-node.js';
import { browserTypescriptBrowserConfig } from './typescript-browser.js';

export const reactTypescriptBrowserConfig = (options = {}) => {
  const opts = normalizeOptions(options);
  const browserConfig = browserTypescriptBrowserConfig(opts);
  return {
    ...browserConfig,
    name: '@slango.configs/eslint/typescript-react',
  };
};

export const createTypescriptReactConfig = (options = {}) => {
  const opts = normalizeOptions(options);

  return [
    ...createJavascriptNodeConfig(opts),
    ...normalizeConfig(reactHooks.configs['recommended-latest']),
    ...normalizeConfig(reactRefresh.configs.recommended),
    ...normalizeConfig(
      tsEslint.config(...typescriptConfigs(globs.typescript), browserTypescriptBrowserConfig(opts)),
    ),
  ];
};

const typescriptReactConfig = createTypescriptReactConfig();

export default typescriptReactConfig;
