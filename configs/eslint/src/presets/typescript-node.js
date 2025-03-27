import globals from 'globals';
import tsEslint from 'typescript-eslint';

import { globs, typescriptConfigs } from '../common.js';
import javascriptNode from './javascript-node.js';
import { baseTypescriptConfig } from './typescript.js';

const nodeTypescriptConfig = {
  ...baseTypescriptConfig,
  languageOptions: {
    ...baseTypescriptConfig.languageOptions,
    globals: {
      ...baseTypescriptConfig.languageOptions.globals,
      ...globals.node,
    },
  },
  name: '@slango.configs/eslint/typescript-node',
};

const typescriptNodeConfig = [
  ...javascriptNode,
  ...tsEslint.config(...typescriptConfigs(globs.typescript), nodeTypescriptConfig),
];

export default typescriptNodeConfig;
