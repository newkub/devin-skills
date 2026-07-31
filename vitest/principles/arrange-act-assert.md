# Arrange-Act-Assert

## Purpose

อธิบายหลักการ Arrange-Act-Assert Pattern - โครงสร้าง test ที่ชัดเจน

## Scope

- หลักการ AAA Pattern
- ตัวอย่างการใช้งาน
- Tips สำหรับการเขียน test

## Principle

แต่ละ test ควรแบ่งเป็น 3 ส่วน: Arrange, Act, Assert

## Why

- Test อ่านง่ายและเข้าใจได้รวดเร็ว
- ง่ายต่อการ debug เมื่อ test ล้มเหลว
- โครงสร้างสม่ำเสมอทั่ว codebase

## Pattern

```typescript
describe('Calculator', () => {
  it('should add two numbers', () => {
    // Arrange - เตรียมข้อมูลและ setup
    const calculator = new Calculator()
    const a = 5
    const b = 3

    // Act - ดำเนินการที่ต้องการ test
    const result = calculator.add(a, b)

    // Assert - ตรวจสอบผลลัพธ์
    expect(result).toBe(8)
  })
})
```

## Examples

### Test async function

```typescript
it('should fetch user', async () => {
  // Arrange
  const userId = '123'
  const api = new UserAPI()

  // Act
  const user = await api.fetchUser(userId)

  // Assert
  expect(user.id).toBe(userId)
  expect(user.name).toBeDefined()
})
```

### Test with mock

```typescript
it('should call API with correct params', async () => {
  // Arrange
  const api = new UserAPI()
  const mockFetch = vi.mocked(fetch)
  mockFetch.mockResolvedValue({ data: 'user' })

  // Act
  await api.fetchUser('123')

  // Assert
  expect(mockFetch).toHaveBeenCalledWith(
    expect.stringContaining('123')
  )
})
```

### Test error handling

```typescript
it('should throw error for invalid input', () => {
  // Arrange
  const calculator = new Calculator()

  // Act & Assert
  expect(() => calculator.divide(5, 0)).toThrow('Division by zero')
})
```

## Tips

- ใช้ comment `// Arrange`, `// Act`, `// Assert` ถ้า logic ซับซ้อน
- แยกแต่ละส่วนด้วย blank line
- Act ควรมีเพียง 1 statement
- Assert ควรมีความเฉพาะเจาะจง
