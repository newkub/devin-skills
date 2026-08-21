# Addon System

Storybook addons ขยาย functionality ผ่าน addon API

## Essentials Bundle

รวม addons หลักไว้ใน bundle เดียว:
- Controls - Dynamic prop controls
- Actions - Event logging
- Docs - Auto-generated documentation
- Backgrounds - Background color switching

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  addons: ['@storybook/addon-essentials'],
};

export default config;
```

## Addon API

```typescript
import { addDecorator, addParameters, addArgTypes } from '@storybook/preview-api';

// Add decorator
addDecorator((Story) => <ThemeProvider><Story /></ThemeProvider>);

// Add parameters
addParameters({ layout: 'centered' });

// Add argTypes
addArgTypes({
  color: {
    control: 'color',
  },
});
```

## Installing Addons

```bash
npx storybook add @storybook/addon-a11y
npx storybook add @storybook/addon-links
```

## Custom Addons

สร้าง custom addons ด้วย:
- Panel registration
- Parameter handling
- Channel communication
