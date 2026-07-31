# Vitest Examples

## Basic Test

```typescript
// math.test.ts
import { describe, it, expect } from 'vitest';
import { add, subtract } from './math';

describe('Math operations', () => {
  it('adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('subtracts two numbers', () => {
    expect(subtract(5, 3)).toBe(2);
  });
});
```

## Async Testing

```typescript
// async.test.ts
import { describe, it, expect } from 'vitest';
import { fetchData } from './api';

describe('Async operations', () => {
  it('resolves with data', async () => {
    const data = await fetchData();
    expect(data).toBeDefined();
  });

  it('rejects with error', async () => {
    await expect(fetchData()).rejects.toThrow('Network error');
  });
});
```

## Mocking

```typescript
// api.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUser } from './api';

vi.mock('./api');

describe('User API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches user data', async () => {
    vi.mocked(getUser).mockResolvedValue({ id: 1, name: 'John' });
    const user = await getUser(1);
    expect(user.name).toBe('John');
  });

  it('handles error', async () => {
    vi.mocked(getUser).mockRejectedValue(new Error('Not found'));
    await expect(getUser(999)).rejects.toThrow('Not found');
  });
});
```

## Vue Testing

```typescript
// Button.test.ts
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { Button } from './Button.vue';

describe('Button', () => {
  it('renders button text', () => {
    const { getByText } = render(Button, { slots: { default: 'Click me' } });
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('emits click event', async () => {
    const { getByText, emitted } = render(Button, { 
      slots: { default: 'Click me' } 
    });
    
    await getByText('Click me').click();
    expect(emitted()).toHaveProperty('click');
  });
});
```

## Snapshot Testing

```typescript
// Component.test.ts
import { render } from '@testing-library/vue';
import { UserProfile } from './UserProfile.vue';

test('matches snapshot', () => {
  const { container } = render(UserProfile, { props: { name: 'John' } });
  expect(container.firstChild).toMatchSnapshot();
});
```

## Watch Mode

```bash
# Run in watch mode
npx vitest

# Run with UI
npx vitest --ui
```
