# ![Lint-staged](https://img.shields.io/badge/lint--staged-3AC486?style=flat-square) Slango Lint-Staged Configs (@slango.configs/lint-staged)

This package exposes lint-staged configurations for easy setup, the following presets are available:

| Name                         | Description                                                             | Includes                        | Tasks                                            |
| ---------------------------- | ----------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------ |
| `debug`                      | Intended for debugging purposes                                         | -                               | fail                                             |
| `default`                    | Preset to be used in no-code packages                                   | -                               | prettier                                         |
| `javascript-oxlint`          | `javascript` for packages linted with oxlint (`@slango.configs/oxlint`) | `default`                       | prettier + oxlint                                |
| `typescript-oxlint`          | `typescript` for packages linted with oxlint (`@slango.configs/oxlint`) | `default` + `javascript-oxlint` | prettier + oxlint + typescript check             |
| `typescript-oxlint-no-tests` | `typescript-oxlint` for packages without tests                          | `default` + `javascript-oxlint` | prettier + oxlint + typescript check (no vitest) |
