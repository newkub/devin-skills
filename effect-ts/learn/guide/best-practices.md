# Best Practices

## Type Annotations

กำหนด type ชัดเจนเสมอเพื่อให้ IDE และ compiler ช่วยได้ดีขึ้น:

```typescript
// ถูกต้อง - มี type annotation
const program: Effect.Effect<string, Error, Logger> = Effect.gen(function* () {
  yield* Effect.service(Logger);
  return 'Hello';
});

// ไม่แนะนำ - implicit any
const program2 = Effect.gen(function* () {
  return 'Hello';
});
```

## Error Handling

ใช้ `Effect.gen` แทน callback hell:

```typescript
// ถูกต้อง
const program = Effect.gen(function* () {
  const user = yield* fetchUser(id);
  const profile = yield* fetchProfile(user.profileId);
  return profile;
});

// ไม่แนะนำ - nested callbacks
const program2 = fetchUser(id).pipe(
  Effect.flatMap(user => fetchProfile(user.profileId))
);
```

## Layer Composition

compose layers ให้เป็นระเบียบ:

```typescript
// แยก layer ตาม concern
const databaseLayer = Layer.effect(Database, createDatabase);
const loggerLayer = Layer.effect(Logger, createLogger);

// รวม layer
const appLayer = Layer.merge(databaseLayer, loggerLayer).pipe(
  Layer.provide(someOtherLayer)
);
```

## Testing

ใช้ layer สำหรับ testing:

```typescript
// Mock layer สำหรับ testing
const mockLogger = Layer.succeed(Logger, {
  log: (msg) => Effect.sync(() => console.log(`[TEST] ${msg}`))
});

// Run test with mock
Effect.runPromise(program.pipe(Effect.provide(mockLogger)));
```

## Performance Tips

| Practice | Description |
|----------|-------------|
| Use `Effect.gen` | เขียน async code ได้เหมือน sync |
| Avoid nested effects | Flatten nested effects ให้เร็ว |
| Use `Effect.parallel` | Run independent effects พร้อมกัน |
| Lazy evaluation | Effects ไม่ execute จนกว่าจะ run |
