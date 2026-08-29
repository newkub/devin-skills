# Taze CLI

## Install

```sh
bun add -D taze
```

## Version

- Latest: see `taze` on npm
- Repository: https://github.com/antfu-collective/taze
- Docs: https://www.npmjs.com/package/taze

## Commands

| commands | description | default | options |
|---|---|---|---|
| `taze` | Check dependency updates within current semver range | — | `-r, --recursive`, `--include`, `--exclude`, `--include-locked`, `-l, --show-locked`, `--peer`, `--write`, `--install`, `--json`, `--interactive` |
| `taze major` | Allow major (breaking) updates | — | same as above |
| `taze minor` | Allow minor updates within same major | — | same as above |
| `taze patch` | Allow patch updates | — | same as above |
| `taze --help` | Show help | — | (none) |

## Options

| Option | Description |
|---|---|---||---|---|---||
| `-r, --recursive` | Scan monorepo packages |
| `--include` / `--exclude` | Filter packages by name/regex |
| `--include-locked` / `-l` | Include fixed versions |
| `--peer` | Include `peerDependencies` |
| `--write` | Write updates to `package.json` |
| `--install` | Run install after writing |
| `--json` | Output JSON for agents |
| `--interactive` | Interactive selection |

## Examples

```sh
bunx taze
bunx taze major --write --install
bunx taze -r --json
bunx taze --include esbuild
```
