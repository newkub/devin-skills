# Framework Dioxus API & Dependencies

## Install

```sh
cargo add dioxus
```

## Version

- Latest: 0.8.0-alpha.1
- [Package Registry](https://crates.io/crates/dioxus)
- [Repository](https://github.com/DioxusLabs/dioxus/)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install dioxus | latest version | --save-dev, --save |
| `import` | Import framework runtime/config | default or named | (none) |
| `dev` | Start development server | localhost | --port, --host, --open |
| `build` | Build for production | dist/ | --outDir, --minify |
| `configure` | Edit framework config | defaults | --config |

## Source

- Official docs: https://crates.io/crates/dioxus
- Description: Build fullstack web, desktop, and mobile apps with a single codebase.
