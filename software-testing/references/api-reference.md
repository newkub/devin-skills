# API Reference

## Jest API

### Global Functions

| Function | Description |
|----------|-------------|
| `describe(name, fn)` | Group related tests |
| `test(name, fn)` | Define a test case |
| `it(name, fn)` | Alias for test |
| `beforeAll(fn)` | Run once before all tests |
| `afterAll(fn)` | Run once after all tests |
| `beforeEach(fn)` | Run before each test |
| `afterEach(fn)` | Run after each test |

### Expect Matchers

| Matcher | Description |
|---------|-------------|
| `toBe(value)` | Strict equality |
| `toEqual(value)` | Deep equality |
| `toMatch(regexp)` | Regex match |
| `toContain(item)` | Array contains |
| `toThrow(error)` | Throws error |
| `resolves` | Promise resolution |
| `rejects` | Promise rejection |

### Mock Functions

| Method | Description |
|--------|-------------|
| `jest.fn()` | Create mock function |
| `mockReturnValue(value)` | Set return value |
| `mockResolvedValue(value)` | Set resolved value |
| `mockRejectedValue(error)` | Set rejected value |
| `mockImplementation(fn)` | Set implementation |
| `mockClear()` | Clear mock data |

## Vitest API

### Global Functions

| Function | Description |
|----------|-------------|
| `describe(name, fn)` | Group related tests |
| `test(name, fn)` | Define a test case |
| `it(name, fn)` | Alias for test |
| `beforeAll(fn)` | Run once before all tests |
| `afterAll(fn)` | Run once after all tests |
| `beforeEach(fn)` | Run before each test |
| `afterEach(fn)` | Run after each test |

### Expect Matchers

| Matcher | Description |
|---------|-------------|
| `toBe(value)` | Strict equality |
| `toEqual(value)` | Deep equality |
| `toMatch(regexp)` | Regex match |
| `toContain(item)` | Array contains |
| `toThrow(error)` | Throws error |
| `resolves` | Promise resolution |
| `rejects` | Promise rejection |

### Mock Functions (vi)

| Method | Description |
|--------|-------------|
| `vi.fn()` | Create mock function |
| `vi.mock(path)` | Mock module |
| `vi.unmock(path)` | Unmock module |
| `vi.useFakeTimers()` | Use fake timers |
| `vi.useRealTimers()` | Use real timers |

## Pytest API

### Fixtures

| Decorator | Description |
|-----------|-------------|
| `@pytest.fixture` | Define fixture |
| `@pytest.fixture(scope='function')` | Function-scoped fixture |
| `@pytest.fixture(scope='session')` | Session-scoped fixture |
| `@pytest.fixture(autouse=True)` | Auto-use fixture |

### Assertions

| Assertion | Description |
|-----------|-------------|
| `assert value == expected` | Equality |
| `assert value != expected` | Inequality |
| `assert value in list` | Membership |
| `assert value is None` | None check |
| `assert raises(Error)` | Exception raised |

### Markers

| Marker | Description |
|--------|-------------|
| `@pytest.mark.slow` | Mark as slow |
| `@pytest.mark.skip` | Skip test |
| `@pytest.mark.skipif(condition)` | Conditional skip |
| `@pytest.mark.xfail` | Expected failure |
| `@pytest.mark.parametrize` | Parameterize test |

## Testing Library API

### Queries

| Query | Description |
|-------|-------------|
| `getByText(text)` | Find by text |
| `getByRole(role)` | Find by ARIA role |
| `getByLabelText(text)` | Find by label |
| `getByPlaceholderText(text)` | Find by placeholder |
| `getByAltText(text)` | Find by alt text |
| `getByTestId(id)` | Find by test ID |

### Actions

| Action | Description |
|--------|-------------|
| `fireEvent.click(element)` | Click element |
| `fireEvent.change(element, value)` | Change input |
| `fireEvent.submit(form)` | Submit form |
| `userEvent.click(element)` | Real user interaction |
| `userEvent.type(element, text)` | Type text |

## Coverage Tools

### Istanbul (Jest)

| Option | Description |
|--------|-------------|
| `collectCoverage` | Enable coverage |
| `coverageDirectory` | Output directory |
| `coverageReporters` | Report formats |
| `coverageThreshold` | Minimum coverage |

### Coverage.py (Pytest)

| Option | Description |
|--------|-------------|
| `--cov=package` | Package to cover |
| `--cov-report=html` | HTML report |
| `--cov-report=term` | Terminal report |
| `--fail-under=80` | Minimum coverage |
