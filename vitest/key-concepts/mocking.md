# Mocking

## Purpose

อธิบายการ Mocking ใน Vitest

## Scope

- Mock Functions
- Mock Return Values
- Mock Implementations
- Mock Modules
- Spies
- Cleanup

## Mock Functions

`vi.fn()` สร้าง mock function สำหรับ tracking calls

```typescript
const mockFn = vi.fn()

mockFn('arg1', 'arg2')
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
expect(mockFn).toHaveBeenCalledTimes(1)
```

## Mock Return Values

```typescript
mockFn.mockReturnValue(42)
mockFn.mockResolvedValue('async result')
mockFn.mockRejectedValue(new Error('error'))
```

## Mock Implementations

```typescript
mockFn.mockImplementation((a, b) => a + b)
mockFn.mockImplementationOnce(() => 'first call')
mockFn.mockImplementationOnce(() => 'second call')
```

## Mock Modules

```typescript
// Mock entire module
vi.mock('./api', () => ({
  fetchData: vi.fn(() => Promise.resolve('mocked'))
}))

// Mock with partial implementation
vi.mock('./api', () => ({
  ...vi.importActual('./api'),
  fetchData: vi.fn()
}))
```

## Spies

Spy บน existing functions

```typescript
const obj = { method: () => 'original' }
const spy = vi.spyOn(obj, 'method')
spy.mockReturnValue('mocked')
```

## Cleanup

```typescript
afterEach(() => {
  vi.clearAllMocks()      // Clear mock calls
  vi.resetAllMocks()      // Reset mock implementations
  vi.restoreAllMocks()    // Restore original implementations
})
```
