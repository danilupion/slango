import type { OxlintConfig } from 'oxlint';

import { buildConfig, type PresetOptions } from '../common.js';
import { reactPlugins, reactRules } from './typescript-react.js';

export type { PresetOptions } from '../common.js';

export const createTypescriptNextConfig = (options: PresetOptions = {}): OxlintConfig =>
  buildConfig({
    options,
    plugins: [...reactPlugins, 'nextjs'],
    env: { node: true, es2025: true },
    typescriptEnv: { node: false, browser: true, es2022: true },
    typescriptGlobals: { process: 'readonly', NodeJS: 'readonly' },
    rules: {
      ...reactRules,
      // eslint-plugin-react-refresh `next` config.
      'react/only-export-components': [
        'error',
        {
          allowExportNames: [
            'experimental_ppr',
            'dynamic',
            'dynamicParams',
            'revalidate',
            'fetchCache',
            'runtime',
            'preferredRegion',
            'maxDuration',
            'metadata',
            'generateMetadata',
            'viewport',
            'generateViewport',
            'generateImageMetadata',
            'generateSitemaps',
            'generateStaticParams',
            'instant',
            'contentType',
            'size',
          ],
        },
      ],
    },
    ignores: ['**/.next/**'],
  });

export default createTypescriptNextConfig();
