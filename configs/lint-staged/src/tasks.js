import {
  eslintFix,
  oxlintFix,
  oxlintTypeAwareFix,
  prettier,
  typescriptBuildCheck,
  vitest,
} from './commands.js';
import { allGlob, javascriptGlob, typescriptGlob } from './globs.js';

export const prettierAllTask = {
  [allGlob]: [prettier],
};

export const eslintJavascriptTask = {
  [javascriptGlob]: [eslintFix],
};

export const eslintTypescriptTask = {
  [typescriptGlob]: [eslintFix],
};

// oxlint applies JS-plugin fixes (perfectionist) in a single pass, so sorting
// imports and then their named specifiers needs a second run to converge.
export const oxlintJavascriptTask = {
  [javascriptGlob]: [oxlintFix, oxlintFix],
};

export const oxlintTypescriptTask = {
  [typescriptGlob]: [oxlintTypeAwareFix, oxlintTypeAwareFix],
};

export const buildCheckTypescriptTask = {
  [typescriptGlob]: [typescriptBuildCheck],
};

export const vitestTypescriptTask = {
  [typescriptGlob]: [vitest],
};
