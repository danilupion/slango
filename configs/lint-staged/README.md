# ![Lint-staged](https://img.shields.io/badge/lint--staged-3AC486?style=flat-square) Slango Lint-Staged Configs (@slango.configs/lint-staged)

This package exposes eslint configurations for easy setup, the following presets are available:

| Name         | Description                              | Includes                 | Tasks                                |
| ------------ | ---------------------------------------- | ------------------------ | ------------------------------------ |
| `debug`      | Intended for debugging purposes          | -                        | fail                                 |
| `default`    | Preset to be used in no-code packages    | -                        | prettier                             |
| `javascript` | Preset to be used in javascript packages | `default`                | prettier + eslint                    |
| `typescript` | Preset to be used in typescript packages | `default` + `javascript` | prettier + eslint + typescript check |
