---
description: Test components with play functions and addons
---

## Goal

Test components in Storybook with interaction, accessibility, and visual tests

## Execute

### 1. Interaction Testing

Use the `play` function to test user interactions:

```typescript
import { within, userEvent } from 'storybook/test';

export const Interaction: StoryObj<typeof Button> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
  },
};
```

### 2. Accessibility Testing

Install the a11y addon:

```bash
bunx storybook add @storybook/addon-a11y
```

Configure in `.storybook/main.ts`:

```typescript
addons: ['@storybook/addon-a11y']
```

### 3. Visual Testing

Use Chromatic for visual regression testing:

```bash
bunx chromatic --project-token=<token>
```

### 4. Vitest Integration (Vite Projects)

Install the Vitest addon:

```bash
bunx storybook add @storybook/addon-vitest
```

Run tests:

```bash
bun run test-storybook
```

## Rules

- Use `storybook/test` (`within`, `userEvent`, `expect`) for user interactions — `@storybook/testing-library` is deprecated
- Use the `within` helper for scoped queries
- Handle async operations with `await`
- Test critical user flows
- Test edge cases and error states
- Configure a11y rules per WCAG standards
