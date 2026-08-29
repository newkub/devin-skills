# Tool Storybook API & Dependencies

## Install

```sh
bun add -D storybook
# or
npm install --save-dev storybook
```

## Version

- Latest: 10.5.10
- [Package Registry](https://www.npmjs.com/package/storybook)
- [Repository](https://github.com/storybookjs/storybook)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install storybook in project | latest version | --save-dev, --save, --global |
| `storybook` | Run the tool CLI | current workspace | see cli.md |
| `configure` | Configure via config file | project defaults | --config, --file |
| `import 'storybook/test'` | Subpath export for test | entry as documented | (none) |
| `import 'storybook/actions'` | Subpath export for actions | entry as documented | (none) |
| `import 'storybook/theming'` | Subpath export for theming | entry as documented | (none) |
| `import 'storybook/viewport'` | Subpath export for viewport | entry as documented | (none) |
| `import 'storybook/highlight'` | Subpath export for highlight | entry as documented | (none) |
| `import 'storybook/backgrounds'` | Subpath export for backgrounds | entry as documented | (none) |
| `import 'storybook/manager-api'` | Subpath export for manager-api | entry as documented | (none) |
| `import 'storybook/preview-api'` | Subpath export for preview-api | entry as documented | (none) |
| `import 'storybook/internal/cli'` | Subpath export for internal/cli | entry as documented | (none) |
| `import 'storybook/internal/csf'` | Subpath export for internal/csf | entry as documented | (none) |

## Source

- Official docs: https://storybook.js.org
- Description: Storybook: Develop, document, and test UI components in isolation
