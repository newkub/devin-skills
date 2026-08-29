# Tool Bunup API & Dependencies

## Install

```sh
bun add -D bunup
# or
npm install --save-dev bunup
```

## Version

- Latest: 0.16.32
- [Package Registry](https://www.npmjs.com/package/bunup)
- [Repository](https://github.com/bunup/bunup)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install bunup in project | latest version | --save-dev, --save, --global |
| `bunup` | Run the bunup CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |
| `import 'bunup/plugins'` | Subpath export for plugins | entry as documented | (none) |

## Source

- Official docs: https://bunup.dev
- Description: ⚡ A blazing-fast build tool for your libraries built with Bun.
