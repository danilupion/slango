import { oxlintJavascriptTask, prettierAllTask } from '../tasks.js';

const javascriptOxlintConfig = {
  ...prettierAllTask,
  ...oxlintJavascriptTask,
};

export default javascriptOxlintConfig;
