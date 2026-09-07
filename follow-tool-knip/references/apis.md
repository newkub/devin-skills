# Tool Knip API & Dependencies

## Install

```sh
bun add -D knip
# or
npm install --save-dev knip
```

## Version

- Latest: 6.33.0
- [Package Registry](https://www.npmjs.com/package/knip)
- [Repository](https://github.com/webpro/knip)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install knip in project | latest version | --save-dev, --save, --global |
| `knip` | Run the knip CLI | current workspace | --help, --version, --config |
| `knip-bun` | Run the knip-bun CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |
| `import 'knip/config'` | Subpath export for config | entry as documented | (none) |
| `import 'knip/session'` | Subpath export for session | entry as documented | (none) |

## Source

- Official docs: https://knip.dev
- Description: Find and fix unused dependencies, exports and files in your TypeScript and JavaScript projects
