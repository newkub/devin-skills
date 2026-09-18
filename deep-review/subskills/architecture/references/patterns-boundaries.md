# Architecture Patterns And Boundaries Checks

## Goal

ตรวจสอบ architectural patterns, design pattern correctness, anti-patterns, และ boundaries ใน codebase

## Checks

### Architectural Patterns

1. ระบุ architectural patterns ที่ใช้: layered, hexagonal, clean architecture, microservices, monolith
2. ตรวจสอบ dependency directions สอดคล้องกับ architecture
3. ตรวจสอบ SOLID principles: SRP, OCP, LSP, ISP, DIP
4. ตรวจสอบ scalability และ concurrency issues
5. ตรวจสอบ multi-tenancy, queue architecture, routing

### Creational Patterns

1. Singleton abuse ที่ทำให้ test ไม่ได้
2. Factory ที่ไม่จำเป็น หรือ overuse
3. Builder ที่ over-engineer สำหรับ use case ง่าย
4. Prototype ที่ใช้ผิด intent

### Structural Patterns

1. Adapter ที่ไม่จำเป็น
2. Decorator chain ยาวเกินไป
3. Facade ที่ซ่อน complexity มากเกินไป
4. Proxy ที่ใช้ผิด intent
5. Composite ที่ over-engineer

### Behavioral Patterns

1. Strategy ที่ไม่มี shared interface
2. Observer ที่ไม่ cleanup ทำให้ memory leak
3. Command ที่ไม่ support undo
4. Iterator ที่ใช้ผิด intent
5. State ที่ over-engineer สำหรับ use case ง่าย

### Functional Patterns

1. composition over inheritance ที่ควรใช้แทน OOP patterns
2. pure functions ที่ควรแยกจาก impure
3. immutability ที่ควรใช้แทน mutable state

### Anti-Patterns

1. God object ที่ทำทุกอย่าง
2. singleton abuse
3. factory overuse
4. callback hell
5. premature abstraction
6. magic numbers ใน pattern logic

### Pattern Appropriateness

1. pattern ที่ over-engineer สำหรับ use case ง่าย
2. pattern ที่ under-engineer สำหรับ use case ซับซ้อน
3. pattern ที่ใช้ผิด intent

## Severity

- Critical: broken architecture, circular dependency ระหว่าง modules, God object ใน critical path, anti-pattern ที่ก่อน bugs
- High: violated SOLID principle, tight coupling, pattern ที่ใช้ผิด intent, Factory overuse, Observer ที่ไม่ cleanup
- Medium: inconsistent pattern, missing abstraction, Decorator chain ยาวเกินไป, Facade ที่ซ่อน complexity
- Low: minor pattern improvement, pattern ที่ simplify ได้
