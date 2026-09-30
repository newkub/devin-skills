| key | value |
|---|---|
| package registry | https://www.npmjs.com/package/@testing-library/react |
| repository | https://github.com/testing-library/react-testing-library |
| docs | https://testing-library.com |

| api | description | default | options |
|---|---|---|---|
| `render(<C />)` | Render component | jsdom | `wrapper`, `container` |
| `screen.getByRole` / `getByText` / `findBy*` / `queryBy*` | Queries | throws if missing | `name`, `exact` |
| `userEvent.setup()` + `.click` / `.type` | Realistic events | - | await all |
| `waitFor(fn)` / `waitForElementToBeRemoved` | Async wait | 1s timeout | `timeout`, `interval` |
| `within(el)` | Scoped queries | - | - |
| `cleanup()` | Unmount | auto via globals | - |
