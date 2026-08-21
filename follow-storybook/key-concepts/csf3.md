# Component Story Format 3 (CSF3)

CSF3 เป็น standard สำหรับเขียน stories ใน Storybook ด้วย ES6 modules

## Meta Definition

```typescript
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Components/Button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
    },
  },
};

export default meta;
```

## Story Export

```typescript
export const Primary: StoryObj<typeof Button> = {
  args: { variant: 'primary' },
};

export const Secondary: StoryObj<typeof Button> = {
  args: { variant: 'secondary' },
};
```

## Key Features

- **Meta** - Define component metadata และ default settings
- **StoryObj** - Define individual story configurations
- **args** - Dynamic arguments สำหรับ component props
- **argTypes** - Control types และ input validation
- **tags** - Enable features เช่น autodocs
