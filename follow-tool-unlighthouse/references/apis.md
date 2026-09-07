# Tool Unlighthouse API & Dependencies

## Install

```sh
bun add -D unlighthouse
# or
npm install --save-dev unlighthouse
```

## Version

- Latest: 0.18.0
- [Package Registry](https://www.npmjs.com/package/unlighthouse)
- [Repository](https://github.com/harlan-zw/unlighthouse)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install unlighthouse in project | latest version | --save-dev, --save, --global |
| `unlighthouse` | Run the unlighthouse CLI | current workspace | --help, --version, --config |
| `unlighthouse-ci` | Run the unlighthouse-ci CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |
| `import 'unlighthouse/config'` | Subpath export for config | entry as documented | (none) |

## Source

- Official docs: https://github.com/harlan-zw/unlighthouse#readme
- Description: Delightfully scan your entire website with Google Lighthouse. Navigate your performance, accessibility and SEO.
