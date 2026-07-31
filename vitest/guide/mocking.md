# Mocking

Mocking ใน Vitest ใช้ `vi` object สำหรับ mocking modules, functions, timers, และ environment

## Mock Functions

สร้าง mock function ด้วย `vi.fn()`:

```typescript
import { vi, expect, test } from 'vitest'

const mockFn = vi.fn()
mockFn('arg1', 'arg2')
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
```

## Spy On Functions

Spy บน object methods ด้วย `vi.spyOn()`:

```typescript
import { vi, expect, test } from 'vitest'

const obj = { method: () => 'original' }
const spy = vi.spyOn(obj, 'method')
obj.method()
expect(spy).toHaveBeenCalled()
```

## Mock Modules

Mock modules ด้วย `vi.mock()`:

```typescript
import { vi, expect, test } from 'vitest'

vi.mock('./module', () => ({
  default: vi.fn(() => 'mocked'),
}))
```

## Timer Control

ควบคุม timers ด้วย `vi.useFakeTimers()`:

```typescript
import { vi, beforeEach, afterEach, test } from 'vitest'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.restoreAllMocks()
})

test('timer test', () => {
  vi.advanceTimersByTime(1000)
})
```

## Environment Mocking

Mock environment variables ด้วย `vi.stubEnv()`:

```typescript
import { vi, test } from 'vitest'

vi.stubEnv('API_KEY', 'test-key')
expect(process.env.API_KEY).toBe('test-key')
vi.unstubAllEnvs()
```

## Best Practices

- เรียก `vi.restoreAllMocks()` ใน `afterEach()` เพื่อ avoid test pollution
- ใช้ `vi.spyOn()` เมื่อต้องการ observe behavior
- ใช้ `vi.fn()` เมื่อต้องการ create new mock
- ใช้ `vi.mock()` สำหรับ module-level mocking
