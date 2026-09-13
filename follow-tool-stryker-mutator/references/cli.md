# Stryker Mutator CLI

## Install

```sh
bun add -D @stryker-mutator/core
```

Note: `stryker-cli` บน npm ถูก deprecated — binary `stryker` ship มาพร้อม `@stryker-mutator/core`

## Version

- Latest: `@stryker-mutator/core@10.0.0` (verified 2026-09-13)
- Repository: https://github.com/stryker-mutator/stryker-js
- Docs: https://stryker-mutator.io/docs/stryker-js/usage/

## Commands

| commands | description | default | options |
|---|---|---|---|
| `stryker run [config]` | Run mutation testing | look for `stryker.config.*` in cwd | `--configFile`, `--mutate`, `--reporters`, `--testRunner`, `--coverageAnalysis`, `--concurrency`, `--buildCommand`, `--checkers`, `--disableBail`, `--allowEmpty` |
| `stryker init` | Initialize Stryker config and install packages | — | (none) |
| `stryker --help` | Show help | — | (none) |

## Options

| Option | Description |
|---|---|
| `--configFile`, `-f` | Path to config file |
| `--mutate`, `-m` | Files to mutate |
| `--reporters`, `-r` | Reporters |
| `--testRunner`, `-t` | Test runner (`jest`, `mocha`, `karma`, etc.) |
| `--coverageAnalysis` | Coverage analysis mode: `perTest`, `all`, `off` |
| `--concurrency` | Number of workers or percentage |
| `--buildCommand`, `-b` | Build command to run before tests |
| `--checkers` | Checkers to run (`typescript`) |
| `--disableBail` | Do not stop on first surviving mutant |
| `--allowEmpty` | Allow no mutants |

## Examples

```sh
bunx stryker init
bunx stryker run
bunx stryker run --reporters html,dashboard
bunx stryker run --concurrency 4 --disableBail
```
