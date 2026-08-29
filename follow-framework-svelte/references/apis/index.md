# Framework Svelte API & Dependencies

## Install

```sh
bun add -D svelte
# or
npm install --save-dev svelte
```

## Version

- Latest: 5.57.0
- [Package Registry](https://www.npmjs.com/package/svelte)
- [Repository](https://github.com/sveltejs/svelte)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install svelte | latest version | --save-dev, --save |
| `import` | Import framework runtime/config | default or named | (none) |
| `dev` | Start development server | localhost | --port, --host, --open |
| `build` | Build for production | dist/ | --outDir, --minify |
| `configure` | Edit framework config | defaults | --config |
| `import 'svelte/store'` | Subpath export for store | entry as documented | (none) |
| `import 'svelte/action'` | Subpath export for action | entry as documented | (none) |
| `import 'svelte/easing'` | Subpath export for easing | entry as documented | (none) |
| `import 'svelte/events'` | Subpath export for events | entry as documented | (none) |
| `import 'svelte/legacy'` | Subpath export for legacy | entry as documented | (none) |
| `import 'svelte/motion'` | Subpath export for motion | entry as documented | (none) |
| `import 'svelte/server'` | Subpath export for server | entry as documented | (none) |
| `import 'svelte/animate'` | Subpath export for animate | entry as documented | (none) |
| `import 'svelte/compiler'` | Subpath export for compiler | entry as documented | (none) |
| `import 'svelte/elements'` | Subpath export for elements | entry as documented | (none) |

## Source

- Official docs: https://svelte.dev
- Description: Cybernetically enhanced web apps
