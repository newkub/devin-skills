# Installation

## React

```bash
bunx storybook@latest init --type react
```

## Vue

```bash
bunx storybook@latest init --type vue
```

## Angular

```bash
bunx storybook@latest init --type angular
```

## Svelte

```bash
bunx storybook@latest init --type svelte
```

## Manual Setup

```bash
bun install @storybook/react storybook
bun install -D @storybook/addon-essentials
```

## Add to package.json

```json
{
  "scripts": {
    "storybook": "storybook dev",
    "build-storybook": "storybook build"
  }
}
```

## Next Steps

- [Quick Start Guide](quick-start.md)
- [Key Concepts](key-concept.md)
- [Configuration](configuration.md)
