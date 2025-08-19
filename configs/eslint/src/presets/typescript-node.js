import globals from 'globals';
import tsEslint from 'typescript-eslint';

import { globs, typescriptConfigs } from '../common.js';
import { createJavascriptNodeConfig } from './javascript-node.js';
import { baseTypescriptConfig } from './typescript.js';

export const createTypescriptNodeConfig = (perfectionist = 'relaxed') => {
  const base = baseTypescriptConfig(perfectionist);
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
    ...createJavascriptNodeConfig(perfectionist),
    ...tsEslint.config(...typescriptConfigs(globs.typescript), nodeTypescriptConfig),
  ];
};

const typescriptNodeConfig = createTypescriptNodeConfig();

export default typescriptNodeConfig;
