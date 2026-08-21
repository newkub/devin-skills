# Manager API และ Preview API

Storybook แบ่ง architecture เป็น 2 ส่วนหลัก: Manager API และ Preview API

## Manager API

จัดการ UI ของ Storybook:
- Sidebar navigation
- Addon panels
- Toolbar controls
- Theme configuration

```typescript
// .storybook/manager.ts
import { addons } from '@storybook/preview-api';

addons.setConfig({
  theme: {
    base: 'light',
    brandTitle: 'My Storybook',
    brandUrl: 'https://example.com',
  },
});
```

## Preview API

จัดการ story rendering:
- Component rendering
- Decorators
- Parameters
- Global types

```typescript
// .storybook/preview.ts
import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
```

## Architecture Flow

```
Manager API (UI Layer)
       │
       ▼
Preview API (Rendering Layer)
       │
       ▼
Component (Story)
```
