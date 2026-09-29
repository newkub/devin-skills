# review-frontend — Full Dimension Checklist

## 1. Component Architecture

- [ ] component boundaries, SRP, composition over prop drilling
- [ ] presentational vs container separation ที่เหมาะ
- [ ] reusable abstractions, no copy-paste components
- [ ] controlled/uncontrolled consistency

## 2. State And Hooks

- [ ] state colocation, no over-global state
- [ ] hooks rules respected, deps arrays correct
- [ ] derived state vs stored state, no state duplication
- [ ] server state vs client state separation (query libs)

## 3. Rendering Performance

- [ ] unnecessary re-renders, memoization ที่ถูกจุด
- [ ] list virtualization สำหรับ lists ใหญ่, keys stable
- [ ] lazy loading, suspense boundaries
- [ ] effect cleanup, subscription leaks

## 4. Type Safety

- [ ] props typed, no `any` leaks, generics เหมาะสม
- [ ] event handlers typed, API response types

## 5. CSS And Styling

- [ ] styling approach consistent (design tokens, utility)
- [ ] specificity wars, !important abuse, dead CSS
- [ ] responsive patterns, dark mode support

## 6. Forms And Errors

- [ ] form validation, dirty/touched states, error display
- [ ] error boundaries ครอบคลุม, fallback UIs
- [ ] loading/empty/skeleton states

## 7. Testing

- [ ] component tests: render, interaction, a11y
- [ ] no implementation-detail testing, meaningful assertions

## 8. Build Integration

- [ ] bundle contribution, code splitting (เชื่อม `/review-bundle`)
- [ ] env var usage, feature flags

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
