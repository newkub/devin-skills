---
description: Test components ด้วย play function และ addons
---

## Goal

Test components ใน Storybook ด้วย interaction, accessibility, และ visual tests

## Execute

### 1. Interaction Testing

ใช้ `play` function สำหรับ test user interactions:

```typescript
import { within, userEvent } from '@storybook/testing-library';

export const Interaction: StoryObj<typeof Button> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
  },
};
```

### 2. Accessibility Testing

ติดตั้ง a11y addon:

```bash
npx storybook add @storybook/addon-a11y
```

Configure ใน `.storybook/main.ts`:

```typescript
addons: ['@storybook/addon-essentials', '@storybook/addon-a11y']
```

### 3. Visual Testing

ใช้ Chromatic สำหรับ visual regression testing:

```bash
npx chromatic --project-token=<token>
```

### 4. Vitest Integration (Vite Projects)

ติดตั้ง Vitest addon:

```bash
npx storybook add @storybook/addon-vitest
```

Run tests:

```bash
bun run test-storybook
```

## Rules

- ใช้ `@storybook/testing-library` สำหรับ user interactions
- ใช้ `within` helper สำหรับ scoped queries
- Handle async operations ด้วย `await`
- Test critical user flows
- Test edge cases และ error states
- Configure a11y rules ตาม WCAG standards
