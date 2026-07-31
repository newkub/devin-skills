# Code Quality

## 10. Write Self-Documenting Code

ชื่อ variables, methods, classes ควรบอกความหมาย:

```typescript
// ✅ Good: Self-documenting
const userAge = CalculateAge(user.BirthDate);
const isEligibleForDiscount = userAge >= 65;

// ❌ Bad: Unclear naming
const x = Calculate(user.b);
const y = x >= 65;
```

## 11. Keep Methods Small

Methods ควรทำหน้าที่เดียวและสั้น:

```typescript
// ✅ Good: Small, focused method
ProcessOrder(Order order) {
  ValidateOrder(order);
  CalculateTotal(order);
  SaveOrder(order);
  SendConfirmation(order);
}

// ❌ Bad: Large method doing everything
ProcessOrder(Order order) {
  // 100 lines of code
}
```

## 12. DRY (Don't Repeat Yourself)

Avoid code duplication:

```typescript
// ✅ Good: Reusable method
private ValidateEmail(string email) {
  if (string.IsNullOrWhiteSpace(email))
    throw new ArgumentException("Email is required");
  
  if (!IsValidEmailFormat(email))
    throw new ArgumentException("Invalid email format");
}

// Use in multiple places
ValidateEmail(user.Email);
ValidateEmail(customer.Email);

// ❌ Bad: Duplicated validation
if (string.IsNullOrWhiteSpace(user.Email))
  throw new ArgumentException("Email is required");

if (string.IsNullOrWhiteSpace(customer.Email))
  throw new ArgumentException("Email is required");
```
