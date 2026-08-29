# Create Oxlint Plugins API & Dependencies

## Install

```sh
bun add -D oxlint
# or
npm install --save-dev oxlint
```

## Version

- Latest: 1.80.0
- [Package Registry](https://www.npmjs.com/package/oxlint)
- [Repository](https://github.com/oxc-project/oxc)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install oxlint in project | latest version | --save-dev, --save, --global |
| `oxlint` | Run the oxlint CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |
| `import 'oxlint/plugins-dev'` | Subpath export for plugins-dev | entry as documented | (none) |

## Source

- Official docs: https://oxc.rs/docs/guide/usage/linter
- Description: Linter for the JavaScript Oxidation Compiler
