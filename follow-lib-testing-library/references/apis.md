# Lib Testing Library API & Dependencies

## Install

```sh
# React
bun add -D @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom
# Vue
bun add -D @testing-library/vue
# DOM (framework-agnostic)
bun add -D @testing-library/dom
```

## Version

- `@testing-library/react`: `16.3.3`, `@testing-library/dom`: `10.4.x`, `user-event`: `14.6.x` (verified 2026-09-11)
- [Package Registry](https://www.npmjs.com/package/@testing-library/react)
- [Repository](https://github.com/testing-library/react-testing-library)

## Dependencies

- React variant ต้องการ `react`, `react-dom` + test runner (`vitest`) + DOM env (`jsdom`/`happy-dom`)
- `@testing-library/react` v16 ต้อง `@testing-library/dom` เป็น peer แยก (ติดตั้งเอง)

## Common API / Commands

| api | description | default | options |
|---|---|---|---|
| `render(<C />)` | Render component | jsdom | `wrapper`, `container` |
| `screen.getByRole` / `getByText` / `findBy*` / `queryBy*` | Queries | throws if missing | `name`, `exact` |
| `userEvent.setup()` + `.click` / `.type` | Realistic events | - | await all |
| `waitFor(fn)` / `waitForElementToBeRemoved` | Async wait | 1s timeout | `timeout`, `interval` |
| `within(el)` | Scoped queries | - | - |
| `cleanup()` | Unmount | auto via globals | - |

## Source

- Official docs: https://testing-library.com
- Description: Testing utilities ที่ test เหมือน user ใช้งานจริง — ไม่ test implementation details.
