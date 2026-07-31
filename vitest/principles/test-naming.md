# Test Naming

## Purpose

อธิบายหลักการ Test Naming - ตั้งชื่อ test ที่ชัดเจนและอธิบาย behavior

## Scope

- หลักการตั้งชื่อ test
- Patterns ต่างๆ (Should, When-Then, Given-When-Then)
- Best Practices
- Nested Describes

## Principle

ตั้งชื่อ test ที่อธิบายว่า "อะไร" ควรเกิดขึ้น "เมื่อไหร่" และ "ทำไม"

## Why

- Test ที่ตั้งชื่อดี สามารถทำหน้าที่เป็น documentation
- ง่ายต่อการรู้ว่า test ไหนล้มเหลวและทำไม
- ช่วยคนอื่นเข้าใจ behavior ของ code

## Pattern

### Should Statement

```typescript
describe('UserService', () => {
  it('should create user with valid data', () => {})
  it('should throw error when email is invalid', () => {})
  it('should return user when id exists', () => {})
})
```

### When-Then

```typescript
describe('Calculator', () => {
  it('should return sum when adding positive numbers', () => {})
  it('should return difference when subtracting larger from smaller', () => {})
})
```

### Given-When-Then

```typescript
describe('Payment', () => {
  it('should process payment when card is valid', () => {})
  it('should decline payment when card is expired', () => {})
})
```

## Best Practices

### ✅ Good

```typescript
it('should return 404 when user not found', () => {})
it('should create user when email is unique', () => {})
it('should update password when old password matches', () => {})
```

### ❌ Bad

```typescript
it('test user', () => {})
it('it works', () => {})
it('check function', () => {})
```

## Nested Describes

ใช้ nested describe เพื่อจัดกลุ่ม tests ที่เกี่ยวข้องกัน

```typescript
describe('User', () => {
  describe('create', () => {
    it('should create user with valid data', () => {})
    it('should throw error when email exists', () => {})
  })

  describe('update', () => {
    it('should update user when id exists', () => {})
    it('should throw error when id not found', () => {})
  })
})
```

## Tips

- ใช้ภาษาที่คนอ่านเข้าใจ (business language)
- หลีกเลี่ยง technical details ในชื่อ test
- ชื่อ test ควรบอกผลลัพธ์ที่คาดหวัง
- ใช้ present tense
