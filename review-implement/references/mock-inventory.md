# Mock And Stub Inventory Criteria

## Goal

ระบุ mock, stub, fake, placeholder ที่ต้องแปลงเป็น production code ก่อน `implement-mock`

## Search Patterns

ใช้ `Grep` ค้นหา patterns ต่อไปนี้:

- `MOCK`, `FAKE`, `STUB` — explicit markers
- `mock_`, `fake_`, `stub_` — function prefixes
- `InMemory` — in-memory database or store
- `hardcoded`, `hard-coded` — hardcoded data
- `simulated`, `simulate` — simulated responses
- `placeholder` — placeholder implementations
- `// MOCK`, `// TODO` — comment markers

## Categorization

จัดกลุ่ม mocks ตามประเภท:

1. Database mocks: `InMemory` stores, hardcoded query results, mock repositories
2. API mocks: mock HTTP responses, fake API clients, simulated endpoints
3. Service mocks: stub services, fake external service integrations
4. Data mocks: hardcoded data arrays, fake fixtures ใน production path

## Inventory Criteria

แต่ละ mock ต้องระบุ:

1. File path และ line number
2. Mock type: database, API, service, data
3. Production path หรือ test-only
4. Replacement plan: อะไรจะแทนที่ mock
5. Dependencies ที่ต้องการ: database client, API client, SDK
6. Effort estimate: `S`, `M`, `L`, `XL`

## Severity

- Critical: mock ใน production path, core feature ใช้ mock data, database mock ใน critical path
- High: stub ที่ถูกเรียกใช้จริง, hardcoded data ที่ควรมาจาก source, API mock ใน user flow
- Medium: mock ใน non-critical path, partial mock, placeholder ที่ยังไม่ critical
- Low: mock ใน test-only code, placeholder ที่ไม่กระทบ production
