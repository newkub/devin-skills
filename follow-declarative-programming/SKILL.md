---
name: follow-declarative-programming
description: พัฒนาโปรเจกต์ด้วย declarative programming พร้อม what not how, immutability, composition
---

## Goal

พัฒนาโปรเจกต์ด้วย declarative programming เพื่อเขียน code ที่อ่านง่าย maintain ได้ง่าย

## Scope

ใช้สำหรับงานพัฒนา code ที่ต้องการ declarative style — what not how, immutability, composition, declarative APIs, data transformation, configuration, และ testing

## Execute

### 1. Describe What Not How

> Goal: เขียน code ที่บอกว่าอะไรต้องทำ ไม่ใช่วิธีทำ

1. ใช้ collection operations แทน loops
2. ใช้ declarative APIs เมื่อเป็นไปได้
3. ใช้ configuration แทน logic
4. ใช้ data structures ที่ express intent
5. หลีกเลี่ยง manual state management

### 2. Use Immutability

> Goal: ใช้ immutability เพื่อลด side effects และทำให้ state คาดเดาได้

1. ใช้ immutable variables สำหรับ values ที่ไม่เปลี่ยน
2. ใช้ copy operations แทน mutation
3. ใช้ collection operations ที่ไม่ mutate
4. ใช้ immutable types สำหรับ objects
5. ใช้ runtime immutability mechanisms สำหรับ runtime immutability

### 3. Use Composition

> Goal: รวม small functions เป็น pipeline ที่อ่านง่ายและ reuse ได้

1. เขียน small functions ที่ทำหน้าที่เดียว
2. รวม functions ด้วย composition
3. ใช้ higher-order functions
4. ใช้ pipeline patterns
5. ใช้ function composition utilities

### 4. Use Declarative APIs

> Goal: เลือกใช้ APIs ที่ express intent โดยไม่ต้องควบคุม flow เอง

1. ใช้ UI components สำหรับ UI
2. ใช้ styling mechanisms สำหรับ styling
3. ใช้ state machines สำหรับ state
4. ใช้ form libraries สำหรับ forms
5. ใช้ routing libraries สำหรับ routing

### 5. Data Transformation

> Goal: แปลง data ผ่าน chain ของ pure operations ไม่ mutate ต้นทาง

1. ใช้ transformation operations สำหรับ transformations
2. ใช้ type narrowing mechanisms สำหรับ type narrowing
3. ใช้ union types สำหรับ complex types
4. ใช้ schema validation สำหรับ data validation
5. ใช้ serializers สำหรับ data serialization

### 6. Configuration

> Goal: แยก configuration ออกจาก logic เพื่อความ flexible และ testable

1. ใช้ config objects สำหรับ settings
2. ใช้ environment variables สำหรับ env-specific values
3. ใช้ feature flags สำหรับ conditional behavior
4. ใช้ schema validation สำหรับ config
5. Document configuration อย่างชัดเจน

### 7. Testing

> Goal: ทดสอบ input/output ของ pure functions และ behavior ของ components

1. Test input/output ของ pure functions
2. Test component behavior
3. Test configuration
4. Test data transformations
5. Use property-based testing

## Rules

### 1. What Not How

- ใช้ collection operations แทน loops
- ใช้ declarative APIs
- ใช้ configuration แทน logic
- ใช้ data structures ที่ express intent
- หลีกเลี่ยง manual state management

### 2. Immutability

- ใช้ immutable variables สำหรับ immutability
- ใช้ copy operations
- ใช้ collection operations ที่ไม่ mutate
- ใช้ immutable types
- ใช้ runtime immutability mechanisms

### 3. Composition

- เขียน small functions
- รวมด้วย composition
- ใช้ higher-order functions
- ใช้ pipeline patterns
- ใช้ composition utilities

### 4. Declarative APIs

- ใช้ UI components
- ใช้ styling mechanisms
- ใช้ state machines
- ใช้ form libraries
- ใช้ routing libraries

### 5. Data Transformation

- ใช้ transformation operations
- ใช้ type narrowing mechanisms
- ใช้ union types
- ใช้ schema validation
- ใช้ serializers

### 6. Configuration

- ใช้ config objects
- ใช้ environment variables
- ใช้ feature flags
- ใช้ schema validation
- Document configuration

### 7. Testing

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