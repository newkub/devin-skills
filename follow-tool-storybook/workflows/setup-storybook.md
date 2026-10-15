---
description: Set up Storybook in a new project
---

## Goal

Install and configure Storybook in the project

## Execute

### 1. Install Storybook

```bash
bun create storybook@latest
```

Or directly via the storybook CLI (v10+):

```bash
bunx storybook@latest create
```

### 2. Select Framework

Select the appropriate framework:
- React
- Vue
- Angular
- Svelte
- Web Components
- React Native

### 3. Configure Framework

Storybook detects the framework automatically and installs the right packages:
- `@storybook/react-vite` for React + Vite
- `@storybook/react-webpack5` for React + Webpack
- `@storybook/vue3-vite` for Vue 3 + Vite
- `@storybook/angular` for Angular

### 4. Add Scripts

```json
{
  "scripts": {
    "storybook": "storybook dev",
    "build-storybook": "storybook build"
  }
}
```

### 5. Start Development Server

```bash
bun run storybook
```

## Rules

- Use the Vite builder when possible for better performance
- Check the requirements: Node.js 20.19+ or 22.12+ (v10 needs `require(esm)`), npm 10+, pnpm 9+, yarn 4+, bun 1.4+
- Check the framework requirements: Angular 18+, React Native 0.72+, Svelte 5+, Vue 3+, Vite 5+
- Use the `--type` flag if auto-detection fails
- Use the `--package-manager` flag to specify the package manager
