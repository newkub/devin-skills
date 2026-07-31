# SOLID Principles

## 1. Apply SRP Consistently

แต่ละ class ควรมีหน้าที่เดียว:

```typescript
// ✅ Good: Single responsibility
class UserRepository {
  save(user: User): void { /* save to database */ }
}

class EmailService {
  sendEmail(user: User): void { /* send email */ }
}

class UserService {
  constructor(
    private repository: UserRepository,
    private emailService: EmailService
  ) {}
  
  registerUser(user: User): void {
    this.repository.save(user);
    this.emailService.sendEmail(user);
  }
}

// ❌ Bad: Multiple responsibilities
class UserService {
  save(user: User): void { /* save to database */ }
  sendEmail(user: User): void { /* send email */ }
  registerUser(user: User): void { /* ... */ }
}
```

## 2. Design for Extension

เปิดสำหรับ extension ปิดสำหรับ modification:

```typescript
// ✅ Good: Open for extension
interface IPaymentProcessor {
  process(payment: Payment): void;
}

class CreditCardProcessor implements IPaymentProcessor {
  process(payment: Payment): void { /* ... */ }
}

class PayPalProcessor implements IPaymentProcessor {
  process(payment: Payment): void { /* ... */ }
}

// ❌ Bad: Need to modify for new payment methods
class PaymentProcessor {
  process(payment: Payment): void {
    if (payment.type === 'CreditCard') { /* ... */ }
    else if (payment.type === 'PayPal') { /* ... */ }
    // Need to add more if statements
  }
}
```

## 3. Respect LSP

Subclass ต้องสามารถแทนที่ parent class ได้:

```typescript
// ✅ Good: Proper inheritance
class Bird {}
class FlyingBird extends Bird {
  fly() { /* ... */ }
}
class Eagle extends FlyingBird {
  fly() { /* ... */ }
}

// ❌ Bad: Violates LSP
class Bird {
  fly() { /* ... */ }
}
class Penguin extends Bird {
  fly() {
    throw new Error('Penguins cannot fly');
  }
}
```

## 4. Use Focused Interfaces

Interfaces ควรเล็กและเฉพาะเจาะจง:

```typescript
// ✅ Good: Segregated interfaces
interface IReadable {
  read(): string;
}

interface IWritable {
  write(content: string): void;
}

class File implements IReadable, IWritable {
  read(): string { /* ... */ }
  write(content: string): void { /* ... */ }
}

// ❌ Bad: Fat interface
interface IFile {
  read(): string;
  write(content: string): void;
  delete(): void;
  copy(): void;
  move(): void;
  // ... many more methods
}
```

## 5. Depend on Abstractions

Depend on interfaces ไม่ใช่ concrete classes:

```typescript
// ✅ Good: Dependency injection
class OrderService {
  constructor(
    private repository: OrderRepository,
    private notification: NotificationService
  ) {}
}

// ❌ Bad: Depends on concrete classes
class OrderService {
  private repository: OrderRepository;
  private notification: EmailNotificationService;
  
  constructor() {
    this.repository = new OrderRepository();
    this.notification = new EmailNotificationService();
  }
}
```
