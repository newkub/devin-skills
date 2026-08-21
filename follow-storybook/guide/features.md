# All Features

## Stories

| Feature | Description |
|---------|-------------|
| CSF3 | Component Story Format 3 |
| Args | Dynamic arguments |
| Controls | Interactive controls |
| Actions | Action handling |
| Play | Interaction testing |

## Meta

```typescript
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  component: Button,
  title: 'Components/Button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
    },
  },
} satisfies Meta<typeof Button>;
```

## Decorators

```typescript
export default {
  decorators: [
    (Story) => (
      <div style={{ padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};
```

## Parameters

```typescript
export default {
  parameters: {
    layout: 'centered',
    backgrounds: {
      values: [
        { name: 'light', value: '#fff' },
        { name: 'dark', value: '#333' },
      ],
    },
  },
};
```

## Actions

```typescript
export const WithAction: Story = {
  args: {
    onClick: fn(),
  },
};
```

## Play Function

```typescript
export const Interaction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
  },
};
```