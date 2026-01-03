#!/usr/bin/env sh

# This script removes Docker images from the local machine.
echo "Preparing Docker image cleanup..."

# Ensure Docker is available before attempting to prune.
if ! command -v docker >/dev/null 2>&1; then
  echo "Docker CLI not found. Skipping."
  exit 0
fi

mode=""
image_name=""

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
      echo "Usage: clean-docker-images --all | --image <image:tag>"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: clean-docker-images --all | --image <image:tag>"
      exit 1
      ;;
  esac
done

if [ "$mode" = "all" ]; then
  echo "Removing unused Docker images..."
  # Remove images not referenced by any containers.
  docker image prune -a -f
  echo "Unused Docker images removed."
  exit 0
fi

if [ "$mode" = "image" ]; then
  if [ -z "$image_name" ]; then
    echo "Missing image name."
    echo "Usage: clean-docker-images --all | --image <image:tag>"
    exit 1
  fi

  echo "Removing Docker image: $image_name"
  if ! docker image inspect "$image_name" >/dev/null 2>&1; then
    echo "No image found for name: $image_name"
    exit 0
  fi

  docker rmi -f "$image_name"

  echo "Docker image removed: $image_name"
  exit 0
fi

echo "Usage: clean-docker-images --all | --image <image:tag>"
exit 1
