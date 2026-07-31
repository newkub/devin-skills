# Design Patterns

## 6. Use Patterns Appropriately

ใช้ patterns เมื่อจำเป็น ไม่ใช่ทุกอย่าง:

```typescript
// ✅ Good: Use pattern when appropriate
interface ILogger {
  log(message: string): void;
}

class Logger implements ILogger {
  log(message: string): void {
    console.log(message);
  }
}

// Singleton pattern makes sense for logger
class LoggerSingleton {
  private static instance: LoggerSingleton;
  private static lock: object = {};
  
  static getInstance(): LoggerSingleton {
    if (!LoggerSingleton.instance) {
      synchronized(LoggerSingleton.lock, () => {
        if (!LoggerSingleton.instance) {
          LoggerSingleton.instance = new LoggerSingleton();
        }
      });
    }
    return LoggerSingleton.instance;
  }
}

// ❌ Bad: Overuse patterns
class User {
  // Singleton doesn't make sense for user entities
  private static instance: User;
  static getInstance(): User { /* ... */ }
}
```

## 7. Prefer Composition Over Inheritance

ใช้ composition มากกว่า inheritance:

```typescript
// ✅ Good: Composition
class Flight {
  constructor(
    private booking: BookingSystem,
    private payment: PaymentSystem
  ) {}
}

// ❌ Bad: Deep inheritance
class Flight extends BookableFlight extends PayableFlight extends BaseFlight {}
```
