# Tool Release It API & Dependencies

## Install

```sh
bun add -D release-it
# or
npm install --save-dev release-it
```

## Version

- Latest: 21.0.2
- [Package Registry](https://www.npmjs.com/package/release-it)
- [Repository](https://github.com/release-it/release-it)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install release-it in project | latest version | --save-dev, --save, --global |
| `release-it` | Run the release-it CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |
| `import 'release-it/test/util/index.js'` | Subpath export for test/util/index.js | entry as documented | (none) |

## Source

- Official docs: https://github.com/release-it/release-it
- Description: Generic CLI tool to automate versioning and package publishing-related tasks.
