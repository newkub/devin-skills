# Integration

## Integration Testing Patterns

### Database Integration

```javascript
// test setup with database
describe('UserRepository', () => {
  let db;

  beforeAll(async () => {
    db = await setupTestDatabase();
  });

  afterAll(async () => {
    await db.cleanup();
  });

  it('should create user in database', async () => {
    const user = await UserRepository.create({
      name: 'John',
      email: 'john@example.com',
    });

    const found = await UserRepository.findById(user.id);
    expect(found.name).toBe('John');
  });
});
```

### API Integration Testing

```javascript
// Mock external API
import { describe, it, expect, vi } from 'vitest';
import { fetchUserData } from './api';

vi.mock('./externalService', () => ({
  getUser: vi.fn(),
}));

describe('fetchUserData', () => {
  it('should fetch and transform user data', async () => {
    const mockUser = { id: 1, name: 'John' };
    getUser.mockResolvedValue(mockUser);

    const result = await fetchUserData(1);

    expect(result).toEqual({
      id: 1,
      displayName: 'John',
    });
  });
});
```

### Component Integration

```javascript
// Test components together
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from './LoginForm';
import { AuthProvider } from './AuthContext';

describe('LoginForm Integration', () => {
  it('should login and redirect', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Welcome!')).toBeInTheDocument();
  });
});
```

## CI/CD Integration

| CI System | Test Command | Configuration |
|-----------|--------------|---------------|
| **GitHub Actions** | `bun test` | `.github/workflows/test.yml` |
| **GitLab CI** | `pytest` | `.gitlab-ci.yml` |
| **Jenkins** | `mvn test` | `Jenkinsfile` |
| **CircleCI** | `bun test` | `.circleci/config.yml` |

## Pre-commit Hooks

```bash
# .husky/pre-commit
bun test
bun run lint
```