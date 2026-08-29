# Tool Moonrepo API & Dependencies

## Install

```sh
bun add -D @moonrepo/cli
# or
npm install --save-dev @moonrepo/cli
```

## Version

- Latest: 2.5.3
- [Package Registry](https://www.npmjs.com/package/@moonrepo/cli)
- [Repository](https://github.com/moonrepo/moon)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install @moonrepo/cli in project | latest version | --save-dev, --save, --global |
| `moon` | Run the moon CLI | current workspace | --help, --version, --config |
| `moonx` | Run the moonx CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |

## Source

- Official docs: https://github.com/moonrepo/moon#readme
- Description: moon command line and core system.
