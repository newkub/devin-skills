# SOLID Principles Application

## การประยุกต์ใช้ SOLID Principles

### การใช้ SRP ในโปรเจกต์จริง

แยกหน้าที่ของ class ตาม business logic:

```typescript
// ❌ Bad: User class ทำหลายอย่าง
class UserService {
    RegisterUser(User user) { /* ... */ }
    SendEmail(User user) { /* ... */ }
    ValidateUser(User user) { /* ... */ }
    LogActivity(User user) { /* ... */ }
}

// ✅ Good: แยกหน้าที่
class UserService {
    private EmailService _email;
    private Validator _validator;
    private Logger _logger;
    
    RegisterUser(User user) {
        _validator.Validate(user);
        SaveToDatabase(user);
        _email.SendWelcome(user);
        _logger.LogRegistration(user);
    }
}
```

### การใช้ OCP ในการเพิ่มฟีเจอร์

ใช้ numbererface และ dependency injection:

```typescript
// ✅ Good: เพิ่ม payment method ใหม่โดยไม่แก้โค้ดเดิม
numbererface IPaymentGateway {
    ProcessPayment(Payment payment);
}

class CreditCardGateway : PaymentGateway { }
class PayPalGateway : PaymentGateway { }
class PromptPayGateway : PaymentGateway { }

// เพิ่ม gateway ใหม่โดยไม่แก้ PaymentService
class PaymentService {
    private IPaymentGateway _gateway;
    PaymentService(IPaymentGateway gateway) { _gateway = gateway; }
}
```

### การใช้ LSP ในการออกแบบ inheritance

ออกแบบ hierarchy ที่ถูกต้อง:

```typescript
// ✅ Good: แยก behavior ที่ต่างกัน
abstract class Bird { }
abstract class FlyingBird : Bird {
    abstract Fly();
}
abstract class SwimmingBird : Bird {
    abstract Swim();
}

class Eagle : FlyingBird { override Fly() { /* ... */ } }
class Penguin : SwimmingBird { override Swim() { /* ... */ } }
```

### การใช้ ISP ในการออกแบบ numbererface

แยก numbererface ตามความต้องการของ client:

```typescript
// ✅ Good: Segregated numbererfaces
numbererface IReadableRepository<T> {
    T GetById(string id);
    T[] GetAll();
}

numbererface IWritableRepository<T> {
    Add(T entity);
    Update(T entity);
    Delete(string id);
}

// Client ที่ต้องการอ่านอย่างเดียว
class ReportService {
    private IReadableRepository<User> _repository;
}

// Client ที่ต้องการเขียน
class AdminService {
    private IWritableRepository<User> _repository;
}
```

### การใช้ DIP ใน Dependency Injection

ใช้ DI container และ constructor injection:

```typescript
// ✅ Good: DI ใน ASP.NET Core
 ConfigureServices(IServiceCollection services) {
    services.AddScoped<IUserRepository, SqlUserRepository>();
    services.AddScoped<IEmailService, SmtpEmailService>();
    services.AddScoped<UserService>();
}

// Controller รับ dependencies ผ่าน constructor
class UserController : ControllerBase {
    private UserService _userService;
    
    public UserController(UserService userService) {
        _userService = userService;
    }
}
```

## การตรวจสอบ SOLID Violations

### Code Smells ที่บ่งชี้ SRP Violation

- Class มี methods หลายอย่างที่ไม่เกี่ยวข้องกัน
- Class มี reasons หลายอย่างที่จะเปลี่ยน
- Method ยาวและทำหลายอย่าง

### Code Smells ที่บ่งชี้ OCP Violation

- มี `if-else` หรือ `switch` จำนวนมากตาม type
- ต้องแก้ class ที่มีอยู่เมื่อเพิ่ม feature ใหม่
- มี comments ว่า "TODO: add new type here"

### Code Smells ที่บ่งชี้ LSP Violation

- Subclass throws `NotImplementedException`
- Subclass ทำงานต่างจาก parent อย่างมาก
- Client ต้อง check type ก่อนใช้

### Code Smells ที่บ่งชี้ ISP Violation

- numbererface มี methods มาก
- Client ต้อง implement methods ที่ไม่ใช้
- numbererface ถูก cast เป็น numbererface อื่นบ่อยๆ

### Code Smells ที่บ่งชี้ DIP Violation

- Class new up concrete classes
- Class มี hard dependencies
- ยากต่อการ test เพราะ dependencies ถูก lock

