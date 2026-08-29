# Tool Jscpd API & Dependencies

## Install

```sh
bun add -D jscpd
# or
npm install --save-dev jscpd
```

## Version

- Latest: 5.0.16
- [Package Registry](https://www.npmjs.com/package/jscpd)
- [Repository](https://github.com/kucherenko/jscpd)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install jscpd in project | latest version | --save-dev, --save, --global |
| `jscpd` | Run the jscpd CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |

## Source

- Official docs: https://jscpd.dev
- Description: Copy/paste detector for programming source code. Finds duplicated code in 223 languages, reports as HTML/JSON/SARIF/Markdown, fails CI over a duplication threshold. Rust engine, 24-37x faster than v4 (TypeScript version: jscpd@4.x).
