| key | value |
|-----|-------|
| binary | `tstyche` (`bunx tstyche`) |
| default run | `tstyche` — runs all files matched by `testFileMatch` |
| file selection | `tstyche <search...>` — case-insensitive match on path relative to cwd, within `testFileMatch` only |

## Command line options

| option | type | meaning |
|--------|------|---------|
| `--config <path>` | string | path to configuration file |
| `--failFast` | boolean | stop after first failure |
| `--fetch` | — | download the `--target`/config versions of typescript and exit |
| `--help` | — | print options and exit |
| `--list` | — | print supported typescript versions and exit |
| `--listFiles` | — | print selected test files and exit |
| `--only <name>` | string | run only tests/groups with matching name (does not override `.skip`) |
| `--prune` | — | remove all fetched typescript versions and exit |
| `--quiet` | boolean | silence output except errors/warnings |
| `--reporters <list>` | list | `dot`, `list`, `summary`, package name, or path |
| `--root <path>` | string | root directory of the test project (test files + tsconfigs must be inside) |
| `--showConfig` | — | print resolved configuration and exit |
| `--skip <name>` | string | skip tests/groups with matching name (overrides `.only`) |
| `--target <versions>` | string | versions/ranges: `5.6`, `5.8.2`, `beta`/`latest`/`next`/`rc`, ranges `>=5.4 <5.6`, combined with `\|\|` |
| `--tsconfig <mode>` | string | `findup` (default) / `baseline` / path / inline JSON |
| `--update` | — | refresh typescript package metadata from the registry and exit |
| `--verbose` | boolean | detailed logging |
| `--version` | — | print tstyche version and exit |
| `--watch` | — | re-run related files on change (watches config + test files; not on network FS) |

## Comment directives (`// @tstyche ...`)

| directive | scope | argument | meaning |
|-----------|-------|----------|---------|
| `// @tstyche fixme -- note` | assertion / test / describe | — | mark as expected-to-fail; runner verifies it actually fails |
| `// @tstyche if { target: ">=5.7" }` | assertion / test / describe / whole file | `{ target }` | run only when the TypeScript version matches |
| `// @tstyche template` | whole file | — | default export string is expanded into generated type tests |

## Common flows

| task | command |
|------|---------|
| first run / all defaults | `tstyche` |
| one file group | `tstyche query-params` |
| focus a test name | `tstyche --only external` |
| local iteration on one version | `tstyche --target 5.8.2` |
| CI full range | `tstyche --fetch && tstyche --target '>=5.6'` |
| early warning channel | `tstyche --target next` (daily CI) |
| inspect resolved setup | `tstyche --showConfig` |
| custom tsconfig for tests | `tstyche --tsconfig ./tsconfig.test.json` |
| no TSConfig lookup (compiler defaults) | `tstyche --tsconfig baseline` |
