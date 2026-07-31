# Composition Patterns

## Rationale

Composition เป็น pattern ที่สำคัญใน TypeScript สำหรับสร้าง reusable, flexible และ maintainable code โดยการรวม small pieces ของ functionality

## Function Composition

### Basic Composition

```typescript
// Compose functions left-to-right
const pipe = <T>(...fns: Array<(arg: T) => T>) => 
  (value: T) => fns.reduce((acc, fn) => fn(acc), value);

// Example: data transformation pipeline
const parse = (str: string) => JSON.parse(str);
const validate = (obj: unknown) => {
  if (typeof obj !== "object" || obj === null) {
    throw new Error("Invalid JSON object");
  }
  return obj;
};
const enrich = (obj: object) => ({ ...obj, timestamp: Date.now() });

const processData = pipe(parse, validate, enrich);
const result = processData('{"name":"John"}');
```

### Compose with Different Types

```typescript
// Compose with type-safe transformations
type Mapper<A, B> = (input: A) => B;

function compose<A, B, C>(
  f: Mapper<A, B>,
  g: Mapper<B, C>
): Mapper<A, C> {
  return (a: A) => g(f(a));
}

// Usage
const stringToNumber: Mapper<string, number> = (s) => s.length;
const numberToBoolean: Mapper<number, boolean> = (n) => n > 0;

const stringToBoolean = compose(stringToNumber, numberToBoolean);
const result = stringToBoolean("hello"); // true
```

## Object Composition

### Mixins

```typescript
// Simple mixin pattern
type Constructor<T = object> = new (...args: any[]) => T;

function withTimestamp<T extends Constructor>(Base: T) {
  return class extends Base {
    createdAt: Date;
    updatedAt: Date;
    
    constructor(...args: any[]) {
      super(...args);
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
    
    touch() {
      this.updatedAt = new Date();
    }
  };
}

function withValidation<T extends Constructor>(
  Base: T,
  validator: (obj: InstanceType<T>) => boolean
) {
  return class extends Base {
    isValid(): boolean {
      return validator(this);
    }
  };
}

// Compose mixins
const TimestampedUser = withTimestamp(class {});
const ValidatableUser = withValidation(TimestampedUser, (u) => u.name.length > 0);

// Usage
class User extends ValidatableUser {
  constructor(public name: string) {
    super();
  }
}
```

### Object Spread Composition

```typescript
// Compose objects
const withDefaults = <T extends object>(defaults: T) => 
  (partial: Partial<T>): T => ({ ...defaults, ...partial });

const defaultConfig = {
  timeout: 5000,
  retries: 3,
  apiUrl: "https://api.example.com",
};

const createConfig = withDefaults(defaultConfig);

// Usage
const config = createConfig({ timeout: 10000 });
// { timeout: 10000, retries: 3, apiUrl: "https://api.example.com" }
```

## Strategy Pattern

```typescript
// Define strategy interface
interface ValidationStrategy<T> {
  validate(value: T): boolean;
  getErrorMessage(): string;
}

// Implement strategies
class EmailValidation implements ValidationStrategy<string> {
  validate(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  getErrorMessage(): string {
    return "Invalid email format";
  }
}

class LengthValidation implements ValidationStrategy<string> {
  constructor(private min: number, private max: number) {}
  
  validate(value: string): boolean {
    return value.length >= this.min && value.length <= this.max;
  }
  getErrorMessage(): string {
    return `Length must be between ${this.min} and ${this.max}`;
  }
}

// Compose strategies
class Validator<T> {
  private strategies: ValidationStrategy<T>[] = [];
  
  addStrategy(strategy: ValidationStrategy<T>): this {
    this.strategies.push(strategy);
    return this;
  }
  
  validate(value: T): { valid: boolean; errors: string[] } {
    const errors = this.strategies
      .filter(s => !s.validate(value))
      .map(s => s.getErrorMessage());
    
    return { valid: errors.length === 0, errors };
  }
}

// Usage
const validator = new Validator<string>()
  .addStrategy(new EmailValidation())
  .addStrategy(new LengthValidation(5, 50));

const result = validator.validate("test@example.com");
```

## Chain of Responsibility

```typescript
// Handler interface
interface Handler<T, R> {
  setNext(handler: Handler<T, R>): Handler<T, R>;
  handle(request: T): R | null;
}

// Abstract handler
abstract class AbstractHandler<T, R> implements Handler<T, R> {
  private nextHandler?: Handler<T, R>;
  
  setNext(handler: Handler<T, R>): Handler<T, R> {
    this.nextHandler = handler;
    return handler;
  }
  
  handle(request: T): R | null {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    return null;
  }
}

// Concrete handlers
class AuthenticationHandler extends AbstractHandler<Request, Response> {
  handle(request: Request): Response | null {
    if (!request.headers.authorization) {
      return { status: 401, body: "Unauthorized" };
    }
    return super.handle(request);
  }
}

class ValidationHandler extends AbstractHandler<Request, Response> {
  handle(request: Request): Response | null {
    if (!request.body) {
      return { status: 400, body: "Missing body" };
    }
    return super.handle(request);
  }
}

// Usage
const auth = new AuthenticationHandler();
const validation = new ValidationHandler();
auth.setNext(validation);

const response = auth.handle(request);
```

## Decorator Pattern

```typescript
// Component interface
interface Component {
  execute(): string;
}

// Concrete component
class DataService implements Component {
  execute(): string {
    return "Data from service";
  }
}

// Decorator base
class DataServiceDecorator implements Component {
  constructor(protected service: Component) {}
  
  execute(): string {
    return this.service.execute();
  }
}

// Concrete decorators
class LoggingDecorator extends DataServiceDecorator {
  execute(): string {
    console.log("Before execute");
    const result = super.execute();
    console.log("After execute");
    return result;
  }
}

class CachingDecorator extends DataServiceDecorator {
  private cache: Map<string, string> = new Map();
  
  execute(): string {
    const cached = this.cache.get("data");
    if (cached) return cached;
    
    const result = super.execute();
    this.cache.set("data", result);
    return result;
  }
}

// Usage
let service: Component = new DataService();
service = new LoggingDecorator(service);
service = new CachingDecorator(service);

const result = service.execute();
```

## Dependency Injection Container

```typescript
// Token for registration
const TYPES = {
  UserRepository: Symbol("UserRepository"),
  EmailService: Symbol("EmailService"),
  Logger: Symbol("Logger"),
} as const;

// Container
class Container {
  private services = new Map<symbol, any>();
  
  register<T>(token: symbol, factory: () => T): void {
    this.services.set(token, factory);
  }
  
  resolve<T>(token: symbol): T {
    const factory = this.services.get(token);
    if (!factory) throw new Error(`Service not found: ${token.toString()}`);
    return factory();
  }
}

// Usage
const container = new Container();

container.register(TYPES.Logger, () => new ConsoleLogger());
container.register(TYPES.UserRepository, () => new UserRepository(
  container.resolve(TYPES.Logger)
));
container.register(TYPES.UserService, () => new UserService(
  container.resolve(TYPES.UserRepository),
  container.resolve(TYPES.EmailService)
));

// Resolve
const userService = container.resolve(TYPES.UserService);
```

## Best Practices

1. **Prefer composition over inheritance** - More flexible, less coupling
2. **Use interfaces for contracts** - Enables easy mocking in tests
3. **Single responsibility** - Small, focused functions/components
4. **Dependency injection** - Makes testing and swapping implementations easy
5. **Type safety** - Leverage TypeScript's type system for composition safety