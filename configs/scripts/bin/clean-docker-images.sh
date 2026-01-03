#!/usr/bin/env sh

# This script removes Docker images from the local machine.

color_enabled=false
if [ -t 1 ] && [ -z "${NO_COLOR:-}" ]; then
  color_enabled=true
fi

if [ "$color_enabled" = "true" ]; then
  COLOR_RESET="$(printf '\033[0m')"
  COLOR_BOLD="$(printf '\033[1m')"
  COLOR_BLUE="$(printf '\033[34m')"
  COLOR_GREEN="$(printf '\033[32m')"
  COLOR_YELLOW="$(printf '\033[33m')"
  COLOR_RED="$(printf '\033[31m')"
else
  COLOR_RESET=""
  COLOR_BOLD=""
  COLOR_BLUE=""
  COLOR_GREEN=""
  COLOR_YELLOW=""
  COLOR_RED=""
fi

log_step() {
  printf '%s==>%s %s\n' "${COLOR_BLUE}${COLOR_BOLD}" "$COLOR_RESET" "$*"
}

log_info() {
  printf '%s[info]%s %s\n' "$COLOR_BLUE" "$COLOR_RESET" "$*"
}

log_success() {
  printf '%s[ok]%s %s\n' "$COLOR_GREEN" "$COLOR_RESET" "$*"
}

log_warn() {
  printf '%s[warn]%s %s\n' "$COLOR_YELLOW" "$COLOR_RESET" "$*"
}

log_error() {
  printf '%s[error]%s %s\n' "$COLOR_RED" "$COLOR_RESET" "$*"
}

log_step "Docker image cleanup"

# Ensure Docker is available before attempting to prune.
if ! command -v docker >/dev/null 2>&1; then
  log_warn "Docker CLI not found. Skipping."
  exit 0
fi

mode=""
image_name=""

usage() {
  printf '%s\n' "Usage: clean-docker-images --all | --image <image:tag>"
}

repo_root() {
  if command -v git >/dev/null 2>&1; then
    git rev-parse --show-toplevel 2>/dev/null || pwd
  else
    pwd
  fi
}

package_name() {
  root="$(repo_root)"
  pkg_file="$root/package.json"
  if [ ! -f "$pkg_file" ]; then
    return 1
  fi

  if command -v node >/dev/null 2>&1; then
    PKG_PATH="$pkg_file" node -p "require(process.env.PKG_PATH).name" 2>/dev/null || true
  else
    awk -F'"' '/"name"[[:space:]]*:/ { print $4; exit }' "$pkg_file"
  fi
}

repo_in_scope() {
  repo="${1:-}"
  base="${2:-}"
  repo="${repo%@*}"
  last_segment="${repo##*/}"
  case "$last_segment" in
    *:*)
      repo="${repo%:*}"
      ;;
  esac
  case "$repo" in
    "$base" | "$base/"* | */"$base" | */"$base/"*)
      return 0
      ;;
  esac
  return 1
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    -a|--all)
      mode="all"
      shift
      ;;
    -i|--image)
      mode="image"
      image_name="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      usage
      exit 1
      ;;
  esac
done

if [ -z "$mode" ]; then
  usage
  exit 1
fi

repo_name="$(package_name)"
if [ -z "$repo_name" ]; then
  log_error "Unable to determine package.json name for this repo."
  usage
  exit 1
fi

if [ "$mode" = "all" ]; then
  log_info "Scope: $repo_name"
  log_info "Scanning local images..."
  in_use_refs="$(docker ps -a --format '{{.Image}}' | sort -u)"
  images_in_scope="$(docker images --format '{{.Repository}} {{.Tag}}' | while IFS=' ' read -r repo tag; do
    [ -z "$repo" ] && continue
    [ -z "$tag" ] && continue
    [ "$repo" = "<none>" ] && continue
    [ "$tag" = "<none>" ] && continue
    if repo_in_scope "$repo" "$repo_name"; then
      printf '%s:%s\n' "$repo" "$tag"
    fi
  done)"

  if [ -z "$images_in_scope" ]; then
    log_warn "No images found for repo: $repo_name"
    exit 0
  fi

  removed_count=0
  skipped_count=0
  failed_count=0
  total_count=0

  while IFS= read -r ref; do
    [ -z "$ref" ] && continue
    total_count=$((total_count + 1))
    if [ -n "$in_use_refs" ] && echo "$in_use_refs" | grep -Fxq "$ref"; then
      skipped_count=$((skipped_count + 1))
      log_warn "In use, skipping: $ref"
      continue
    fi
    remove_output="$(docker rmi "$ref" 2>&1)"
    if [ $? -eq 0 ]; then
      removed_count=$((removed_count + 1))
      log_success "Removed: $ref"
    else
      failed_count=$((failed_count + 1))
      log_error "Failed: $ref"
      if [ -n "$remove_output" ]; then
        printf '%s\n' "$remove_output" | while IFS= read -r line; do
          printf '%s  %s%s\n' "$COLOR_RED" "$line" "$COLOR_RESET"
        done
      fi
    fi
  done <<EOF
$images_in_scope
EOF

  log_step "Summary"
  log_info "Images in scope: $total_count"
  log_success "Removed: $removed_count"
  log_warn "Skipped (in use): $skipped_count"
  if [ "$failed_count" -gt 0 ]; then
    log_error "Failed: $failed_count"
  else
    log_info "Failed: 0"
  fi
  exit 0
fi

if [ "$mode" = "image" ]; then
  if [ -z "$image_name" ]; then
    log_error "Missing image name."
    usage
    exit 1
  fi

  if ! docker image inspect "$image_name" >/dev/null 2>&1; then
    log_warn "No image found for name: $image_name"
    exit 0
  fi

  if ! repo_in_scope "$image_name" "$repo_name"; then
    log_error "Image not in scope for repo: $repo_name"
    exit 1
  fi

  log_info "Removing: $image_name"
  docker rmi -f "$image_name"

  log_success "Removed: $image_name"
  exit 0
fi

usage
exit 1
