| key | value |
|---|---|
| install | `bun add -D @stryker-mutator/core` |
| repository | https://github.com/stryker-mutator/stryker-js |
| docs | https://stryker-mutator.io/docs/stryker-js/usage/ |

| commands | description | default | options |
|---|---|---|---|
| `stryker run [config]` | Run mutation testing | look for `stryker.config.*` in cwd | `--configFile`, `--mutate`, `--reporters`, `--testRunner`, `--coverageAnalysis`, `--concurrency`, `--buildCommand`, `--checkers`, `--disableBail`, `--allowEmpty` |
| `stryker init` | Initialize Stryker config and install packages | — | (none) |
| `stryker --help` | Show help | — | (none) |

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
