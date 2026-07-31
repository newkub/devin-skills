# Hooks

## Purpose

อธิบาย Test Hooks สำหรับ setup และ cleanup ใน test lifecycle

## Scope

- beforeAll/afterAll
- beforeEach/afterEach
- Execution Order
- Async Hooks
- Scoping

## Hooks

ใช้สำหรับ setup และ cleanup ใน test lifecycle

## beforeAll

รันครั้งเดียวก่อนทุก tests ใน suite

```typescript
beforeAll(() => {
  setupDatabase()
})
```

## afterAll

รันครั้งเดียวหลังทุก tests ใน suite

```typescript
afterAll(() => {
  cleanupDatabase()
})
```

## beforeEach

รันก่อนทุก test

```typescript
beforeEach(() => {
  seedDatabase()
})
```

## afterEach

รันหลังทุก test

```typescript
afterEach(() => {
  clearDatabase()
})
```

## Execution Order

```typescript
describe('Order', () => {
  beforeAll(() => console.log('1. beforeAll'))
  afterAll(() => console.log('8. afterAll'))
  beforeEach(() => console.log('2. beforeEach'))
  afterEach(() => console.log('7. afterEach'))

  it('test 1', () => {
    console.log('3. test 1')
  })

  it('test 2', () => {
    console.log('5. test 2')
  })
})
// Output: 1, 2, 3, 7, 2, 5, 7, 8
```

## Async Hooks

```typescript
beforeEach(async () => {
  await setupAsync()
})

afterEach(async () => {
  await cleanupAsync()
})
```

## Scoping

Hooks ใน nested describe จะรันตาม hierarchy

```typescript
describe('outer', () => {
  beforeEach(() => console.log('outer beforeEach'))

  describe('inner', () => {
    beforeEach(() => console.log('inner beforeEach'))
    it('test', () => {})
  })
})
// Output: outer beforeEach, inner beforeEach, test
```
