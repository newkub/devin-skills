---
description: Write stories with CSF3
---

## Goal

Write stories for components with Component Story Format 3

## Execute

### 1. Create Story File

Create a `Component.stories.ts` file next to the component file

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

- Use `Meta` and `StoryObj` types from framework-specific packages
- Use `tags: ['autodocs']` for automatic documentation
- Use UpperCamelCase for story exports
- Use `args` for dynamic arguments
- Use `argTypes` for control types
- Use `fn()` from `@storybook/test` for mock functions
