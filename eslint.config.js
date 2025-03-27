import javascriptNodeConfig from '@slango.configs/eslint/javascript-node.js';

const eslintConfig = [
  ...javascriptNodeConfig,
  { ignores: ['apps/**', 'configs/**', 'packages/**'] },
];

export default eslintConfig;
