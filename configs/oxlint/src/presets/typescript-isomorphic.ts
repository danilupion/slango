import type { OxlintConfig } from 'oxlint';

import { buildConfig, type PresetOptions } from '../common.js';

export type { PresetOptions } from '../common.js';

export const createTypescriptIsomorphicConfig = (options: PresetOptions = {}): OxlintConfig =>
  buildConfig({
    options,
    env: { node: true, es2025: true },
    typescriptEnv: { node: true, browser: true, es2022: true },
  });

export default createTypescriptIsomorphicConfig();
