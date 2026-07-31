# Testing

## Testing Drizzle Apps

### Unit Testing

```typescript
import { describe, it, expect } from 'vitest';
import { db } from './db';

describe('Database', () => {
  it('should insert user', async () => {
    const user = await db.insert(users).values({
      name: 'Test',
      email: 'test@example.com',
    }).returning();
    expect(user).toBeDefined();
  });
});
```

### Integration Testing

- Test database operations
- Test migrations
- Test queries

### Mocking

- Mock database สำหรับ unit tests
- Use in-memory databases สำหรับ testing
