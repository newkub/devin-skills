# Matchers

## Purpose

อธิบาย Matchers สำหรับ assertions ใน Vitest

## Scope

- Common Matchers
- Custom Matchers
- Async Matchers

## Matchers

`expect(value).matcher()` ใช้สำหรับตรวจสอบค่า

## Common Matchers

### Equality

```typescript
expect(value).toBe(3)              // Strict equality
expect(value).toEqual({ a: 1 })    // Deep equality
expect(value).toStrictEqual({})    // Strict deep equality
```

### Truthiness

```typescript
expect(value).toBeTruthy()         // Not null/undefined/false/0
expect(value).toBeFalsy()          // null/undefined/false/0
expect(value).toBeDefined()        // Not undefined
expect(value).toBeNull()           // null
expect(value).toBeUndefined()      // undefined
```

### Numbers

```typescript
expect(value).toBeGreaterThan(5)
expect(value).toBeGreaterThanOrEqual(5)
expect(value).toBeLessThan(10)
expect(value).toBeLessThanOrEqual(10)
expect(value).toBeCloseTo(0.3, 2)  // Floating point
```

### Strings

```typescript
expect(str).toContain('hello')
expect(str).toMatch(/regex/)
expect(str).toHaveLength(5)
```

### Arrays

```typescript
expect(arr).toHaveLength(3)
expect(arr).toContain(item)
expect(arr).toEqual([1, 2, 3])
expect(arr).toBeInstanceOf(Array)
```

### Objects

```typescript
expect(obj).toHaveProperty('key')
expect(obj).toHaveProperty('key', 'value')
expect(obj).toMatchObject({ a: 1 })
expect(obj).toStrictEqual({ a: 1 })
```

### Exceptions

```typescript
expect(() => fn()).toThrow()
expect(() => fn()).toThrow('error message')
expect(() => fn()).toThrow(Error)
```

### Async

```typescript
await expect(promise).resolves.toBe('value')
await expect(promise).rejects.toThrow('error')
```

## Custom Matchers

```typescript
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling
    return {
      pass,
      message: () => pass
        ? `expected ${received} not to be within range ${floor}-${ceiling}`
        : `expected ${received} to be within range ${floor}-${ceiling}`
    }
  }
})

expect(10).toBeWithinRange(5, 15)
```
