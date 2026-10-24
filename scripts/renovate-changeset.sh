#!/usr/bin/env bash
# Renovate PRs don't write changesets. Write a patch changeset for every package under configs/ or packages/ the PR
# touches, or an empty one when it touches none, to .changeset/renovate-<sha>.md.
# CI's renovate-changeset job only accepts files of exactly this shape, so keep the two in step.
# Usage: scripts/renovate-changeset.sh <base-ref>
set -euo pipefail
base="${1:?usage: $0 <base-ref>}"
if pnpm release:check > /dev/null 2>&1; then
  echo "No changeset needed: the PR already has one"
  exit 0
fi
paths=$(git diff --name-only "$(git merge-base "$base" HEAD)" HEAD | grep -E '^(configs|packages)/[^/]+/' |
  sed -E 's#^((configs|packages)/[^/]+)/.*#\1#' | sort -u || true)
file=".changeset/renovate-$(git rev-parse --short HEAD).md"
{
  echo '---'
  # Single quotes, as Prettier writes them: this file reaches main without going through lint-staged.
  for path in $paths; do
    if [ -f "$path/package.json" ]; then
      echo "'$(node -p "require('./$path/package.json').name")': patch"
    fi
  done
  echo '---'
  echo
  echo 'Dependencies bump'
} > "$file"
cat "$file"
