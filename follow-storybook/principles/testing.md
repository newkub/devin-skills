# Testing Principles

หลักการสำหรับ testing ด้วย Storybook

## Test-Driven Development

- Write stories ก่อน implementation
- Use stories เป็น test cases
- Verify component behavior ด้วย play function
- Reuse stories ใน automated tests

## Testing Pyramid

- **Unit Tests** - Component logic ด้วย Vitest/Jest
- **Interaction Tests** - User behavior ด้วย play function
- **Accessibility Tests** - a11y violations ด้วย addon
- **Visual Tests** - UI consistency ด้วย Chromatic

## Play Function Best Practices

- Test user interactions ที่สำคัญ
- Use testing-library helpers
- Handle async operations
- Clean up side effects

## Test Coverage

- Test all component states
- Cover edge cases และ error conditions
- Test responsive behavior
- Verify accessibility compliance
