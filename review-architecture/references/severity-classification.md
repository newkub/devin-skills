# Severity Classification

## Goal

กำหนด severity levels สำหรับ architecture review findings

## Severity Levels

### Critical

- broken architecture
- circular dependency ระหว่าง core modules
- God object/module ที่ทำทุกอย่าง
- Singleton abuse ที่ทำให้ test ไม่ได้
- anti-pattern ใน critical path ที่ก่อน bugs
- global mutable state ใน critical path
- no environment separation ระหว่าง prod กับ non-prod
- no timeout/retries บน critical external call
- no fallback สำหรับ critical dependency
- SPOF โดยไม่มี redundancy
- no governance for critical decisions
- missing security/compliance policy
- no code review requirement
- no CI in critical path

### High

- violated SOLID principle
- tight coupling
- pattern ที่ใช้ผิด intent
- Factory overuse
- Observer ที่ไม่ cleanup
- premature abstraction
- SRP violation ใน module หลัก
- missing dependency inversion
- missing boundaries ระหว่าง layers
- leaky abstraction
- missing retry/timeout/fallback/circuit breaker
- incomplete ownership
- missing coding standards
- single reviewer for critical code

### Medium

- inconsistent pattern
- missing abstraction
- Decorator chain ยาวเกินไป
- Facade ที่ซ่อน complexity มากเกินไป
- pattern ที่ over-engineer
- mixed concerns
- unclear public API
- minor side effect leak
- suboptimal retry/backoff
- policy gaps
- outdated owner
- informal decision process

### Low

- minor pattern improvement
- pattern ที่ simplify ได้
- cosmetic
- documentation gap
- minor naming improvement
