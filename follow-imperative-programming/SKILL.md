---
name: follow-imperative-programming
description: พัฒนาโปรเจกต์ด้วย imperative programming พร้อม control structures, sequential
  execution
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

## Goal

พัฒนาโปรเจกต์ด้วย imperative programming เพื่อควบคุม flow ของโปรแกรมอย่างชัดเจน

## Execute

### 1. Use Control Structures

ใช้ control structures อย่างเหมาะสม

1. ใช้ conditional statements สำหรับ conditional logic
2. ใช้ branching statements สำหรับ multiple branches
3. ใช้ loops สำหรับ iteration
4. ใช้ flow control statements สำหรับ flow control
5. ใช้ error handling mechanisms สำหรับ error handling

### 2. Sequential Execution

เขียน code แบบ sequential

1. เรียงลำดับ statements อย่างชัดเจน
2. ใช้ block scopes อย่างเหมาะสม
3. ใช้ early returns เมื่อเป็นไปได้
4. หลีกเลี่ยง nested conditions ลึกเกินไป
5. ใช้ guard clauses สำหรับ validation

### 3. Variable Management

จัดการ variables อย่างเหมาะสม

1. ใช้ immutable variables สำหรับ values ที่ไม่เปลี่ยน
2. ใช้ mutable variables สำหรับ values ที่เปลี่ยน
3. หลีกเลี่ยง deprecated variable declarations
4. กำหนด scope อย่างชัดเจน
5. ใช้ meaningful names

### 4. Loop Optimization

ปรับปรุง loops

1. ใช้ iteration over collections สำหรับ iterable objects
2. ใช้ iteration over properties สำหรับ object properties
3. ใช้ collection operations เมื่อเหมาะสม
4. หลีกเลี่ยง loops ซ้อนกันลึกเกินไป
5. ใช้ flow control statements อย่างระมัดระวัง

### 5. Error Handling

จัดการ errors อย่าง systematic

1. ใช้ error handling mechanisms สำหรับ error handling
2. ใช้ cleanup mechanisms สำหรับ cleanup
3. ใช้ error raising สำหรับ custom errors
4. ใช้ error objects อย่างถูกต้อง
5. Propagate errors อย่างเหมาะสม

### 6. State Mutation

จัดการ state mutations อย่างปลอดภัย

1. จำกัด mutations ใน scope ที่จำเป็น
2. ใช้ immutable patterns เมื่อเป็นไปได้
3. Document mutations อย่างชัดเจน
4. หลีกเลี่ยง side effects ที่ไม่คาดคิด
5. Test mutations อย่างครบถ้วน

### 7. Performance

ปรับปรุง performance

1. หลีกเลี่ยง unnecessary calculations
2. ใช้ caching เมื่อเป็นไปได้
3. Optimize hot paths
4. Profile และ benchmark
5. ใช้ efficient algorithms

## Rules

### Control Structures

ใช้ control structures อย่างเหมาะสม

- ใช้ `conditional statements` สำหรับ simple conditions
- ใช้ `branching statements` สำหรับ multiple branches
- ใช้ `loops` สำหรับ iteration
- ใช้ `flow control statements` อย่างระมัดระวัง
- หลีกเลี่ยง `nested conditions` ลึกเกินไป

### Sequential Execution

เขียน code แบบ sequential อย่างชัดเจน

- เรียงลำดับ `statements` อย่างชัดเจน
- ใช้ `block scopes` อย่างเหมาะสม
- ใช้ `early returns`
- ใช้ `guard clauses`
- หลีกเลี่ยง `deep nesting`

### Variable Management

จัดการ variables อย่างเหมาะสม

- ใช้ `immutable variables` สำหรับ immutability
- ใช้ `mutable variables` สำหรับ mutability
- หลีกเลี่ยง `deprecated declarations`
- กำหนด `scope` ชัดเจน
- ใช้ `meaningful names`

### Loop Optimization

ปรับปรุง loops อย่างเหมาะสม

- ใช้ `iteration over collections` สำหรับ iterables
- ใช้ `iteration over properties` สำหรับ objects
- ใช้ `collection operations` เมื่อเหมาะสม
- หลีกเลี่ยง `deep nesting`
- ใช้ `flow control statements` อย่างระมัดระวัง

### Error Handling

จัดการ errors อย่าง systematic

- ใช้ `error handling mechanisms` สำหรับ error handling
- ใช้ `cleanup mechanisms` สำหรับ cleanup
- ใช้ `error raising` สำหรับ custom errors
- ใช้ `error objects` ถูกต้อง
- Propagate `errors` อย่างเหมาะสม

### State Mutation

จัดการ state mutations อย่างปลอดภัย

- จำกัด `mutations`
- ใช้ `immutable patterns`
- Document `mutations`
- หลีกเลี่ยง `side effects`
- Test `mutations`

### Performance

ปรับปรุง performance

- หลีกเลี่ยง `unnecessary calculations`
- ใช้ `caching`
- Optimize `hot paths`
- Profile และ benchmark
- ใช้ `efficient algorithms`

## Expected Outcome

- Control flow ที่ชัดเจน
- Sequential execution ที่เข้าใจง่าย
- Variables ที่จัดการดี
- Loops ที่ efficient
- Error handling ที่ systematic
- State mutations ที่ปลอดภัย
- Performance ที่ดี
