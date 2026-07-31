# SOLID Principles in TypeScript

## Rationale

SOLID principles ช่วยให้โค้ด maintainable, extensible และ easier to test โดยเฉพาะใน TypeScript ที่มี type system ช่วย enforce design

## Single Responsibility Principle (SRP)

### Definition

แต่ละ class/module ควรมีหน้าที่เดียวที่ชัดเจน

```typescript
// ❌ Violates SRP - ทำหลายอย่าง
class UserService {
  createUser(data: UserData) { /* ... */ }
  sendWelcomeEmail(user: User) { /* ... */ }
  logActivity(action: string) { /* ... */ }
  generateReport() { /* ... */ }
}

// ✅ SRP - แบ่ง responsibilities
class UserService {
  constructor(
    private userRepo: UserRepository,
    private emailService: EmailService,
    private logger: ActivityLogger
  ) {}
  
  async createUser(data: UserData): Promise<User> {
    const user = await this.userRepo.create(data);
    await this.emailService.sendWelcome(user);
    this.logger.log("user_created", user.id);
    return user;
  }
}
```

### When to Split

| Sign | Solution |
|------|----------|
| Multiple reasons to change | Split into separate classes |
| Constructor has > 5 dependencies | Extract to new class |
| Methods don't relate to each other | Split by concern |

## Open/Closed Principle (OCP)

### Definition

Open for extension, closed for modification

```typescript
// ❌ Violates OCP - ต้องแก้ไขเมื่อเพิ่ม payment method
class PaymentProcessor {
  process(type: string, amount: number) {
    if (type === "credit") { /* ... */ }
    if (type === "debit") { /* ... */ }
    // Must add more if-else for new types
  }
}

// ✅ OCP - ขยายได้โดยไม่ต้องแก้ไข
interface PaymentMethod {
  process(amount: number): Promise<void>;
}

class CreditCardPayment implements PaymentMethod {
  async process(amount: number): Promise<void> { /* ... */ }
}

class DebitCardPayment implements PaymentMethod {
  async process(amount: number): Promise<void> { /* ... */ }
}

class PaymentProcessor {
  constructor(private methods: PaymentMethod[]) {}
  
  async process(method: PaymentMethod, amount: number) {
    await method.process(amount);
  }
}
```

### TypeScript Patterns

```typescript
// Use interface for extension points
interface Validator<T> {
  validate(value: T): boolean;
  getErrorMessage(): string;
}

class EmailValidator implements Validator<string> {
  validate(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  getErrorMessage(): string {
    return "Invalid email format";
  }
}

// Add new validators without modifying existing code
class PhoneValidator implements Validator<string> {
  validate(value: string): boolean {
    return /^\+?[0-9]{10,}$/.test(value);
  }
  getErrorMessage(): string {
    return "Invalid phone number";
  }
}
```

## Liskov Substitution Principle (LSP)

### Definition

Subtypes ต้องสามารถใช้แทน base types ได้โดยไม่เปลี่ยน behavior

```typescript
// ❌ Violates LSP - Bird ต้อง override fly() แต่ Penguin ไม่สามารถ fly ได้
class Bird {
  fly(): void { /* ... */ }
}

class Penguin extends Bird {
  fly(): void {
    throw new Error("Penguins cannot fly!");
  }
}

// ✅ LSP - แยก capability ออกมา
interface Flyable {
  fly(): void;
}

class Bird {
  constructor(public name: string) {}
}

class FlyingBird extends Bird implements Flyable {
  fly(): void { /* ... */ }
}

class Penguin extends Bird {
  // Penguin doesn't implement Flyable
  swim(): void { /* ... */ }
}

// Usage - safe to pass any bird
function makeBirdFly(bird: Bird & Flyable) {
  bird.fly();
}
```

### TypeScript Interface Usage

```typescript
// Use interface to define contracts
interface Readable {
  read(): string;
}

interface Writable {
  write(data: string): void;
}

interface FileHandler extends Readable, Writable {
  delete(): Promise<void>;
}

// Implementations must fulfill all contracts
class TextFile implements FileHandler {
  async read(): Promise<string> { /* ... */ }
  async write(data: string): Promise<void> { /* ... */ }
  async delete(): Promise<void> { /* ... */ }
}
```

## Interface Segregation Principle (ISP)

### Definition

Interfaces ควรเล็กและ specific ไม่ใช่ใหญ่และ general

```typescript
// ❌ Violates ISP - too many responsibilities
interface Machine {
  print(): void;
  scan(): void;
  fax(): void;
}

class OldPrinter implements Machine {
  print(): void { /* ... */ }
  scan(): void { /* Should throw: not supported */ }
  fax(): void { /* Should throw: not supported */ }
}

// ✅ ISP - split into specific interfaces
interface Printer {
  print(content: string): void;
}

interface Scanner {
  scan(): Document;
}

interface FaxMachine {
  fax(document: Document, destination: string): void;
}

// Compose as needed
class ModernPrinter implements Printer, Scanner {
  print(content: string): void { /* ... */ }
  scan(): Document { /* ... */ }
}

// Simple printer only implements what it needs
class SimplePrinter implements Printer {
  print(content: string): void { /* ... */ }
}
```

### Generic with Specific Methods

```typescript
// Group related methods
interface UserCrud {
  create(data: CreateUserDto): Promise<User>;
  read(id: string): Promise<User>;
  update(id: string, data: UpdateUserDto): Promise<User>;
  delete(id: string): Promise<void>;
}

interface UserQueries {
  findByEmail(email: string): Promise<User>;
  findByRole(role: string): Promise<User[]>;
}

// Users need both CRUD and queries
class UserRepository implements UserCrud, UserQueries {
  // Implement all methods
}
```

## Dependency Inversion Principle (DIP)

### Definition

Depend on abstractions, not concretions

```typescript
// ❌ Violates DIP - depends on concrete class
class UserService {
  constructor(private db: MongoDatabase) {} // Direct dependency
  
  async createUser(data: UserData) {
    await this.db.collection("users").insertOne(data);
  }
}

// ✅ DIP - depends on abstraction
interface Database {
  find(collection: string, query: object): Promise<object>;
  insert(collection: string, data: object): Promise<void>;
}

class UserService {
  constructor(private db: Database) {} // Abstration
  
  async createUser(data: UserData) {
    await this.db.insert("users", data);
  }
}

// Can swap MongoDatabase with any other implementation
class MongoDatabase implements Database { /* ... */ }
class PostgreSQLDatabase implements Database { /* ... */ }
```

### Constructor Injection

```typescript
// TypeScript makes dependencies explicit
interface EmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

interface CacheService {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T, ttl: number): void;
}

class UserService {
  constructor(
    private userRepo: UserRepository,
    private emailService: EmailService,
    private cache: CacheService
  ) {}
  
  async getUser(id: string): Promise<User | null> {
    // Check cache first
    const cached = this.cache.get<User>(`user:${id}`);
    if (cached) return cached;
    
    const user = await this.userRepo.findById(id);
    if (user) {
      this.cache.set(`user:${id}`, user, 300);
    }
    return user;
  }
}
```

## Applying SOLID in TypeScript

### Use Interfaces for Contracts

```typescript
// Define contracts with interfaces
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

// Implementations can vary
class InMemoryRepository<T> implements Repository<T> { /* ... */ }
class DatabaseRepository<T> implements Repository<T> { /* ... */ }
```

### Use Types for Composition

```typescript
// Compose types with intersections
type UserWithTimestamp = User & { createdAt: Date; updatedAt: Date };

// Use discriminated unions for state
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };
```

### Strict Type Checking

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

## References

- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Clean Code - Robert C. Martin](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)