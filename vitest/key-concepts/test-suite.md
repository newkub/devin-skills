# Test Suite

## Purpose

อธิบายโครงสร้าง Test และ Test Suite ใน Vitest

## Scope

- Test Suite ด้วย `describe`
- Test Case ด้วย `it`/`test`
- Nested Suites
- Skip/Only modifiers

## Test Suite

`describe` ใช้จัดกลุ่ม tests ที่เกี่ยวข้องกันเป็น test suite

```typescript
describe('Calculator', () => {
  it('should add numbers', () => {
    expect(1 + 1).toBe(2)
  })
})
```

## Test Case

`it` หรือ `test` ใช้สร้าง individual test case

```typescript
it('should add two numbers', () => {
  expect(add(1, 2)).toBe(3)
})

test('should subtract numbers', () => {
  expect(subtract(5, 2)).toBe(3)
})
```

## Nested Suites

สามารถ nest describe ได้หลายชั้น

```typescript
describe('User', () => {
  describe('create', () => {
    it('should create valid user', () => {})
  })

  describe('update', () => {
    it('should update user', () => {})
  })
})
```

## Skip/Only

```typescript
// Skip test
it.skip('should be skipped', () => {})

// Only run this test
it.only('should run only this', () => {})
```
