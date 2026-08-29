# changelogen CLI

## Install

```sh
bun add -D changelogen
```

## Version

- Latest: see `changelogen` on npm
- Repository: https://github.com/unjs/changelogen
- Docs: https://github.com/unjs/changelogen

## Commands

| commands | default | options |
|---|---|---||---|---|---||---|---|---||
| `changelogen` | Generate `CHANGELOG.md` from latest git tag to HEAD | `--from`, `--to`, `--dir`, `--clean`, `--output`, `--no-output`, `--noAuthors` |
| `changelogen --bump` | Determine semver change and update `package.json` version | `--major`, `--minor`, `--patch`, `--premajor`, `--preminor`, `--prepatch` |
| `changelogen --release` | Bump, commit, and create git tag | `--no-commit`, `--no-tag`, `--push` |
| `changelogen --publish` | Publish package to npm | `--publishTag`, `--nameSuffix`, `--versionSuffix` |
| `changelogen --canary` | Shortcut for `--bump --versionSuffix` | `--nameSuffix` |
| `changelogen --help` | Show help | (none) |

## Examples

```sh
bunx changelogen
bunx changelogen --from v1.0.0 --to HEAD
bunx changelogen --bump --release --push
bunx changelogen --canary
```
