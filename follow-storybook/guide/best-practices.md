# Best Practices

## Story Organization

```typescript
// Good: Group related stories
export const Primary = { ... };
export const Secondary = { ... };
export const Disabled = { ... };
```

## Args Usage

```typescript
// Use args for dynamic values
export const WithArgs: Story = {
  args: {
    label: 'Click me',
    onClick: () => console.log('clicked'),
  },
};
```

## Controls

```typescript
// Enable controls for all props
export default {
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
    },
  },
};
```

## Documentation

```typescript
// Add docstrings
/**
 * Primary button component for main actions.
 */
export const Primary: Story = { ... };
```

## Testing

```typescript
// stories/Button.stories.ts
export const Clickable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
  },
};
```