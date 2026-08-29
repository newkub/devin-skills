# semantic-release CLI

## Install

```sh
bun add -D semantic-release
```

## Version

- Latest on npm
- Repository: https://github.com/semantic-release/semantic-release
- Docs: https://github.com/semantic-release/semantic-release

## Commands

| commands | description | default | options |
|---|---|---|---|
| `semantic-release` | Run release from CI | — | --dry-run, --debug, --branches, --plugins |
| `semantic-release --dry-run` | Simulate release | — | --repository-url, --tag-format |
| `semantic-release --debug` | Verbose debug output | — | --debug |
## Examples

```sh
bunx semantic-release --dry-run
```
```sh
bunx semantic-release --branches main
```
