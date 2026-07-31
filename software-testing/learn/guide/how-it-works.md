# How It Works

## Test Execution Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                      Test Execution Flow                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. Setup                                                         │
│  ┌─────────────────────────────────────┐                        │
│  │  - Load test files                   │                        │
│  │  - Initialize fixtures                │                        │
│  │  - Setup mock/stubs                  │                        │
│  └──────────────────┬────────────────────┘                        │
│                     │                                             │
│                     ▼                                             │
│  2. Execute                                                        │
│  ┌─────────────────────────────────────┐                        │
│  │  - Run each test case                │                        │
│  │  - Call function with inputs         │                        │
│  │  - Capture results                   │                        │
│  └──────────────────┬────────────────────┘                        │
│                     │                                             │
│                     ▼                                             │
│  3. Assert                                                         │
│  ┌─────────────────────────────────────┐                        │
│  │  - Compare actual vs expected        │                        │
│  │  - Pass: Continue to next test       │                        │
│  │  - Fail: Record error                │                        │
│  └──────────────────┬────────────────────┘                        │
│                     │                                             │
│                     ▼                                             │
│  4. Teardown                                                       │
│  ┌─────────────────────────────────────┐                        │
│  │  - Clean up resources                │                        │
│  │  - Reset state                       │                        │
│  │  - Generate report                   │                        │
│  └─────────────────────────────────────┘                        │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## Test Structure

```javascript
// Arrange - Setup
const calculator = new Calculator();

// Act - Execute
const result = calculator.add(2, 3);

// Assert - Verify
expect(result).toBe(5);
```

## TDD Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    TDD Workflow (Red-Green-Refactor)            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Red Phase                                                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Write a failing test                                    │   │
│   │  describe("Calculator", () => {                          │   │
│   │    it("should add two numbers", () => {                  │   │
│   │      expect(add(2, 3)).toBe(5);  // Will fail          │   │
│   │    });                                                   │   │
│   │  });                                                     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                        │                                          │
│                        ▼                                          │
│   Green Phase                                                      │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Write minimal code to pass the test                     │   │
│   │  function add(a, b) {                                    │   │
│   │    return a + b;                                         │   │
│   │  }                                                       │   │
│   └─────────────────────────────────────────────────────────┘   │
│                        │                                          │
│                        ▼                                          │
│   Refactor Phase                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Improve code while keeping tests passing                │   │
│   │  - Remove duplication                                     │   │
│   │  - Improve readability                                    │   │
│   │  - Ensure tests still pass                               │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## BDD Syntax

```javascript
// Gherkin-style (Cucumber, Jest BDD)
describe('User Login', () => {
  scenario('valid credentials', () => {
    given('a user with valid credentials');
    when('they enter username and password');
    then('they should be logged in successfully');
  });
});
```

## CI Pipeline Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                    CI/CD Test Pipeline                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Push → Run Tests → Generate Report → Deploy                    │
│    │         │              │              │                    │
│    │         ▼              ▼              ▼                    │
│    │   ┌──────────┐   ┌───────────┐  ┌──────────┐              │
│    │   │  Jest    │   │ Coverage  │  │  Staging │              │
│    │   │  Mocha   │   │  Report   │  │  Deploy  │              │
│    │   └──────────┘   └───────────┘  └──────────┘              │
│    │                                                       │
│    ▼                                                       │
│   GitHub Actions / GitLab CI / Jenkins                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```