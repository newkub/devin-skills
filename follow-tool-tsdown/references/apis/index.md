# Tool Tsdown API & Dependencies

## Install

```sh
bun add -D tsdown
# or
npm install --save-dev tsdown
```

## Version

- Latest: 0.22.14
- [Package Registry](https://www.npmjs.com/package/tsdown)
- [Repository](https://github.com/rolldown/tsdown)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install tsdown in project | latest version | --save-dev, --save, --global |
| `tsdown` | Run the tsdown CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |
| `import 'tsdown/run'` | Subpath export for run | entry as documented | (none) |
| `import 'tsdown/client'` | Subpath export for client | entry as documented | (none) |
| `import 'tsdown/config'` | Subpath export for config | entry as documented | (none) |
| `import 'tsdown/plugins'` | Subpath export for plugins | entry as documented | (none) |
| `import 'tsdown/internal'` | Subpath export for internal | entry as documented | (none) |

## Source

- Official docs: http://tsdown.dev/
- Description: The Elegant Bundler for Libraries
