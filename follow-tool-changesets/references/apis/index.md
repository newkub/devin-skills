# Tool Changesets API & Dependencies

## Install

```sh
bun add -D @changesets/cli
# or
npm install --save-dev @changesets/cli
```

## Version

- Latest: 3.0.1
- [Package Registry](https://www.npmjs.com/package/@changesets/cli)
- [Repository](https://github.com/changesets/changesets)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install @changesets/cli in project | latest version | --save-dev, --save, --global |
| `changeset` | Run the changeset CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |
| `import '@changesets/cli/bin.js'` | Subpath export for bin.js | entry as documented | (none) |
| `import '@changesets/cli/commit'` | Subpath export for commit | entry as documented | (none) |
| `import '@changesets/cli/changelog'` | Subpath export for changelog | entry as documented | (none) |

## Source

- Official docs: https://changesets.dev
- Description: A tool to manage versioning and changelogs with a focus on monorepos
