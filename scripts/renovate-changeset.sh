#!/usr/bin/env bash
# Renovate PRs don't write changesets. Write a patch changeset for every package whose published contents the PR
# changes, or an empty one when it changes none, to .changeset/renovate-<sha>.md.
# Published contents: any file of the package other than package.json, or package.json outside devDependencies. A
# devDependency bump changes nothing consumers install, so it releases nothing.
# CI's renovate-changeset job only accepts files of exactly this shape, so keep the two in step.
# Usage: scripts/renovate-changeset.sh <base-ref>
set -euo pipefail
base="${1:?usage: $0 <base-ref>}"
if pnpm release:check > /dev/null 2>&1; then
  echo "No changeset needed: the PR already has one"
  exit 0
fi
merge_base=$(git merge-base "$base" HEAD)
changed=$(git diff --name-only "$merge_base" HEAD)
paths=$(echo "$changed" | grep -E '^(configs|packages)/[^/]+/' |
  sed -E 's#^((configs|packages)/[^/]+)/.*#\1#' | sort -u || true)

# Exit 0 when the package's published contents changed.
published_change() {
  local path="$1"
  if echo "$changed" | grep -E "^$path/" | grep -v -x -F "$path/package.json" | grep -q .; then
    return 0
  fi
  node -e '
    const [before, after] = process.argv.slice(1).map((json) => {
      const { devDependencies, ...published } = JSON.parse(json);
      return JSON.stringify(published);
    });
    process.exit(before === after ? 1 : 0);
  ' "$(git show "$merge_base:$path/package.json" 2> /dev/null || echo '{}')" "$(cat "$path/package.json")"
}

file=".changeset/renovate-$(git rev-parse --short HEAD).md"
{
  echo '---'
  # Single quotes, as Prettier writes them: this file reaches main without going through lint-staged.
  for path in $paths; do
    if [ -f "$path/package.json" ] && published_change "$path"; then
      echo "'$(node -p "require('./$path/package.json').name")': patch"
    fi
  done
  echo '---'
  echo
  echo 'Dependencies bump'
} > "$file"
cat "$file"
