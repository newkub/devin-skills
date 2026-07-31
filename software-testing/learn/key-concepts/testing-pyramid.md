# Key Concepts

## Testing Pyramid

```
┌─────────────────────────────────────────────────────────────────┐
│                      Testing Pyramid                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                        ┌─────────┐                               │
│                        │   E2E   │  ← Few tests, expensive       │
│                       ─┴─────────┴─                              │
│                      ┌───────────┐                               │
│                      │ Integration│ ← Medium tests              │
│                     ─┴───────────┴─                              │
│                    ┌────────────────┐                            │
│                    │      Unit      │ ← Many tests, fast         │
│                   ─┴────────────────┴─                           │
│                                                                   │
│   Most tests should be unit tests at the bottom                  │
│   Fewer E2E tests at the top                                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Test Types

### Unit Testing

```text
Purpose: Test individual functions/methods
Scope: Single function or class
Dependencies: Mocked
Speed: Fast (thousands per second)
Coverage: High

Example:
┌─────────────────────────────────────────┐
│  function add(a, b) {                   │
│    return a + b;                        │
│  }                                      │
│  ┌───────────────────────────────────┐ │
│  │ Test: add(2, 3) === 5             │ │
│  │ Test: add(-1, 1) === 0            │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Integration Testing

```text
Purpose: Test component interactions
Scope: Multiple components
Dependencies: Real or mocked
Speed: Medium
Coverage: Medium

Example:
┌─────────────────────────────────────────┐
│  Database ──► Repository ──► Service   │
│       ↓              ↓           ↓      │
│    Real DB        Real        Mocked   │
│                                         │
│  Test the flow between layers          │
└─────────────────────────────────────────┘
```

### System Testing

```text
Purpose: Test complete system
Scope: Entire application
Dependencies: Real
Speed: Slow
Coverage: Low

Example:
┌─────────────────────────────────────────┐
│  User → API → Service → Database        │
│            ↓                             │
│         Verify entire flow              │
└─────────────────────────────────────────┘
```

## Test Frameworks

| Language | Framework | Use Case |
|----------|-----------|----------|
| **JavaScript** | Jest, Mocha, Vitest | JS/TS unit testing |
| **Python** | pytest, unittest | Python unit testing |
| **Rust** | #[test], cargo test | Rust unit testing |
| **Java** | JUnit, TestNG | Java unit testing |
| **Go** | testing, testify | Go unit testing |

## Key Terms

| Term | คำอธิบาย |
|------|----------|
| **Test Case** | Single scenario being tested |
| **Test Suite** | Collection of test cases |
| **Mock** | Simulated object/function |
| **Fixture** | Setup code for tests |
| **Assertion** | Check expected vs actual |
| **Coverage** | % of code tested |