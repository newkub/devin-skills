# Features

## Testing Levels

| Level | Scope | Speed | Count | Tools |
|-------|-------|-------|-------|-------|
| **Unit** | Function | Fast | Many | Jest, pytest, JUnit |
| **Integration** | Components | Medium | Some | Supertest, TestContainers |
| **System** | Full app | Slow | Few | Cypress, Playwright |
| **E2E** | User flows | Slowest | Few | Selenium, Playwright |

## Testing Types

### Functional Testing

| Type | Description |
|------|-------------|
| **Smoke Testing** | Quick sanity checks |
| **Sanity Testing** | Test specific feature |
| **Regression Testing** | Ensure no breakage |
| **Boundary Testing** | Test edge cases |

### Non-Functional Testing

| Type | Description |
|------|-------------|
| **Performance** | Load, stress testing |
| **Security** | Penetration testing |
| **Accessibility** | a11y compliance |
| **Compatibility** | Cross-browser testing |

## Test Frameworks Features

### Jest (JavaScript)

```javascript
// Matchers
expect(value).toBe(expected);
expect(value).toEqual(expected);
expect(arr).toContain(item);
expect(fn).toThrow();

// Async
test('async test', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});
```

### Pytest (Python)

```python
# Fixtures
@pytest.fixture
def database():
    db = Database()
    yield db
    db.close()

# Parametrize
@pytest.mark.parametrize("input,expected", [
    (2, 4),
    (3, 9),
])
def test_square(input, expected):
    assert square(input) == expected

# Markers
@pytest.mark.slow
def test_heavy_operation():
    pass
```

### JUnit (Java)

```java
@BeforeEach
void setup() {
    calculator = new Calculator();
}

@Test
void testAddition() {
    assertEquals(5, calculator.add(2, 3));
}

@Test
@Disabled("Bug #123")
void testDisabled() {}
```

## Assertion Libraries

| Library | Language | Features |
|---------|----------|----------|
| **Chai** | JavaScript | BDD/TDD styles |
| **Should.js** | JavaScript | Chainable |
| **Assert** | Python | Built-in |
| **Hamcrest** | Java | Matchers |
| **Testify** | Go | Assertions |

## Mocking Features

| Feature | Description |
|---------|-------------|
| **Stub** | Predefined responses |
| **Spy** | Record calls |
| **Mock** | Verify interactions |
| **Fake** | Working implementation |
| **FakeAsync** | Time manipulation |

## Coverage Tools

| Tool | Language | Metric |
|------|----------|--------|
| **Istanbul** | JavaScript | Line/Branch |
| **Coverage.py** | Python | Line/Branch |
| **JaCoCo** | Java | Line/Branch |
| **Tarpaulin** | Rust | Line |