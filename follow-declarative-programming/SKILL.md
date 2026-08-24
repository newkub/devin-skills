---
name: follow-declarative-programming
description: พัฒนาโปรเจกต์ด้วย declarative programming พร้อม what not how, immutability, composition
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related:
---

## Goal

พัฒนาโปรเจกต์ด้วย declarative programming เพื่อเขียน code ที่อ่านง่าย maintain ได้ง่าย

## Scope

Use `follow-declarative-programming` for the specific tasks and workflows it covers

## Execute

### 1. Describe What Not How
> Goal: Describe What Not How

เขียน code ที่บอกว่าอะไรต้องทำ ไม่ใช่วิธีทำ

1. ใช้ collection operations แทน loops
2. ใช้ declarative APIs เมื่อเป็นไปได้
3. ใช้ configuration แทน logic
4. ใช้ data structures ที่ express intent
5. หลีกเลี่ยง manual state management

### 2. Use Immutability
> Goal: Use Immutability

ใช้ immutability เพื่อลด side effects

1. ใช้ immutable variables สำหรับ values ที่ไม่เปลี่ยน
2. ใช้ copy operations แทน mutation
3. ใช้ collection operations ที่ไม่ mutate
4. ใช้ immutable types สำหรับ objects
5. ใช้ runtime immutability mechanisms สำหรับ runtime immutability

### 3. Use Composition
> Goal: Use Composition

รวม functions หรือ components เข้าด้วยกัน

1. เขียน small functions ที่ทำหน้าที่เดียว
2. รวม functions ด้วย composition
3. ใช้ higher-order functions
4. ใช้ pipeline patterns
5. ใช้ function composition utilities

### 4. Use Declarative APIs
> Goal: Use Declarative APIs

ใช้ APIs ที่เป็น declarative

1. ใช้ UI components สำหรับ UI
2. ใช้ styling mechanisms สำหรับ styling
3. ใช้ state machines สำหรับ state
4. ใช form libraries สำหรับ forms
5. ใช routing libraries สำหรับ routing

### 5. Data Transformation
> Goal: Data Transformation

แปลง data อย่าง declarative

1. ใช้ transformation operations สำหรับ transformations
2. ใช้ type narrowing mechanisms สำหรับ type narrowing
3. ใช้ union types สำหรับ complex types
4. ใช้ schema validation สำหรับ data validation
5. ใช้ serializers สำหรับ data serialization

### 6. Configuration
> Goal: Configuration

ใช้ configuration แทน hardcoded logic

1. ใช้ config objects สำหรับ settings
2. ใช้ environment variables สำหรับ env-specific values
3. ใช feature flags สำหรับ conditional behavior
4. ใช schema validation สำหรับ config
5. Document configuration อย่างชัดเจน

### 7. Testing
> Goal: Testing

เขียน tests สำหรับ declarative code

1. Test input/output ของ pure functions
2. Test component behavior
3. Test configuration
4. Test data transformations
5. Use property-based testing

## Rules

### What Not How

เขียน code ที่บอกว่าอะไรต้องทำ

- ใช้ collection operations แทน loops
- ใช้ declarative APIs
- ใช้ configuration แทน logic
- ใช้ data structures ที่ express intent
- หลีกเลี่ยง manual state management

### Immutability

ใช้ immutability เพื่อลด side effects

- ใช้ immutable variables สำหรับ immutability
- ใช้ copy operations
- ใช้ collection operations ที่ไม่ mutate
- ใช้ immutable types
- ใช้ runtime immutability mechanisms

### Composition

รวม functions/components อย่างเป็นระบบ

- เขียน small functions
- รวมด้วย composition
- ใช้ higher-order functions
- ใช้ pipeline patterns
- ใช้ composition utilities

### Declarative APIs

ใช้ APIs ที่เป็น declarative

- ใช้ UI components
- ใช้ styling mechanisms
- ใช้ state machines
- ใช้ form libraries
- ใช้ routing libraries

### Data Transformation

แปลง data อย่าง declarative

- ใช้ transformation operations
- ใช้ type narrowing mechanisms
- ใช้ union types
- ใช้ schema validation
- ใช้ serializers

### Configuration

ใช้ configuration แทน hardcoded logic

- ใช้ config objects
- ใช้ environment variables
- ใช feature flags
- ใช้ schema validation
- Document configuration

### Testing

เขียน tests สำหรับ declarative code

- Test input/output
- Test component behavior
- Test configuration
- Test data transformations
- Use property-based testing

## Expected Outcome

- Code ที่อ่านง่าย
- Code ที่ maintain ได้ง่าย
- Immutability ทั่ว codebase
- Composition ที่ชัดเจน
- Configuration ที่ flexible
- Tests ที่เขียนง่าย
- ลด side effects
