# Tool Ultracite API & Dependencies

## Install

```sh
bun add -D ultracite
# or
npm install --save-dev ultracite
```

## Version

- Latest: 7.10.7
- [Package Registry](https://www.npmjs.com/package/ultracite)
- [Repository](https://github.com/haydenbleasel/ultracite)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install ultracite in project | latest version | --save-dev, --save, --global |
| `ultracite` | Run the ultracite CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |
| `import 'ultracite/biome/*'` | Subpath export for biome/* | entry as documented | (none) |
| `import 'ultracite/eslint/*'` | Subpath export for eslint/* | entry as documented | (none) |
| `import 'ultracite/oxlint/*'` | Subpath export for oxlint/* | entry as documented | (none) |
| `import 'ultracite/oxfmt'` | Subpath export for oxfmt | entry as documented | (none) |
| `import 'ultracite/prettier'` | Subpath export for prettier | entry as documented | (none) |
| `import 'ultracite/stylelint'` | Subpath export for stylelint | entry as documented | (none) |

## Source

- Official docs: https://www.ultracite.ai/
- Description: The AI-ready formatter that helps you write and generate code faster.
