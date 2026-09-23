# Concurrency Review

## Goal
พัฒนาโปรเจกต์ด้วย concurrent programming เพื่อเพิ่ม performance และ responsiveness
## Scope
ใช้สำหรับ review concurrent programming ใน application code
## Execute
### 1. Use Async Await
> Goal: ใช้ async/await สำหรับ asynchronous operations แทน callback chains
ใช้ async/await สำหรับ asynchronous operations
1. ใช้ async/await patterns แทน callback chains
2. ใช้ error handling mechanisms สำหรับ error handling
3. ใช้ parallel execution mechanisms สำหรับ parallel execution
4. ใช้ race condition mechanisms สำหรับ race conditions
5. ใช้ multiple result mechanisms สำหรับ multiple results
### 2. Parallel Execution
> Goal: ทำงานหลายอย่างพร้อมกันเพื่อเพิ่ม throughput ของ CPU-intensive tasks
ทำงานหลายอย่างพร้อมกัน
1. ใช้ parallel execution mechanisms สำหรับ independent tasks
2. ใช้ worker mechanisms สำหรับ CPU-intensive tasks
3. ใช้ browser workers สำหรับ browser environments
4. ใช้ thread mechanisms สำหรับ server environments
5. ใช้ parallel processing libraries
### 3. Error Handling
> Goal: จัดการ errors ใน concurrent code อย่าง systematic และ propagate ถูกต้อง
จัดการ errors ใน concurrent code
1. ใช้ error handling mechanisms กับ async/await
2. ใช้ error handling mechanisms สำหรับ async operations
3. ใช้ multiple error mechanisms สำหรับ multiple errors
4. Propagate errors อย่างถูกต้อง
5. Log errors ด้วย context
### 4. Resource Management
> Goal: จัดการ resources อย่างมีประสิทธิภาพและปลอดภัยจาก leaks
จัดการ resources อย่างเหมาะสม
1. ใช้ connection pooling
2. ใช้ rate limiting
3. ใช้ backpressure
4. จัดการ timeouts
5. Cleanup resources อย่างถูกต้อง
### 5. Synchronization
> Goal: ซิงโครไนซ์ shared state อย่างปลอดภัยจาก race conditions
ซิงโครไนซ์ shared state อย่างปลอดภัย
1. ใช้ atomic operations เมื่อเป็นไปได้
2. ใช้ locks หรือ mutexes เมื่อจำเป็น
3. ใช้ channels สำหรับ communication
4. หลีกเลี่ยง race conditions
5. ใช้ immutable state
### 6. Performance
> Goal: ปรับปรุง performance ของ concurrent code โดยลด contention และ bottleneck
ปรับปรุง performance ของ concurrent code
1. Profile concurrent operations
2. Optimize critical sections
3. ลด lock contention
4. ใช้ efficient data structures
5. Benchmark และ tune
### 7. Testing
> Goal: ทดสอบ concurrent code ให้ครอบคลุม race conditions และ deadlock scenarios
ทดสอบ concurrent code
1. Test race conditions
2. Test deadlock scenarios
3. Test error handling
4. Test performance under load
5. Use concurrency testing tools
## Rules
### 1. Async Await
ใช้ async/await อย่างถูกต้อง
- ใช้ `async/await` patterns แทน callback chains
- ใช้ `error handling mechanisms` สำหรับ error handling
- ใช้ `parallel execution mechanisms` สำหรับ parallel execution
- ใช้ `race condition mechanisms` สำหรับ race conditions
- ใช้ `multiple result mechanisms` สำหรับ multiple results
### 2. Parallel Execution
ทำงานหลายอย่างพร้อมกันอย่างเหมาะสม
- ใช้ `parallel execution mechanisms` สำหรับ independent tasks
- ใช้ `worker mechanisms` สำหรับ CPU-intensive tasks
- ใช้ `browser workers` สำหรับ browser environments
- ใช้ `thread mechanisms` สำหรับ server environments
- ใช้ `parallel processing libraries`
### 3. Error Handling
จัดการ errors อย่าง systematic
- ใช้ `error handling mechanisms` กับ async/await
- ใช้ `error handling mechanisms` สำหรับ async operations
- ใช้ `multiple error mechanisms` สำหรับ multiple errors
- Propagate `errors` ถูกต้อง
- Log `errors` ด้วย context
### 4. Resource Management
จัดการ resources อย่างเหมาะสม
- ใช้ `connection pooling`
- ใช้ `rate limiting`
- ใช้ `backpressure`
- จัดการ `timeouts`
- Cleanup `resources` ถูกต้อง
### 5. Synchronization
ซิงโครไนซ์ shared state อย่างปลอดภัย
- ใช้ `atomic operations`
- ใช้ `locks` หรือ `mutexes` เมื่อจำเป็น
- ใช้ `channels` สำหรับ communication
- หลีกเลี่ยง `race conditions`
- ใช้ `immutable state`
### 6. Performance
ปรับปรุง performance
- Profile `concurrent operations`
- Optimize `critical sections`
- ลด `lock contention`
- ใช้ `efficient data structures`
- Benchmark และ tune
### 7. Testing
ทดสอบ concurrent code
- Test `race conditions`
- Test `deadlock scenarios`
- Test `error handling`
- Test `performance` under load
- Use `concurrency testing tools`
## Expected Outcome
- Async operations ที่ manage ได้ง่าย
- Parallel execution ที่ efficient
- Error handling ที่ systematic
- Resource management ที่เหมาะสม
- Synchronization ที่ปลอดภัย
- Performance ที่ดีขึ้น
- Tests ที่ครอบคลุม