# Quick Start

## Purpose

แนวทางลัดสำหรับเลือกและ implement Design Patterns ที่เหมาะสมกับปัญหาที่พบบ่อย

## Scope

- Common Use Cases
- Pattern Selection by Scenario
- Minimal Implementation Examples

## Quick Selection Guide

### Use Case → Pattern Mapping

| Scenario | Pattern | Why |
|----------|---------|-----|
| Single config instance | Singleton | Global access, one instance |
| Create objects without specifying class | Factory Method | Subclass decides |
| Create families of related objects | Abstract Factory | Consistency across products |
| Build complex objects step by step | Builder | Fluent, readable construction |
| Clone existing objects | Prototype | Avoid expensive creation |
| Make existing classes work together | Adapter | Interface translation |
| Build complex hierarchies | Composite | Uniform treatment |
| Add behaviors dynamically | Decorator | Stackable wrappers |
| Simplify complex systems | Facade | Unified interface |
| Share common state efficiently | Flyweight | Memory optimization |
| Control expensive resource access | Proxy | Lazy loading, access control |
| Decouple sender from receivers | Command | Encapsulate requests |
| Keep objects in sync | Observer | Event-driven updates |
| Handle state transitions cleanly | State | State-specific behavior |
| Select algorithm at runtime | Strategy | Interchangeable algorithms |

## Minimal Examples

### Singleton (TypeScript)

```typescript
class Singleton {
  private static instance: Singleton;

  private constructor() {}

  static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}

// Usage
const s1 = Singleton.getInstance();
const s2 = Singleton.getInstance();
console.log(s1 === s2); // true
```

### Factory Method (TypeScript)

```typescript
interface Product {
  operation(): string;
}

abstract class Creator {
  abstract factoryMethod(): Product;

  someOperation(): string {
    const product = this.factoryMethod();
    return `Creator: ${product.operation()}`;
  }
}

class ConcreteProduct implements Product {
  operation(): string {
    return 'Result';
  }
}

class ConcreteCreator extends Creator {
  factoryMethod(): Product {
    return new ConcreteProduct();
  }
}
```

### Observer (TypeScript)

```typescript
interface Observer {
  update(message: string): void;
}

class Subject {
  private observers: Observer[] = [];

  attach(observer: Observer): void {
    this.observers.push(observer);
  }

  notify(message: string): void {
    this.observers.forEach(o => o.update(message));
  }
}
```

### Strategy (TypeScript)

```typescript
interface Strategy {
  execute(data: string[]): string;
}

class SortAsc implements Strategy {
  execute(data: string[]): string {
    return [...data].sort().join(', ');
  }
}

class SortDesc implements Strategy {
  execute(data: string[]): string {
    return [...data].sort().reverse().join(', ');
  }
}

class Context {
  constructor(private strategy: Strategy) {}

  setStrategy(strategy: Strategy): void {
    this.strategy = strategy;
  }

  doSomething(data: string[]): string {
    return this.strategy.execute(data);
  }
}
```

### Command (TypeScript)

```typescript
interface Command {
  execute(): void;
}

class SimpleCommand implements Command {
  constructor(private payload: string) {}

  execute(): void {
    console.log(`Executing: ${this.payload}`);
  }
}

class Invoker {
  private commands: Command[] = [];

  addCommand(command: Command): void {
    this.commands.push(command);
  }

  executeAll(): void {
    this.commands.forEach(c => c.execute());
  }
}
```

## Common Patterns by Language

### TypeScript/JavaScript

| Pattern | Best For |
|---------|----------|
| Factory Method | Class extension |
| Observer | Event systems |
| Strategy | Algorithm selection |
| Decorator | Middleware, wrappers |
| Command | Undo/redo, queues |

### React

| Pattern | Best For |
|---------|----------|
| Observer (HOC) | State management |
| Strategy (hooks) | Conditional rendering |
| Decorator | Higher-order components |
| Command | Action handlers |

## Decision Matrix

```
Your Need                    Pattern
─────────────────────────────────────────
One instance                 → Singleton
Create without specifying    → Factory Method
Build step by step           → Builder
Extend behavior             → Decorator
Decouple components          → Observer, Mediator
Select algorithm            → Strategy
Encapsulate request          → Command
Handle states               → State
Simplify interface          → Facade
```

## Next Steps

| Resource | Description |
|----------|-------------|
| [key-concept.md](key-concept.md) | Pattern classification |
| [how-it-works.md](how-it-works.md) | Pattern mechanics |
| [features.md](features.md) | All 23 patterns overview |
