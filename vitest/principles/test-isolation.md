# Test Isolation

## Purpose

อธิบายหลักการ Test Isolation - แต่ละ test ควรเป็นอิสระจากกัน

## Scope

- หลักการ Test Isolation
- การใช้ beforeEach/afterEach
- การใช้ mock data ใหม่ทุก test
- การหลีกเลี่ยง shared state

## Principle

แต่ละ test ควรเป็นอิสระจากกัน ไม่พึ่งพา state จาก test อื่น

## Why

- Test ที่ไม่ isolated จะยากต่อการ debug
- Test ที่ล้มเหลวอาจทำให้ test อื่นล้มเหลวตาม
- ยากต่อการรัน parallel tests

## How

### ใช้ beforeEach/afterEach

```typescript
describe('UserService', () => {
  let service: UserService

  beforeEach(() => {
    service = new UserService()
  })

  afterEach(() => {
    service.cleanup()
  })

  it('should create user', () => {
    service.create({ name: 'John' })
    expect(service.count()).toBe(1)
  })

  it('should create another user', () => {
    service.create({ name: 'Jane' })
    expect(service.count()).toBe(1) // ✅ ไม่พึ่งพา test ก่อนหน้า
  })
})
```

### ใช้ mock data ใหม่ทุก test

```typescript
describe('API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch user', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ data: 'user1' })
    // ...
  })

  it('should fetch another user', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ data: 'user2' })
    // ...
  })
})
```

### หลีกเลี่ยง shared state

❌ Bad:

```typescript
let sharedData: any

beforeAll(() => {
  sharedData = loadData()
})

it('test 1', () => {
  sharedData.value = 'modified'
})

it('test 2', () => {
  // พึ่งพา sharedData จาก test 1
  expect(sharedData.value).toBe('modified')
})
```

✅ Good:

```typescript
it('test 1', () => {
  const data = loadData()
  data.value = 'modified'
  expect(data.value).toBe('modified')
})

it('test 2', () => {
  const data = loadData()
  expect(data.value).toBe('original')
})
```
