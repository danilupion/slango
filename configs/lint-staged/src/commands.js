export const prettier = 'prettier --ignore-unknown --write';

export const oxlintFix = 'oxlint --fix --max-warnings 0';

export const oxlintTypeAwareFix = 'oxlint --type-aware --fix --max-warnings 0';

// This is a function because tsc --noEmit cannot be used with files (which is the default behavior of lint-staged)
export const typescriptBuildCheck = () => 'tsc --noEmit';

export const vitest = 'vitest related --run';

export const fail = 'exit 1';
