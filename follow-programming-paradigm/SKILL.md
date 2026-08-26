---
name: follow-programming-paradigm
description: เลือกใช้ programming paradigm ทีเหมาะสมกับปัญหา
---

## Goal

เลือกใช้ programming paradigm ทีเหมาะสมกับปัญหาและ ecosystem เพื่อเขียน code ทีชัดเจน maintain ได้

## Scope

ใช้สำหรับเลือก paradigm หลักของ module, feature หรือทังโปรเจกต์: declarative, dynamic programming, functional, imperative, object-oriented, reactive

## Execute

### 1. Choose Paradigm

> Goal: เลือก paradigm ทีเหมาะสมกับปัญหา

1. ระบุลักษณะของปัญหา: data transformation, algorithm, state machine, UI, stream, class model
2. พิจารณา ecosystem, team familiarity และ performance constraints
3. เลือก paradigm หลัก อนุญาตให้ผสมได้เมื่อเหมาะสม
4. กำหนดขอบเขตทีใช้ paradigm แต่ละแบบอย่างชัดเจน

### 2. Apply Declarative

> Goal: เขียน code ทีบอกว่าอะไรต้องทำ ไม่ใช่วิธีทำ

1. ใช้ collection operations แทน loops
2. ใช้ declarative APIs เมื่อเป็นไปได้
3. ใช้ configuration แทน logic
4. ใช้ data structures ที express intent
5. หลีกเลี่ยง manual state management
6. ใช้ immutability และ composition สำหรับ data transformation

### 3. Apply Dynamic Programming

> Goal: แก้ปัญหาทีซับซ้อนด้วย DP

1. ระบุ overlapping subproblems และ optimal substructure
2. กำหนด base cases, state variables และ transition function
3. เลือก top-down memoization หรือ bottom-up tabulation
4. ใช้ cache หรือ table ทีเหมาะสม
5. optimize space เมื่อเป็นไปได้
6. ทดสอบ edge cases, base cases และ large inputs

### 4. Apply Functional

> Goal: พัฒนาด้วย functional principles

1. เขียน pure functions สำหรับ business logic
2. แยก functional core จาก imperative shell
3. ใช้ immutability: `const`, `Readonly`, spread, array methods ทีไม่ mutate
4. ใช้ function composition และ higher-order functions
5. จัดการ errors ด้วย `Result/Either` และ `Option/Maybe`
6. test pure functions ด้วย input/output

### 5. Apply Imperative

> Goal: ควบคุม flow ของโปรแกรมอย่างชัดเจน

1. ใช้ control structures อย่างเหมาะสม
2. เขียน code แบบ sequential ด้วย block scope
3. ใช้ early returns และ guard clauses
4. หลีกเลี่ยง nested conditions ลึกเกินไป
5. จัดการ mutable state ใน scope ทีจำเป็น
6. ใช้ error handling mechanisms และ cleanup อย่างระมัดระวัง

### 6. Apply Object-Oriented

> Goal: ออกแบบด้วย OOP principles

1. ใช้ encapsulation: private fields, getters/setters
2. ใช้ interfaces/abstract classes สำหรับ contracts
3. ใช้ polymorphism ด้วย generics, interfaces, decorators
4. ออกแบบ class ทีมี single responsibility
5. ใช้ composition แทน deep inheritance
6. test public interfaces ด้วย dependency injection

### 7. Apply Reactive

> Goal: จัดการ data flow ทีเปลี่ยนแปลงตามเวลา

1. สร้าง streams สำหรับ events, API responses, user inputs
2. ใช้ observables ด้วย lazy evaluation และ proper subscription/unsubscription
3. ใช้ operators `map`, `filter`, `reduce`, `combineLatest`, `debounce`, `throttle`
4. จัดการ state ด้วย subjects หรือ state management library
5. แยก pure logic จาก side effects
6. จัดการ errors ด้วย `catchError`, `retry`, `finalize`

### 8. Validate

> Goal: ยืนยันว่า code สอดคล้องกับ paradigm ทีเลือก

1. ทำ `/run-lint` เพื่อตรวจ code quality
2. ทำ `/run-test` เพื่อตรวจ behavior
3. ทำ `/run-typecheck` เพื่อตรวจ type safety
4. ทำ `/review-architecture` เพื่อตรวจ paradigm consistency
5. ถ้า check ไม่ผ่าน → ทำ `/resolve-errors` และ recheck สูงสุด 3 รอบ

## Rules

### 1. Paradigm Selection

- เลือก paradigm ตามลักษณะปัญหา ไม่ใช่ trend
- อนุญาตให้ผสม paradigms ได้ แต่ต้องมีขอบเขตชัดเจน
- ไม่บังคับใช้ paradigm เดียวทังโปรเจกต์หาก ecosystem ไม่เอื้อ

### 2. Consistency

- ใช้ paradigm หลักสม่ำเสมอภายใน module หรือ feature
- หลีกเลี่ยง paradigm ทีขัดแย้งกันในส่วนเดียวกัน
- ระบุทิศทาง transition ถ้าต้องเปลี่ยน paradigm

### 3. Pragmatism

- ใช้ paradigm เพื่อแก้ปัญหา ไม่ใช่เพื่อความสมบูรณ์แบบ
- ลด complexity ถ้า paradigm ทำให้ code ซับซ้อนเกินไป
- ทบทวนทางเลือกเมื่อ requirements เปลี่ยน

### 4. Testing

- test pure functions ด้วย input/output
- test class behavior ผ่าน public interfaces
- test reactive code ด้วย marble diagrams หรือ virtual scheduler
- test DP solution ด้วย edge cases และ large inputs

## Expected Outcome

- Paradigm หลักของ module/feature ชัดเจน
- Code สอดคล้องกับ paradigm ทีเลือก
- ลด side effects และ coupling
- Tests ครอบคลุม behavior และ edge cases
- Code maintainable และปรับตัวตาม requirements ได้
