# Design Principles

## หลักการออกแบบทั่วไป

### DRY (Don't Repeat Yourself)

หลีกเลี่ยงการเขียนโค้ดซ้ำ:

```typescript
// ❌ Bad: Duplicated validation
if (string.IsNullOrWhiteSpace(user.Email)) 
    throw new ArgumentException("Email is required");

if (string.IsNullOrWhiteSpace(customer.Email)) 
    throw new ArgumentException("Email is required");

// ✅ Good: Reusable method
ValidateEmail(string email) {
    if (string.IsNullOrWhiteSpace(email))
        throw new ArgumentException("Email is required");
}

ValidateEmail(user.Email);
ValidateEmail(customer.Email);
```

### KISS (Keep It Simple, Stupid)

ทำให้โค้ดเรียบง่ายและเข้าใจง่าย:

```typescript
// ❌ Bad: Over-engineered
class EmailValidatorFactoryProviderFactory {
    IEmailValidatorFactoryProvider GetProvider() { /* ... */ }
}

// ✅ Good: Simple
class EmailValidator {
    booleanean IsValid(string email) { /* ... */ }
}
```

### YAGNI (You Aren't Gonna Need It)

อย่าเขียน features ที่ยังไม่ต้องการ:

```typescript
// ❌ Bad: Features ที่ยังไม่ใช้
class UserService {
    RegisterUser(User user) { }
    SendSms(User user) { } // ยังไม่ใช้
    SendPushNotification(User user) { } // ยังไม่ใช้
    GenerateReport(User user) { } // ยังไม่ใช้
}

// ✅ Good: เฉพาะที่ใช้จริง
class UserService {
    RegisterUser(User user) { }
}
```

### Separation of Concerns

แยก concerns ที่ต่างกัน:

```typescript
// ✅ Good: แยก UI, Business, Data
// UI Layer
class UserController {
    IActionResult Register(RegisterRequest request) {
        _userService.Register(request);
        return Ok();
    }
}

// Business Layer
class UserService {
    Register(RegisterRequest request) {
        const user =  MapToUser(request);
        _repository.Save(user);
    }
}

// Data Layer
class UserRepository {
    Save(User user) { /* database operation */ }
}
```

### Encapsulation

ซ่อน implementation details:

```typescript
// ✅ Good: Encapsulated
class BankAccount {
    private decimal _balance;
    
     Deposit(decimal amount) {
        if (amount <= 0) throw new ArgumentException("Invalid amount");
        _balance += amount;
    }
    
    public decimal GetBalance() = this.balance;
}

// ❌ Bad: Exposed numberernal state
class BankAccount {
    public decimal Balance; // สามารถแก้ไขโดยตรง
}
```

### Composition Over Inheritance

ใช้ composition มากกว่า inheritance:

```typescript
// ✅ Good: Composition
class Flight {
    private IBookingSystem _booking;
    private IPaymentSystem _payment;
    
    public Flight(IBookingSystem booking, IPaymentSystem payment) {
        _booking = booking;
        _payment = payment;
    }
}

// ❌ Bad: Deep inheritance
class Flight extends BookableFlight extends PayableFlight extends BaseFlight
```

### Law of Demeter

Objects ควรรู้จักเฉพาะ objects ที่ใกล้ชิด:

```typescript
// ❌ Bad: Train wreck
const street =  user.Address.City.Country.Region.Street;

// ✅ Good: Encapsulate
const street =  user.GetStreet();

// หรือ
class Address {
    public string GetFullStreet() { /* ... */ }
}
```

### Tell, Don't Ask

บอก objects ให้ทำงาน ไม่ใช่ถาม state:

```typescript
// ❌ Bad: Ask state
if (order.IsPaid && order.IsShipped && order.IsDelivered) {
    order.MarkAsComplete();
}

// ✅ Good: Tell object
order.TryComplete();
```

## การเลือกใช้หลักการ

### เมื่อใช้ DRY

- Code ซ้ำกัน 3 ครั้งขึ้นไป
- Logic เหมือนกันแต่ context ต่างกัน
- มีความเสี่ยงถ้าแก้ไขในที่เดียว

### เมื่อใช้ KISS

- มีทางเลือกง่ายๆ ที่ใช้งานได้
- ไม่จำเป็นต้อง optimize ในขั้นตอนนี้
- Team ไม่เข้าใจ complex solution

### เมื่อใช้ YAGNI

- Features ยังไม่มี requirement
- เป็น "just in case" features
- เพิ่ม complexity โดยไม่จำเป็น

### เมื่อใช้ Separation of Concerns

- มีหลาย layers ผสมกันใน class เดียว
- Business logic ผสมกับ UI
- Data access ผสมกับ business logic

