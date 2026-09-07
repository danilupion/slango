import deepmerge from 'deepmerge';

import {
  buildCheckTypescriptTask,
  oxlintJavascriptTask,
  oxlintTypescriptTask,
  prettierAllTask,
} from '../tasks.js';

// `typescript-oxlint` without the vitest task, for packages that have no tests.
const typescriptOxlintNoTestsConfig = {
  ...prettierAllTask,
  ...oxlintJavascriptTask,
  ...deepmerge.all([oxlintTypescriptTask, buildCheckTypescriptTask]),
};

export default typescriptOxlintNoTestsConfig;
