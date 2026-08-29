# Framework Solidjs API & Dependencies

## Install

```sh
bun add -D solid-js
# or
npm install --save-dev solid-js
```

## Version

- Latest: 1.9.15
- [Package Registry](https://www.npmjs.com/package/solid-js)
- [Repository](https://github.com/solidjs/solid)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install solid-js | latest version | --save-dev, --save |
| `import` | Import framework runtime/config | default or named | (none) |
| `dev` | Start development server | localhost | --port, --host, --open |
| `build` | Build for production | dist/ | --outDir, --minify |
| `configure` | Edit framework config | defaults | --config |
| `import 'solid-js/h'` | Subpath export for h | entry as documented | (none) |
| `import 'solid-js/web'` | Subpath export for web | entry as documented | (none) |
| `import 'solid-js/html'` | Subpath export for html | entry as documented | (none) |
| `import 'solid-js/store'` | Subpath export for store | entry as documented | (none) |
| `import 'solid-js/dist/*'` | Subpath export for dist/* | entry as documented | (none) |
| `import 'solid-js/types/*'` | Subpath export for types/* | entry as documented | (none) |
| `import 'solid-js/h/dist/*'` | Subpath export for h/dist/* | entry as documented | (none) |
| `import 'solid-js/h/types/*'` | Subpath export for h/types/* | entry as documented | (none) |
| `import 'solid-js/universal'` | Subpath export for universal | entry as documented | (none) |
| `import 'solid-js/web/dist/*'` | Subpath export for web/dist/* | entry as documented | (none) |

## Source

- Official docs: https://solidjs.com
- Description: A declarative JavaScript library for building user interfaces.
