---
description: เขียน stories ด้วย CSF3
---

## Goal

เขียน stories สำหรับ components ด้วย Component Story Format 3

## Execute

### 1. Create Story File

สร้างไฟล์ `Component.stories.ts` ข้างๆ component file

### 2. Define Meta

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Components/Button',
  tags: ['autodocs'],
};

export default meta;
```

### 3. Write Stories

```typescript
export const Primary: StoryObj<typeof Button> = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};

export const Secondary: StoryObj<typeof Button> = {
  args: {
    variant: 'secondary',
    children: 'Click me',
  },
};
```

### 4. Add Controls

```typescript
const meta: Meta<typeof Button> = {
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
    },
    size: {
      control: { type: 'radio' },
      options: ['small', 'medium', 'large'],
    },
  },
};
```

### 5. Add Actions

```typescript
import { fn } from '@storybook/test';

export const WithAction: StoryObj<typeof Button> = {
  args: {
    onClick: fn(),
  },
};
```

## Rules

- ใช้ `Meta` และ `StoryObj` types จาก framework-specific packages
- ใช้ `tags: ['autodocs']` สำหรับ automatic documentation
- ใช้ UpperCamelCase สำหรับ story exports
- ใช้ `args` สำหรับ dynamic arguments
- ใช้ `argTypes` สำหรับ control types
- ใช้ `fn()` จาก `@storybook/test` สำหรับ mock functions
