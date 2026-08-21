# Quick Start

## Create Story

```typescript
// Button.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  component: Button,
  title: 'Button',
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Button',
    variant: 'secondary',
  },
};
```

## Run Storybook

```bash
bun run storybook
```

## Open Browser

Visit http://localhost:6006

## Next Steps

- [Key Concepts](key-concept.md)
- [Best Practices](best-practices.md)
- [Configuration](configuration.md)
