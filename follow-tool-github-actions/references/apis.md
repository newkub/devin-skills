# Tool Github Actions API & Dependencies

## Install

```sh
bun add -D gh
# or
npm install --save-dev gh
```

## Version

- Latest: gh CLI `2.100.0` (github.com/cli/cli, verified 2026-09-11) — หมายเหตุ: npm package `gh` ไม่ใช่ GitHub CLI ตัวจริง ติดตั้งผ่าน `mise use -g gh` หรือ https://cli.github.com
- [Package Registry](https://www.npmjs.com/package/gh)
- [Repository](https://github.com/node-gh/gh)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install gh in project | latest version | --save-dev, --save, --global |
| `gh` | Run the gh CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |

## Source

- Official docs: http://nodegh.io
- Description: Boost your productivity & automate tasks when working with GitHub, all from the comfort of your CLI.
