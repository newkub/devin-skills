# Tool Playwright API & Dependencies

## Install

```sh
bun add -D @playwright/test
# or
npm install --save-dev @playwright/test
```

## Version

- Latest: 1.62.1
- [Package Registry](https://www.npmjs.com/package/@playwright/test)
- [Repository](https://github.com/microsoft/playwright)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install @playwright/test in project | latest version | --save-dev, --save, --global |
| `playwright` | Run the playwright CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |
| `import '@playwright/test/cli'` | Subpath export for cli | entry as documented | (none) |
| `import '@playwright/test/reporter'` | Subpath export for reporter | entry as documented | (none) |

## Source

- Official docs: https://playwright.dev
- Description: A high-level API to automate web browsers
