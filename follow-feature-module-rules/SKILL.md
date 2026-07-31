---
name: follow-feature-module-rules
description: Rules and guidelines for implementing feature modules in Clean Architecture 2
---

## Goal

ตรวจสอบว่าแต่ละ layer ใน feature module เป็นไปตามมาตรฐาน Clean Architecture 2

## Execute

### 1. Validate Module Structure

ทำ `/feature-module-rules` เพื่อตรวจสอบว่าแต่ละ layer ใน feature module เป็นไปตามมาตรฐาน

### 2. Check Layer Dependencies

ตรวจสอบ dependency direction ใน module:

```
presentation → application → domain → types
infrastructure → application (ผ่าน ports)
```

### 3. Validate Pure Functions

ตรวจสอบว่า domain layer เป็น pure functions 100%:

- ไม่มี I/O operations
- ไม่มี external dependencies  
- ไม่มี side effects
- ใช้ `readonly` ทุกที่

### 4. Review DTO Usage

ตรวจสอบการใช้ DTO และ Adapters ตามเงื่อนไขที่กำหนด

## Rules

### 1. Layer Responsibilities

| Layer | กฎ | ห้าม | Dependencies |
|-------|-----|------|--------------|
| `types/` | type aliases + `readonly` | interfaces, classes, logic | none |
| `domain/` | pure functions, `readonly` | I/O, API, database | `types/` only |
| `application/` | orchestrate domain → ports | business logic, direct infra calls | `domain/`, `app/ports` |
| `infrastructure/` | implement ports, side effects OK | business logic | `app/ports`, external libs |
| `presentation/` | parse input, call usecases | business logic | `application/` |

### 2. DTO Usage Rules

ใช้ DTO เมื่อ:
- Data crosses boundary แล้ว shape เปลี่ยน
- Source ไม่ trustable (external API, user input)
- ต้องการ data validation หรือ transformation
- ต้องการ versioning ของ API contracts

ตัวอย่าง:
```typescript
// ❌ ไม่ใช้ DTO - internal domain ใช้ direct types
const booking: Booking = await repository.getById(id)

// ✅ ใช้ DTO - external API input
const createBookingRequest: CreateBookingDTO = parseHttpRequest(req.body)
const bookingInput: CreateBookingInput = validateAndTransform(createBookingRequest)
```

### 3. Adapter Usage Rules

ใช้ Adapter เมื่อ:
- Data crosses boundary แล้ว shape เปลี่ยน
- Source ไม่ trustable (third-party APIs, legacy systems)
- ต้องการ protocol translation (REST → GraphQL, SQL → NoSQL)
- ต้องการ error handling หรือ retry logic
- ต้องการ caching หรือ rate limiting

ตัวอย่าง:
```typescript
// ❌ ไม่ใช้ Adapter - internal database
const user = await db.query('SELECT * FROM users WHERE id = $1', [id])

// ✅ ใช้ Adapter - external API
const userAdapter = createExternalUserAdapter(httpClient)
const user = await userAdapter.getUserById(userId) // แปลง shape + handle errors
```

### 4. Anti-Patterns

ห้ามทำ:

- ใส่ business logic ใน `presentation/`
- เรียก infrastructure ตรงจาก `domain/`
- ใช้ classes หรือ interfaces
- ใช้ mutable state
- สร้าง DTO/Adapter ภายใน domain layer
- ใช้ DTO สำหรับ internal communication

### 5. Validation Checklist

ทุก module ต้องผ่าน:

- [ ] `types/` มีแค่ type aliases, ไม่มี logic
- [ ] `domain/` เป็น pure functions 100%
- [ ] `application/` ไม่มี business logic
- [ ] `infrastructure/` implement ports เท่านั้น
- [ ] `presentation/` แค่ parse input + call usecases
- [ ] DTO ใช้เฉพาะ boundary crossings
- [ ] Adapter ใช้เฉพาะ external integrations
- [ ] Dependency direction ถูกต้อง

## Expected Outcome

- Feature modules ที่เป็นไปตาม Clean Architecture 2
- ไม่มี duplication ระหว่าง layers
- DTO และ Adapters ใช้ตามเงื่อนไขที่เหมาะสม
- Pure domain logic ที่ testable สูง
