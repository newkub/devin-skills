---
name: follow-reactive-programming
description: พัฒนาโปรเจกต์ด้วย reactive programming พร้อม streams, observables, operators และ data flow
---

## Goal

พัฒนาโปรเจกต์ด้วย reactive programming เพื่อจัดการ data ที่เปลี่ยนแปลงตามเวลาอย่างมีประสิทธิภาพ

## Scope

Use `follow-reactive-programming` for the specific tasks and workflows it covers

## Execute

### 1. Use Streams
> Goal: Use Streams

ใช้ streams สำหรับ data flow ที่ต่อเนื่อง

1. สร้าง streams สำหรับ data sources: events, API responses, user inputs
2. กำหนด lifecycle ของ stream: values, errors, completion
3. ใช้ scheduled streams สำหรับ intervals ที่ควบคุมได้
4. จัดการ subscriptions และ unsubscriptions อย่างถูกต้อง
5. ใช้ hot vs cold streams ตาม use case

### 2. Use Observables
> Goal: Use Observables

ใช้ observables สำหรับ reacting ต่อ data changes

1. สร้าง observables จาก streams หรือ data sources
2. ใช้ lazy evaluation - observable ไม่ทำงานจนกว่าจะ subscribe
3. จัดการ cancellations เมื่อไม่ต้องการ updates อีกต่อไป
4. ใช้ multiple observers สำหรับ single observable
5. จัดการ cleanup เมื่อ unsubscribe

### 3. Use Operators
> Goal: Use Operators

ใช้ operators สำหรับ transform และ combine streams

1. ใช้ map สำหรับ transform values
2. ใช้ filter สำหรับ conditional emissions
3. ใช้ reduce สำหรับ aggregate values
4. ใช้ combineLatest/merge สำหรับ multiple streams
5. ใช้ debounce/throttle สำหรับ rate limiting
6. ใช้ catchError สำหรับ error handling

### 4. Manage State
> Goal: Manage State

จัดการ state ด้วย reactive approach

1. ใช้ subjects สำหรับ multicasting
2. ใช behavior subjects สำหรับ current value
3. ใช replay subjects สำหรับ cache values
4. ใช state management libraries สำหรับ complex state
5. แยก state จาก UI updates

### 5. Handle Side Effects
> Goal: Handle Side Effects

จัดการ side effects ใน reactive context

1. ใช tap สำหรับ side effects ที่ไม่ modify stream
2. ใช switchMap สำหรับ cancel previous requests
3. ใช exhaustMap สำหรับ ignore new requests
4. ใช concatMap สำหรับ sequential execution
5. แยก pure logic จาก side effects

### 6. Error Handling
> Goal: Error Handling

จัดการ errors ใน reactive streams

1. ใช catchError สำหรับ recover from errors
2. ใช retry สำหรับ retry failed operations
3. ใช retryWhen สำหรับ conditional retry
4. ใช throwError สำหรับ propagate errors
5. ใช finalize สำหรับ cleanup ทุกกรณี

### 7. Testing
> Goal: Testing

เขียน tests สำหรับ reactive code

1. ใช marble diagrams สำหรับ visual testing
2. Test subscriptions และ unsubscriptions
3. Test error scenarios
4. Test timing ด้วย virtual time schedulers
5. Mock observables สำหรับ isolated testing

## Rules

### Streams

ใช้ streams อย่างถูกต้องสำหรับ data flow

- `streams` emit values, errors, or completion
- Manage `subscriptions` properly
- Use `hot streams` for shared data
- Use `cold streams` for independent data
- Always `unsubscribe` when done

### Observables

ใช้ observables สำหรับ reacting ต่อ data

- `lazy evaluation` - no work until subscribe
- Cancel `subscriptions` when not needed
- Multiple `observers` per observable
- Clean up on `unsubscribe`
- Use appropriate `observable types`

### Operators

ใช้ operators สำหรับ transform streams

- Compose `operators` for complex logic
- Use `map` for transformations
- Use `filter` for conditional emissions
- Use `combineLatest` for dependent streams
- Use `debounce`/`throttle` for performance

### State Management

จัดการ state ด้วย reactive patterns

- Use `subjects` for multicasting
- Use `behavior subjects` for current value
- Separate `state` from UI
- Use `state management` for complex cases
- `Immutable state` updates

### Side Effects

จัดการ side effects อย่างเหมาะสม

- Use `tap` for non-mutating side effects
- Use `switchMap` for cancellation
- Use `exhaustMap` for ignoring
- Use `concatMap` for sequential
- Separate `pure logic` from effects

### Error Handling

จัดการ errors ใน reactive context

- Use `catchError` for recovery
- Use `retry` for transient errors
- Use `finalize` for cleanup
- Propagate `errors` appropriately
- Test error scenarios

### Performance

ปรับปรุง performance ของ reactive code

- Use `debounce`/`throttle` for high-frequency events
- Avoid `memory leaks` with unsubscription
- Use `share` for multicasting
- Use `async scheduler` for heavy operations
- Profile and optimize `hot paths`

## Expected Outcome

- Efficient data flow management
- Responsive applications
- Clean separation of concerns
- Proper error handling
- No memory leaks
- Testable code
- Maintainable reactive patterns
