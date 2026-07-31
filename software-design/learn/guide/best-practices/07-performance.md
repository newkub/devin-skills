# Performance

## 17. Consider Performance Early

Consider performance implications ใน design phase:

```typescript
// ✅ Good: Consider performance
// Use async for I/O operations
public async Promise<User> GetUserAsync(string id) {
  return await _repository.GetByIdAsync(id);
}

// ❌ Bad: Blocking I/O
public User GetUser(string id) {
  return _repository.GetById(id).Result;
}
```

## 18. Profile Before Optimizing

Measure ก่อน optimize:

```typescript
// ✅ Good: Profile first
const stopwatch = Stopwatch.StartNew();
const result = expensiveOperation();
stopwatch.Stop();
Console.WriteLine($"Time: {stopwatch.ElapsedMilliseconds}ms");

// Only optimize if necessary
if (stopwatch.ElapsedMilliseconds > 100) {
  // Apply optimization
}
```
