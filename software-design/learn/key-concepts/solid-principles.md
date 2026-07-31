# SOLID Principles

## หลักการ SOLID

SOLID เป็นหลักการออกแบบ object-oriented ที่ช่วยให้ software มีความ maintainable, scalable, และ testable มากขึ้น

### Single Responsibility Principle (SRP)

หนึ่ง class ควรมีหน้าที่เดียว

**Example**:

```typescript
// ❌ Bad: Multiple responsibilities
class User {
  save() { /* save to database */ }
  sendEmail() { /* send email */ }
  validate() { /* validate data */ }
}

// ✅ Good: Single responsibility
class User {
  save() { /* save to database */ }
}

class EmailService {
  sendEmail() { /* send email */ }
}

class Validator {
  validate() { /* validate data */ }
}
```

### Open/Closed Principle (OCP)

Class ควรเปิดสำหรับ extension แต่ปิดสำหรับ modification

**Example**:

```typescript
// ❌ Bad: Need to modify for new shapes
class AreaCalculator {
  calculate(shape: any): number {
    if (shape instanceof Circle) return /* circle area */;
    if (shape instanceof Rectangle) return /* rectangle area */;
    // Need to add more if statements
  }
}

// ✅ Good: Open for extension
interface IShape {
  calculateArea(): number;
}

class Circle implements IShape {
  constructor(public radius: number) {}
  calculateArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}

class Rectangle implements IShape {
  constructor(public width: number, public height: number) {}
  calculateArea(): number {
    return this.width * this.height;
  }
}
```

### Liskov Substitution Principle (LSP)

Subclass ควรสามารถแทนที่ parent class ได้โดยไม่เสียความถูกต้อง

**Example**:

```typescript
// ❌ Bad: Violates LSP
class Bird {
  fly() { /* fly */ }
}

class Penguin extends Bird {
  fly() {
    throw new Error('Penguins cannot fly');
  }
}

// ✅ Good: Proper inheritance
class Bird {}

class FlyingBird extends Bird {
  fly() { /* fly */ }
}

class Penguin extends Bird {
  swim() { /* swim */ }
}
```

### Interface Segregation Principle (ISP)

Clients ไม่ควรถูกบังคับให้ implement interfaces ที่ไม่ใช้

**Example**:

```typescript
// ❌ Bad: Fat interface
interface IWorker {
  work(): void;
  eat(): void;
  sleep(): void;
}

// ✅ Good: Segregated interfaces
interface IWorkable {
  work(): void;
}

interface IEatable {
  eat(): void;
}

interface ISleepable {
  sleep(): void;
}
```

### Dependency Inversion Principle (DIP)

Depend on abstractions, not concretions

**Example**:

```typescript
// ❌ Bad: Depends on concrete class
class LightSwitch {
  private bulb = new LightBulb();
  toggle() { this.bulb.toggle(); }
}

// ✅ Good: Depends on abstraction
interface ISwitchable {
  toggle(): void;
}

class LightSwitch {
  constructor(private device: ISwitchable) {}
  toggle() { this.device.toggle(); }
}
```
