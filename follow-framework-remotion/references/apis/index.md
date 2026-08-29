# Framework Remotion API & Dependencies

## Install

```sh
bun add -D remotion
# or
npm install --save-dev remotion
```

## Version

- Latest: 4.0.518
- [Package Registry](https://www.npmjs.com/package/remotion)
- [Repository](https://github.com/remotion-dev/remotion/tree/main/packages/core)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install remotion | latest version | --save-dev, --save |
| `import` | Import framework runtime/config | default or named | (none) |
| `dev` | Start development server | localhost | --port, --host, --open |
| `build` | Build for production | dist/ | --outDir, --minify |
| `configure` | Edit framework config | defaults | --config |
| `import 'remotion/version'` | Subpath export for version | entry as documented | (none) |
| `import 'remotion/no-react'` | Subpath export for no-react | entry as documented | (none) |

## Source

- Official docs: https://www.remotion.dev/docs/remotion
- Description: Make videos programmatically
