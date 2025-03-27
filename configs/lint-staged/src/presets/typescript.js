import deepmerge from 'deepmerge';

import {
  buildCheckTypescriptTask,
  eslintJavascriptTask,
  eslintTypescriptTask,
  prettierAllTask,
  vitestTypescriptTask,
} from '../tasks.js';

const typescriptConfig = {
  ...prettierAllTask,
  ...eslintJavascriptTask,
  ...deepmerge.all([eslintTypescriptTask, buildCheckTypescriptTask, vitestTypescriptTask]),
};

export default typescriptConfig;
