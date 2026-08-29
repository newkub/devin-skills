# auto CLI

## Install

```sh
bun add -D auto
```

## Version

- Latest on npm
- Repository: https://github.com/intuit/auto
- Docs: https://intuit.github.io/auto/

## Commands

| commands | default | options |
|---|---|---||---|---|---||---|---|---||
| `auto init` | Initialize auto config and plugins | --only-pkg |
| `auto shipit` | Publish a new release | -d, --dry-run, --no-changelog, --no-chromy |
| `auto version` | Calculate version bump | --from, --to |
| `auto changelog` | Generate changelog | --from, --to, -d |
| `auto release` | Create GitHub release | --use-version |
| `auto label` | Manage labels | --pr, --reset |
| `auto pr-check` | Validate PR labels | --pr, --url |
| `auto --help` | Show help | (none) |
## Examples

```sh
bunx auto init
```
```sh
bunx auto shipit -d
```
