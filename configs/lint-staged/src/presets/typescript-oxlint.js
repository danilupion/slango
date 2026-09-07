import deepmerge from 'deepmerge';

import {
  buildCheckTypescriptTask,
  oxlintJavascriptTask,
  oxlintTypescriptTask,
  prettierAllTask,
  vitestTypescriptTask,
} from '../tasks.js';

const typescriptOxlintConfig = {
  ...prettierAllTask,
  ...oxlintJavascriptTask,
  ...deepmerge.all([oxlintTypescriptTask, buildCheckTypescriptTask, vitestTypescriptTask]),
};

export default typescriptOxlintConfig;
