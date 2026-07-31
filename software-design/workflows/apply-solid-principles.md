# Apply SOLID Principles

## Goal

Apply SOLID principles to improve code maintainability and testability

## Execute

### 1. Analyze Current Code

Review code for SOLID violations:

```bash
# Check for large classes (SRP violation)
find . -name "*.cs" -exec wc -l {} \; | awk '$1 > 250'

# Check for deep inheritance (LSP violation)
grep -r "class.*:.*:.*:" --include="*.cs"

# Check for fat interfaces (ISP violation)
grep -r "interface.*{" --include="*.cs" -A 20 | grep -E "^\s*(void|Task).*;"
```

### 2. Identify Violations

Look for these patterns:

**SRP Violations**:
- Classes with multiple responsibilities
- Methods doing multiple things
- Classes changed for multiple reasons

**OCP Violations**:
- Large switch/if-else statements
- Code modified when adding features
- Type checking before operations

**LSP Violations**:
- Subclasses throwing exceptions
- Subclasses not behaving like parent
- Type checking before using subclass

**ISP Violations**:
- Interfaces with many methods
- Clients implementing unused methods
- Interface segregation needed

**DIP Violations**:
- Direct instantiation of concrete classes
- Hard dependencies
- Difficult to test

### 3. Refactor Code

Apply fixes for each violation:

**Fix SRP**:
```typescript
// Before: Single class with multiple responsibilities
class UserService {
  registerUser(user: User): void { }
  sendEmail(user: User): void { }
  validateUser(user: User): void { }
}

// After: Separate classes
class UserService {
  constructor(
    private email: EmailService,
    private validator: Validator
  ) {}
  
  registerUser(user: User): void {
    this.validator.validate(user);
    this.save(user);
    this.email.sendWelcome(user);
  }
}
```

**Fix OCP**:
```typescript
// Before: Switch on type
class PaymentProcessor {
  process(payment: Payment): void {
    switch (payment.type) {
      case 'CreditCard': /* ... */
      case 'PayPal': /* ... */
    }
  }
}

// After: Interface-based
interface IPaymentGateway {
  process(payment: Payment): void;
}

class PaymentProcessor {
  constructor(private gateway: IPaymentGateway) {}
}
```

**Fix LSP**:
```typescript
// Before: Violates LSP
class Bird {
  fly() { }
}
class Penguin extends Bird {
  fly() { throw new Error('Penguins cannot fly'); }
}

// After: Proper hierarchy
abstract class Bird {}
abstract class FlyingBird extends Bird {
  abstract fly(): void;
}
class Penguin extends Bird {
  swim() { }
}
```

**Fix ISP**:
```typescript
// Before: Fat interface
interface IWorker {
  work(): void;
  eat(): void;
  sleep(): void;
}

// After: Segregated interfaces
interface IWorkable { work(): void; }
interface IEatable { eat(): void; }
interface ISleepable { sleep(): void; }
```

**Fix DIP**:
```typescript
// Before: Depends on concrete
class OrderService {
  private repository: OrderRepository = new OrderRepository();
}

// After: Depends on abstraction
class OrderService {
  constructor(private repository: IOrderRepository) {}
}
```

### 4. Write Tests

Test refactored code:

```typescript
// UserService_RegisterUser_ShouldValidateAndSave
const mockRepo = createMock<IUserRepository>();
const mockEmail = createMock<IEmailService>();
const mockValidator = createMock<IValidator>();

const service = new UserService(mockRepo, mockEmail, mockValidator);

service.registerUser(user);

mockValidator.verify(v => v.validate(user), 1);
mockRepo.verify(r => r.save(user), 1);
mockEmail.verify(e => e.sendWelcome(user), 1);
```

### 5. Verify Changes

Run tests and ensure:

- All tests pass
- Code is more maintainable
- Dependencies are reduced
- Test coverage improved

## Expected Outcome

- Code follows SOLID principles
- Improved testability
- Reduced coupling
- Better separation of concerns
