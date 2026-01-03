# ![Scripts](https://img.shields.io/badge/scripts-AFD89C?style=flat-square&logo=gnu-bash) Slango Scripts (@slango.configs/scripts)

This package exposes scripts and utils.

## clean-node-modules

Removes all node_modules folders from the current directory and its subdirectories.

## clean-cache-artifacts

Removes all cache artifacts from the current directory and its subdirectories.

## clean-build-artifacts

Removes all build artifacts from the current directory and its subdirectories.

## clean-docker-images

Removes Docker images built from this repo, scoped by the `name` in the repo's `package.json`.

Usage:

```sh
clean-docker-images [options]
```

Options:

```sh
-a, --all                   Remove unused Docker images for this repo name
-i, --image <image:tag>     Remove a specific image by name and tag (scoped)
-h, --help                  Show help
```

Examples:

```sh
clean-docker-images --all
clean-docker-images --image myimage:1.0.11
```
