import { eslintJavascriptTask, prettierAllTask } from '../tasks.js';

const javascriptConfig = {
  ...prettierAllTask,
  ...eslintJavascriptTask,
};

export default javascriptConfig;
