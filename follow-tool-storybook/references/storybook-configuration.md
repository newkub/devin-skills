# Configuration Reference

## Main Configuration (.storybook/main.ts)

```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  // v10: controls/actions/interactions/viewport/backgrounds are core features.
  // Only list remaining addons here:
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    defaultName: 'Documentation',
  },
  staticDirs: ['../public'],
  typescript: {
    check: false,
    checkOptions: {},
  },
};

export default config;
```

## Configuration Options

| Option | Description |
|--------|-------------|
| `stories` | Array of globs สำหรับ story files |
| `addons` | List of addons ที่จะ load |
| `framework` | Framework-specific settings |
| `docs` | Autodocs configuration |
| `staticDirs` | Static files directories |
| `typescript` | TypeScript configuration |
| `core` | Core features (telemetry, etc.) |
| `features` | Feature flags |
| `refs` | Storybook composition |
| `logLevel` | Log level (debug, info, warn, error) |
| `webpackFinal` | Webpack customization |
| `viteFinal` | Vite customization |
| `env` | Environment variables |
| `build` | Build optimization |

## Preview Configuration (.storybook/preview.ts)

```typescript
import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      options: {
        light: { name: 'light', value: '#ffffff' },
        dark: { name: 'dark', value: '#333333' },
      },
    },
    viewport: {
      viewports: {
        mobile: '375px',
        tablet: '768px',
        desktop: '1024px',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  initialGlobals: {
    theme: 'light',
    backgrounds: { value: 'light' },
  },
};

export default preview;
```

## Manager Configuration (.storybook/manager.ts)

```typescript
import { addons } from 'storybook/manager-api';

addons.setConfig({
  theme: {
    base: 'light',
    brandTitle: 'My Storybook',
    brandUrl: 'https://example.com',
    brandImage: 'https://example.com/logo.png',
  },
  sidebar: {
    showRoots: true,
  },
});
```

## Framework-Specific Configurations

### React + Vite

```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};
```

### React + Webpack

```typescript
import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
};
```

### Vue 3 + Vite

```typescript
import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
};
```

### Angular

```typescript
import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/angular',
    options: {},
  },
};
```
