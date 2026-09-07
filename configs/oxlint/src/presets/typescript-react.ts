import type { OxlintConfig } from 'oxlint';

import { buildConfig, type Plugins, type PresetOptions, type Rules } from '../common.js';

export type { PresetOptions } from '../common.js';

export const reactPlugins: Plugins = ['react', 'jsx-a11y'];

// Not in oxlint's correctness category but part of React's own recommended
// set (eslint-plugin-react-hooks recommended / eslint-plugin-react-refresh).
export const reactRules: Rules = {
  'react/rules-of-hooks': 'error',
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
