| key | value |
|---|---|
| install | `bun add -D changelogen` |
| repository | https://github.com/unjs/changelogen |
| docs | https://github.com/unjs/changelogen |

| commands | description | default | options |
|---|---|---|---|
| `changelogen` | Generate `CHANGELOG.md` from latest git tag to HEAD | — | `--from`, `--to`, `--dir`, `--clean`, `--output`, `--no-output`, `--noAuthors` |
| `changelogen --bump` | Determine semver change and update `package.json` version | — | `--major`, `--minor`, `--patch`, `--premajor`, `--preminor`, `--prepatch` |
| `changelogen --release` | Bump, commit, and create git tag | — | `--no-commit`, `--no-tag`, `--push` |
| `changelogen --publish` | Publish package to npm | — | `--publishTag`, `--nameSuffix`, `--versionSuffix` |
| `changelogen --canary` | Shortcut for `--bump --versionSuffix` | — | `--nameSuffix` |
| `changelogen --help` | Show help | — | (none) |
