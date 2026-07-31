# SOLID Principles

## Overview

SOLID principles เป็นหลักการออกแบบที่ช่วยให้ software มีความ maintainable, scalable และ testable มากขึ้น

## Single Responsibility Principle (SRP)

### ความหมาย

Class หรือ function ควรมีหน้าที่เดียว และมีเหตุผลเดียวในการเปลี่ยนแปลง

### ตัวอย่างที่ผิด

```javascript
// ❌ ผิด - ทำหลายอย่างใน function เดียว
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  saveToDatabase() {
    // database logic
  }

  sendEmail() {
    // email logic
  }

  validate() {
    // validation logic
  }
}
```

### ตัวอย่างที่ถูก

```javascript
// ✅ ถูก - แยกหน้าที่ออกเป็น classes ต่างหาก
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

class UserRepository {
  save(user) {
    // database logic
  }
}

class EmailService {
  send(email) {
    // email logic
  }
}

class UserValidator {
  validate(user) {
    // validation logic
  }
}
```

## Open/Closed Principle (OCP)

### ความหมาย

Software entities ควรเปิดสำหรับ extension แต่ปิดสำหรับ modification

### ตัวอย่างที่ผิด

```javascript
// ❌ ผิด - ต้องแก้ code เมื่อเพิ่ม payment method
function processPayment(payment) {
  if (payment.type === 'credit_card') {
    // process credit card
  } else if (payment.type === 'paypal') {
    // process paypal
  } else if (payment.type === 'bank_transfer') {
    // process bank transfer
  }
}
```

### ตัวอย่างที่ถูก

```javascript
// ✅ ถูก - ใช้ polymorphism
class PaymentProcessor {
  process(payment) {
    payment.process();
  }
}

class CreditCardPayment {
  process() {
    // process credit card
  }
}

class PayPalPayment {
  process() {
    // process paypal
  }
}

class BankTransferPayment {
  process() {
    // process bank transfer
  }
}
```

## Liskov Substitution Principle (LSP)

### ความหมาย

Subclasses ควรสามารถแทนที่ parent classes ได้โดยไม่ทำให้ program ผิดพลาด

### ตัวอย่างที่ผิด

```javascript
// ❌ ผิด - Square ไม่สามารถแทนที่ Rectangle ได้
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  setWidth(width) {
    this.width = width;
  }

  setHeight(height) {
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  setWidth(width) {
    this.width = width;
    this.height = width; // Square ต้องมี width = height
  }

  setHeight(height) {
    this.height = height;
    this.width = height; // Square ต้องมี width = height
  }
}

// ปัญหา: การใช้ Square แทน Rectangle ทำให้ผิด
const square = new Square(5);
square.setWidth(10);
console.log(square.getArea()); // 100 (แต่ควรเป็น 10 * 5 = 50)
```

### ตัวอย่างที่ถูก

```javascript
// ✅ ถูก - ใช้ base class ที่เหมาะสม
class Shape {
  getArea() {
    throw new Error('Must implement getArea');
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

class Square extends Shape {
  constructor(side) {
    super();
    this.side = side;
  }

  getArea() {
    return this.side * this.side;
  }
}
```

## Interface Segregation Principle (ISP)

### ความหมาย

Clients ไม่ควรถูกบังคับให้ implement interfaces ที่ไม่ใช้

### ตัวอย่างที่ผิด

```javascript
// ❌ ผิด - Worker มี methods ที่ไม่จำเป็นทั้งหมด
class Worker {
  work() {
    // work logic
  }

  eat() {
    // eat logic
  }

  sleep() {
    // sleep logic
  }
}

class Robot extends Worker {
  work() {
    // robot work
  }

  eat() {
    // Robot ไม่ต้องกิน!
  }

  sleep() {
    // Robot ไม่ต้องนอน!
  }
}
```

### ตัวอย่างที่ถูก

```javascript
// ✅ ถูก - แยก interfaces ออกเป็นส่วนเล็กๆ
class Workable {
  work() {
    throw new Error('Must implement work');
  }
}

class Eatable {
  eat() {
    throw new Error('Must implement eat');
  }
}

class Sleepable {
  sleep() {
    throw new Error('Must implement sleep');
  }
}

class Human extends Workable {
  constructor() {
    super();
    this.eatable = new Eatable();
    this.sleepable = new Sleepable();
  }

  work() {
    // human work
  }

  eat() {
    this.eatable.eat();
  }

  sleep() {
    this.sleepable.sleep();
  }
}

class Robot extends Workable {
  work() {
    // robot work
  }
}
```

## Dependency Inversion Principle (DIP)

### ความหมาย

High-level modules ไม่ควร depend บน low-level modules ทั้งสองควร depend บน abstractions

### ตัวอย่างที่ผิด

```javascript
// ❌ ผิด - depend บน concrete implementation
class OrderService {
  constructor() {
    this.database = new MySQLDatabase(); // concrete dependency
  }

  saveOrder(order) {
    this.database.save(order);
  }
}
```

### ตัวอย่างที่ถูก

```javascript
// ✅ ถูก - depend บน abstraction
class Database {
  save(data) {
    throw new Error('Must implement save');
  }
}

class MySQLDatabase extends Database {
  save(data) {
    // MySQL save logic
  }
}

class PostgreSQLDatabase extends Database {
  save(data) {
    // PostgreSQL save logic
  }
}

class OrderService {
  constructor(database) {
    this.database = database; // dependency injection
  }

  saveOrder(order) {
    this.database.save(order);
  }
}

// Usage
const mysqlService = new OrderService(new MySQLDatabase());
const postgresService = new OrderService(new PostgreSQLDatabase());
```

## Best Practices

### 1. ใช้ Composition มากกว่า Inheritance

```javascript
// ✅ ถูก - Composition
class Logger {
  log(message) {
    console.log(message);
  }
}

class UserService {
  constructor(logger) {
    this.logger = logger;
  }

  createUser(user) {
    // create user logic
    this.logger.log('User created');
  }
}

// ❌ ผิด - Inheritance ที่ไม่จำเป็น
class UserServiceWithLogging extends UserService {
  createUser(user) {
    super.createUser(user);
    console.log('User created');
  }
}
```

### 2. ใช้ Dependency Injection

```javascript
// ✅ ถูก - Dependency Injection
class PaymentService {
  constructor(paymentProcessor, emailService) {
    this.paymentProcessor = paymentProcessor;
    this.emailService = emailService;
  }

  processPayment(payment) {
    this.paymentProcessor.process(payment);
    this.emailService.sendConfirmation(payment);
  }
}

// ❌ ผิด - Hardcoded dependencies
class PaymentService {
  constructor() {
    this.paymentProcessor = new StripeProcessor();
    this.emailService = new SendGridService();
  }

  processPayment(payment) {
    this.paymentProcessor.process(payment);
    this.emailService.sendConfirmation(payment);
  }
}
```

### 3. ใช้ Interfaces/Abstractions

```javascript
// ✅ ถูก - ใช้ abstraction
class Cache {
  get(key) {
    throw new Error('Must implement get');
  }

  set(key, value) {
    throw new Error('Must implement set');
  }
}

class RedisCache extends Cache {
  get(key) {
    // Redis get
  }

  set(key, value) {
    // Redis set
  }
}

class MemoryCache extends Cache {
  get(key) {
    // Memory get
  }

  set(key, value) {
    // Memory set
  }
}
```

## Common Pitfalls

### 1. Over-engineering

```javascript
// ❌ ผิด - ซับซ้อนเกินไปสำหรับ project เล็ก
class AbstractFactory {
  create() {
    throw new Error('Must implement create');
  }
}

class UserFactory extends AbstractFactory {
  create() {
    return new User();
  }
}

// ✅ ถูก - เรียบง่ายสำหรับ project เล็ก
function createUser() {
  return new User();
}
```

### 2. ใช้ patterns โดยไม่เข้าใจ

```javascript
// ❌ ผิด - ใช้ pattern โดยไม่จำเป็น
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    Singleton.instance = this;
  }
}

// ✅ ถูก - ใช้เมื่อจำเป็นจริงๆ
const config = {
  // config object
};
```

## References

- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
