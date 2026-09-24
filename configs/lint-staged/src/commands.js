export const prettier = 'prettier --ignore-unknown --write';

// lint-staged passes explicit paths, so a staged file matching the package's
// ignorePatterns leaves oxlint with nothing to lint, which is not an error here.
export const oxlintFix = 'oxlint --fix --max-warnings 0 --no-error-on-unmatched-pattern';

export const oxlintTypeAwareFix =
  'oxlint --type-aware --fix --max-warnings 0 --no-error-on-unmatched-pattern';

// This is a function because tsc --noEmit cannot be used with files (which is the default behavior of lint-staged)
export const typescriptBuildCheck = () => 'tsc --noEmit';

export const vitest = 'vitest related --run';

export const fail = 'exit 1';
