import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsEslint from 'typescript-eslint';

import { globs, normalizeConfig, normalizeOptions, typescriptConfigs } from '../common.js';
import { createJavascriptNodeConfig } from './javascript-node.js';
import { browserTypescriptBrowserConfig } from './typescript-browser.js';

export const createTypescriptReactConfig = (options = {}) => {
  const opts = normalizeOptions(options);
  const browserConfig = browserTypescriptBrowserConfig(opts);

  return [
    ...createJavascriptNodeConfig(opts),
    jsxA11y.flatConfigs.recommended,
    {
      ...browserConfig,
      plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
      },
      name: '@slango.configs/eslint/typescript-react',
    },
    ...normalizeConfig(
      tsEslint.config(...typescriptConfigs(globs.typescript), browserTypescriptBrowserConfig(opts)),
    ),
  ];
};

const typescriptReactConfig = createTypescriptReactConfig();

export default typescriptReactConfig;
