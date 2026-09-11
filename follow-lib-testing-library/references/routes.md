# Lib Testing Library Routes / Topics

| Route / Topic | URL |
|---|---|
| Docs home | https://testing-library.com |
| Queries priority | https://testing-library.com/docs/queries/about#priority |
| React API | https://testing-library.com/docs/react-testing-library/api |
| user-event | https://testing-library.com/docs/user-event/intro |
| jest-dom matchers | https://github.com/testing-library/jest-dom |
| Guiding principles | https://testing-library.com/docs/guiding-principles |
| Common mistakes | https://kentcdodds.com/blog/common-mistakes-with-react-testing-library |

## Key Concepts

- Query priority: `getByRole` > `getByLabelText` > `getByPlaceholderText` > `getByText` > `getByTestId` (last resort)
- `getBy*` throw ถ้าไม่เจอ; `queryBy*` คืน null (ใช้กับ negative assertions); `findBy*` async
- `userEvent` มากกว่า `fireEvent` — simulate real interaction sequence
- Vitest: `globals: true` + `setupFiles` เรียก `import '@testing-library/jest-dom/vitest'`
