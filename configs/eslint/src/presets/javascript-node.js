import globals from 'globals';

import { commonConfigs, commonRules, globs, ignorePatterns } from '../common.js';

export const baseJavascriptConfig = {
  files: [globs.javascript],
  languageOptions: {
    globals: {
      ...globals.node,
    },
    parserOptions: {
      ecmaVersion: 'latest',
    },
  },
  name: '@slango.configs/eslint/javascript-node',
  rules: {
    'import-x/first': 'error',
    'import-x/no-anonymous-default-export': 'error',
    ...commonRules,
  },
  settings: {
    //  eslint-import-resolver-node does not seem to play well with monorepo/pattern exports
    'import-x/resolver': {
      typescript: true,
    },
  },
};

const javascriptNode = [
  ...commonConfigs(globs.javascript),
  baseJavascriptConfig,
  { ignores: ignorePatterns },
];

export default javascriptNode;
