import type { OxlintConfig } from 'oxlint';

import { buildConfig, type PresetOptions } from '../common.js';

export type { PresetOptions } from '../common.js';

export const createTypescriptNodeConfig = (options: PresetOptions = {}): OxlintConfig =>
  buildConfig({
    options,
    env: { node: true, es2025: true },
  });

export default createTypescriptNodeConfig();
