import globals from 'globals';
import tsEslint from 'typescript-eslint';

import { globs, normalizeConfig, normalizeOptions, typescriptConfigs } from '../common.js';
import { createJavascriptNodeConfig } from './javascript-node.js';
import { baseTypescriptConfig } from './typescript.js';

export const createTypescriptNodeConfig = (options = {}) => {
  const opts = normalizeOptions(options);
  const base = baseTypescriptConfig(opts);
  const nodeTypescriptConfig = {
    ...base,
    languageOptions: {
      ...base.languageOptions,
      globals: {
        ...base.languageOptions.globals,
        ...globals.node,
      },
    },
    name: '@slango.configs/eslint/typescript-node',
  };

  return [
    ...createJavascriptNodeConfig(opts),
    ...normalizeConfig(
      tsEslint.config(...typescriptConfigs(globs.typescript), nodeTypescriptConfig),
    ),
  ];
};

const typescriptNodeConfig = createTypescriptNodeConfig();

export default typescriptNodeConfig;
