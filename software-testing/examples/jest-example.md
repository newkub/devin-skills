# Jest Examples

## Basic Test

```javascript
// math.test.js
describe('Math operations', () => {
  test('adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('subtracts two numbers', () => {
    expect(subtract(5, 3)).toBe(2);
  });
});
```

## Async Testing

```javascript
// async.test.js
describe('Async operations', () => {
  test('resolves with data', async () => {
    const data = await fetchData();
    expect(data).toBeDefined();
  });

  test('rejects with error', async () => {
    await expect(fetchData()).rejects.toThrow('Network error');
  });

  test('using callbacks', (done) => {
    fetchDataCallback((err, data) => {
      expect(err).toBeNull();
      expect(data).toBeDefined();
      done();
    });
  });
});
```

## Mocking

```javascript
// api.test.js
import { getUser } from './api';

jest.mock('./api');

describe('User API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetches user data', async () => {
    getUser.mockResolvedValue({ id: 1, name: 'John' });
    const user = await getUser(1);
    expect(user.name).toBe('John');
  });

  test('handles error', async () => {
    getUser.mockRejectedValue(new Error('Not found'));
    await expect(getUser(999)).rejects.toThrow('Not found');
  });
});
```

## React Testing

```javascript
// Button.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  test('renders button text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick handler', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Snapshot Testing

```javascript
// Component.test.js
import { render } from '@testing-library/react';
import { UserProfile } from './UserProfile';

test('matches snapshot', () => {
  const { container } = render(<UserProfile name="John" />);
  expect(container.firstChild).toMatchSnapshot();
});
```

## Coverage

```bash
# Run with coverage
bun test -- --coverage

# Generate HTML report
bun test -- --coverage --coverageReporters=html
```
