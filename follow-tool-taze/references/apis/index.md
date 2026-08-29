# Tool Taze API & Dependencies

## Install

```sh
bun add -D taze
# or
npm install --save-dev taze
```

## Version

- Latest: 21.1.0
- [Package Registry](https://www.npmjs.com/package/taze)
- [Repository](https://github.com/antfu-collective/taze)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install taze in project | latest version | --save-dev, --save, --global |
| `taze` | Run the taze CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |
| `import 'taze/cli'` | Subpath export for cli | entry as documented | (none) |

## Source

- Official docs: https://github.com/antfu-collective/taze#readme
- Description: A modern CLI tool that keeps your dependencies fresh in any repo and monorepo
