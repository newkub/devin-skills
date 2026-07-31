# Best Practices

## Test Design Principles

### AAA Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                    Test Structure (AAA)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Arrange                                                   │
│  ┌─────────────────────────────────┐                          │
│  │  Setup test data and conditions │                          │
│  └─────────────────────────────────┘                          │
│                      ↓                                        │
│  2. Act                                                        │
│  ┌─────────────────────────────────┐                          │
│  │  Execute the code under test    │                          │
│  └─────────────────────────────────┘                          │
│                      ↓                                        │
│  3. Assert                                                     │
│  ┌─────────────────────────────────┐                          │
│  │  Verify the expected outcome   │                          │
│  └─────────────────────────────────┘                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Test Naming Convention

| Pattern | Format | Example |
|---------|--------|---------|
| **Behavior** | `[subject] [action] [expected]` | `User_updateEmail_shouldFailForInvalidEmail` |
| **Given-When-Then** | `given_[context]_when_[action]_then_[result]` | `given_loggedInUser_when_logout_then_redirectToHome` |
| **Should** | `[subject] should [expected]` | `sum should add two numbers` |

## Best Practices Table

| Practice | Description | Benefit |
|----------|-------------|---------|
| **One assertion per test** | Single responsibility per test | Clear failure messages |
| **Descriptive names** | Test names describe behavior | Self-documenting code |
| **Independent tests** | No shared state between tests | Parallel execution |
| **Fast tests first** | Unit tests before integration | Quick feedback |
| **Mock external services** | Use mocks for APIs/DB | Reliable, fast tests |
| **Test edge cases** | Boundary values, empty inputs | Better coverage |

## What to Test

### Test Pyramid

```
         ┌─────────────┐
         │     E2E     │  Few, slow, expensive
         │   ┌─────┐    │
         │   │ Int │    │  Some, moderate
         │   │┌───┐│    │
         │   ││Uni││    │  Many, fast, cheap
         │   │└───┘│    │
         │   └─────┘    │
         └─────────────┘
```

### What to Test

| Type | Test | Why |
|------|------|-----|
| ✅ | Unit tests | Fast, reliable, isolated |
| ✅ | Happy path | Core functionality works |
| ✅ | Edge cases | Boundary conditions |
| ✅ | Error handling | Invalid inputs handled |
| ❌ | Third-party code | Already tested |
| ❌ | Trivial code | Getters/setters |
| ❌ | Implementation details | Fragile, refactor breaks |

## Common Mistakes

| Mistake | Problem | Solution |
|---------|---------|----------|
| **Assertions in setup** | Hidden logic | Move to test body |
| **Sleep for async** | Flaky, slow | Use proper waits |
| **Test pollution** | State leaks | Clean up in afterEach |
| **Long tests** | Hard to debug | Split into smaller tests |
| **Comments in tests** | Redundant | Let names speak |