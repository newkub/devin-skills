# Frontend Testing Checks

## Goal

ตรวจสอบ component testing, hook/composable testing, integration testing, E2E testing, และ test quality

## Checks

### Component Testing

1. มี component test coverage ไหม
2. มี rendering tests ไหม (renders correctly, renders with props)
3. มี interaction tests ไหม (click, input, submit)
4. ใช้ Testing Library ไหม (RTL, Vue Testing Library, Solid Testing Library)
5. มี snapshot tests ที่ meaningful ไหม (not snapshot-only)

### Hook And Composable Testing

1. มี custom hook tests ไหม (renderHook, act)
2. มี composable tests ไหม (Vue composables)
3. มี store tests ไหม (Pinia, Zustand, Redux)
4. มี context tests ไหม
5. มี utility function tests ไหม

### Integration Testing

1. มี component integration tests ไหม (multiple components together)
2. มี page integration tests ไหม
3. มี flow tests ไหม (user flow, multi-step)
4. มี API integration tests ไหม (mocked API)
5. มี store integration tests ไหม

### E2E Testing

1. มี E2E tests สำหรับ critical user flows ไหม (Playwright, Cypress)
2. มี cross-browser E2E tests ไหม
3. มี visual regression tests ไหม (Percy, Chromatic, Playwright snapshots)
4. มี E2E tests สำหรับ auth flow ไหม
5. มี E2E tests สำหรับ checkout/payment flow ไหม

### Test Quality

1. มี meaningful assertions ไหม (not just "renders without crashing")
2. มี snapshot-only tests ไหม (anti-pattern)
3. tests มี isolation ไหม (no shared state, no order dependency)
4. tests มี descriptive names ไหม
5. tests จับ bugs จริงไหม (not just coverage)

## Severity

- Critical: no tests บน critical components, no E2E บน critical flow, tests ที่ไม่จับ bugs, no error boundary tests
- High: low coverage บน critical components, missing integration tests, snapshot-only tests, no visual regression, missing auth E2E
- Medium: inconsistent test quality, missing hook tests, minor test isolation issue, missing flow tests
- Low: minor test naming, documentation gap, cosmetic test improvement
