# Testing - SolidStart

## Unit Testing

### Setup

ติดตั้ง dependencies:

```bash
bun add -D vitest @testing-library/dom solid-testing-library
```

ตั้งค่า `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
  },
});
```

### Component Testing

ใช้ Solid Testing Library:

```typescript
import { render, screen } from "solid-testing-library";
import Counter from "./Counter";

test("increments count", () => {
  render(() => <Counter />);
  const button = screen.getByText("Increment");
  button.click();
  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

### Testing Signals

```typescript
import { createSignal } from "solid-js";

test("signal updates", () => {
  const [count, setCount] = createSignal(0);
  expect(count()).toBe(0);
  setCount(1);
  expect(count()).toBe(1);
});
```

### Testing Effects

```typescript
import { createEffect, createSignal } from "solid-js";

test("effect runs on signal change", () => {
  const [count, setCount] = createSignal(0);
  let effectRun = false;
  
  createEffect(() => {
    effectRun = true;
  });
  
  expect(effectRun).toBe(true);
});
```

## Integration Testing

### API Routes

Test server functions:

```typescript
import { describe, it, expect } from "vitest";
import { GET } from "../src/routes/api/hello";

describe("API: /api/hello", () => {
  it("returns hello message", async () => {
    const response = await GET(new Request("http://localhost"));
    const data = await response.json();
    expect(data).toEqual({ message: "Hello World" });
  });
});
```

### Data Fetching

Test routeData:

```typescript
import { describe, it, expect } from "vitest";
import { routeData } from "../src/routes/users";

describe("RouteData: users", () => {
  it("fetches users", async () => {
    const data = await routeData();
    expect(data).toBeDefined();
  });
});
```

## E2E Testing

### Playwright Setup

ติดตั้ง Playwright:

```bash
bun add -D @playwright/test
bunx playwright install
```

ตั้งค่า `playwright.config.ts`:

```typescript
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:3000",
  },
});
```

### E2E Tests

```typescript
import { test, expect } from "@playwright/test";

test("navigation works", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.click("text=About");
  await expect(page).toHaveURL("/about");
});

test("form submission", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page.fill('input[name="email"]', "test@example.com");
  await page.fill('input[name="password"]', "password");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/dashboard");
});
```

## Testing Best Practices

### Test Structure

```
src/
├── components/
│   └── Button.tsx
├── components/
│   └── __tests__/
│       └── Button.test.tsx
├── routes/
│   └── api/
│       └── hello.ts
└── routes/
    └── __tests__/
        └── hello.test.tsx
```

### Test Naming

```typescript
// ✅ Good
test("increments count when button is clicked", () => {});

// ❌ Bad
test("test1", () => {});
```

### AAA Pattern

Arrange, Act, Assert:

```typescript
test("increments count", () => {
  // Arrange
  render(() => <Counter />);
  const button = screen.getByText("Increment");
  
  // Act
  button.click();
  
  // Assert
  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

## Mocking

### Mock API Calls

```typescript
import { vi } from "vitest";

vi.mock("../lib/api", () => ({
  fetchUsers: vi.fn(() => Promise.resolve([{ id: 1, name: "Test" }])),
}));
```

### Mock Router

```typescript
import { mockRouter } from "solid-testing-library";

test("navigates to about", () => {
  const router = mockRouter();
  render(() => <App />);
  router.navigate("/about");
  expect(router.location()).toBe("/about");
});
```

## Coverage

ตั้งค่า coverage:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
```

รัน coverage:

```bash
bun run test:coverage
```
