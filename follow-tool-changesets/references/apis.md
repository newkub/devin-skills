| key | value |
|---|---|
| install | `bun add -D @changesets/cli` |
| version | 3.0.2 |
| package registry | https://www.npmjs.com/package/@changesets/cli |
| repository | https://github.com/changesets/changesets |
| docs | https://changesets.dev |

| commands | description | default | options |
|---|---|---|---|
| `install` | Install @changesets/cli in project | latest version | --save-dev, --save, --global |
| `changeset` | Run the changeset CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |
| `import '@changesets/cli/bin.js'` | Subpath export for bin.js | entry as documented | (none) |
| `import '@changesets/cli/commit'` | Subpath export for commit | entry as documented | (none) |
| `import '@changesets/cli/changelog'` | Subpath export for changelog | entry as documented | (none) |
