# Changesets CLI

## Install

```sh
bun add -D @changesets/cli
```

## Version

- Latest: see `@changesets/cli` on npm
- Repository: https://github.com/changesets/changesets
- Docs: https://github.com/changesets/changesets/blob/main/packages/cli/README.md

## Commands

| commands | default | options |
|---|---|---||---|---|---||---|---|---||
| `changeset init` | Create `.changeset/` with config and README | (none) |
| `changeset` / `changeset add` | Interactive prompt to add a changeset | `--empty`, `--open` |
| `changeset version` | Bump versions and write changelogs | `--ignore <pkg>`, `--snapshot` |
| `changeset publish` | Publish packages to npm and create tags | `--otp <token>`, `--tag` |
| `changeset status` | Report changeset status | `--verbose`, `--output <file>`, `--since <ref>` |
| `changeset pre enter <tag>` | Enter prerelease mode | (none) |
| `changeset pre exit` | Exit prerelease mode | (none) |
| `changeset tag` | Push git tags for packages | (none) |
| `changeset --help` | Show help | (none) |

## Examples

```sh
bunx changeset init
bunx changeset --empty
bunx changeset version
bunx changeset publish --otp 123456
```
