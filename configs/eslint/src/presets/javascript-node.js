import globals from 'globals';

import { commonConfigs, commonRules, globs, ignorePatterns, normalizeOptions } from '../common.js';

export const baseJavascriptConfig = (options = {}) => {
  const opts = normalizeOptions(options);
  return {
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
      ...commonRules(opts),
    },
    settings: {
      //  eslint-import-resolver-node does not seem to play well with monorepo/pattern exports
      'import-x/resolver': {
        typescript: true,
      },
    },
  };
};

export const createJavascriptNodeConfig = (options = {}) => {
  const opts = normalizeOptions(options);
  return [
    ...commonConfigs(globs.javascript),
    baseJavascriptConfig(opts),
    { ignores: ignorePatterns },
  ];
};

const javascriptNode = createJavascriptNodeConfig();

export default javascriptNode;
