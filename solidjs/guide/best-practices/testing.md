---
title: Testing
description: วิธีทดสอบ SolidJS applications
---

## Setup Testing

ติดตั้ง dependencies:

```bash
bun add -D vitest @solidjs/testing-library @testing-library/jest-dom
```

ตั้งค่า `vitest.config.js`:

```javascript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
  },
});
```

## Testing Components

### Basic Test

```javascript
import { render, screen } from "solid-js/testing-library";
import { describe, it, expect } from "vitest";
import Counter from "./Counter";

describe("Counter", () => {
  it("renders initial count", () => {
    render(() => <Counter />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
```

### Testing Interactions

```javascript
it("increments count on click", () => {
  render(() => <Counter />);
  const button = screen.getByRole("button");
  button.click();
  expect(screen.getByText("1")).toBeInTheDocument();
});
```

### Testing Props

```javascript
it("renders with custom initial value", () => {
  render(() => <Counter initial={5} />);
  expect(screen.getByText("5")).toBeInTheDocument();
});
```

## Testing Hooks

### Custom Hook Test

```javascript
import { createRoot } from "solid-js";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  it("increments count", () => {
    let result;
    createRoot((dispose) => {
      result = useCounter(0);
      dispose();
    });
    
    result.increment();
    expect(result.count()).toBe(1);
  });
});
```

## Testing Async

### With createResource

```javascript
import { waitFor } from "@solidjs/testing-library";

it("loads data asynchronously", async () => {
  render(() => <DataLoader />);
  
  await waitFor(() => {
    expect(screen.getByText("Loaded")).toBeInTheDocument();
  });
});
```

## Testing Stores

```javascript
import { createStore } from "solid-js/store";

describe("UserStore", () => {
  it("updates user name", () => {
    const [user, setUser] = createStore({ name: "" });
    
    setUser("name", "John");
    expect(user.name).toBe("John");
  });
});
```

## Testing User Flows

```javascript
describe("Login Flow", () => {
  it("logs in successfully", async () => {
    render(() => <LoginForm />);
    
    const username = screen.getByLabelText("Username");
    const password = screen.getByLabelText("Password");
    const submit = screen.getByText("Login");
    
    username.value = "john";
    password.value = "password";
    submit.click();
    
    await waitFor(() => {
      expect(screen.getByText("Welcome, John")).toBeInTheDocument();
    });
  });
});
```

## Testing Library Helpers

### Queries

```javascript
// By text
screen.getByText("Hello")
screen.queryByText("Hello")
screen.findAllByText("Hello")

// By role
screen.getByRole("button")
screen.getByLabelText("Username")

// By test id
screen.getByTestId("submit-btn")
```

### Fire Events

```javascript
import { fireEvent } from "@solidjs/testing-library";

fireEvent.click(button);
fireEvent.change(input, { target: { value: "test" }});
```

## ถัดไป

ดู [Troubleshooting](./troubleshooting.md) เพื่อแก้ปัญหาที่พบบ่อย
