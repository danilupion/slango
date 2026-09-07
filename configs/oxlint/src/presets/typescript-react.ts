import type { OxlintConfig } from 'oxlint';

import { buildConfig, type Plugins, type PresetOptions, type Rules } from '../common.js';

export type { PresetOptions } from '../common.js';

export const reactPlugins: Plugins = ['react', 'jsx-a11y'];

// Not in oxlint's correctness category but part of React's own recommended
// set (eslint-plugin-react-hooks recommended / eslint-plugin-react-refresh).
export const reactRules: Rules = {
  'react/rules-of-hooks': 'error',
  // oxlint files this under `correctness`, but eslint-plugin-jsx-a11y keeps it out of both its
  // recommended and strict configs: it flags ARIA composite widgets (combobox listbox/option,
  // tree, grid, ...) that WAI-ARIA authoring practices build on `role` on purpose, because the
  // native element cannot carry rich content.
  'jsx-a11y/prefer-tag-over-role': 'off',
};

export const createTypescriptReactConfig = (options: PresetOptions = {}): OxlintConfig =>
  buildConfig({
    options,
    plugins: reactPlugins,
    env: { node: true, es2025: true },
    typescriptEnv: { node: false, browser: true, es2022: true },
    rules: {
      ...reactRules,
      // eslint-plugin-react-refresh `vite` config.
      'react/only-export-components': ['error', { allowConstantExport: true }],
    },
  });

export default createTypescriptReactConfig();
