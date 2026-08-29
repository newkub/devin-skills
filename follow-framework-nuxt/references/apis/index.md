# Framework Nuxt API & Dependencies

## Install

```sh
bun add -D nuxt
# or
npm install --save-dev nuxt
```

## Version

- Latest: 4.5.2
- [Package Registry](https://www.npmjs.com/package/nuxt)
- [Repository](https://github.com/nuxt/nuxt)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install nuxt in project | latest version | --save-dev, --save, --global |
| `nuxi` | Run the nuxi CLI | current workspace | --help, --version, --config |
| `nuxt` | Run the nuxt CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |
| `import 'nuxt/app'` | Subpath export for app | entry as documented | (none) |
| `import 'nuxt/kit'` | Subpath export for kit | entry as documented | (none) |
| `import 'nuxt/meta'` | Subpath export for meta | entry as documented | (none) |
| `import 'nuxt/entry'` | Subpath export for entry | entry as documented | (none) |
| `import 'nuxt/config'` | Subpath export for config | entry as documented | (none) |
| `import 'nuxt/schema'` | Subpath export for schema | entry as documented | (none) |
| `import 'nuxt/styles'` | Subpath export for styles | entry as documented | (none) |
| `import 'nuxt/manifest'` | Subpath export for manifest | entry as documented | (none) |
| `import 'nuxt/entry-ids'` | Subpath export for entry-ids | entry as documented | (none) |
| `import 'nuxt/entry-chunk'` | Subpath export for entry-chunk | entry as documented | (none) |

## Source

- Official docs: https://nuxt.com
- Description: Nuxt is a free and open-source framework with an intuitive and extendable way to create type-safe, performant and production-grade full-stack web applications and websites with Vue.js.
