# Integration

## Purpose

แนวทางการรวม Design Patterns หลายตัวเข้าด้วยกันและ architectural patterns ที่เกี่ยวข้อง

## Scope

- Pattern Combinations
- Architectural Patterns
- Real-World Integration Examples

## Pattern Combinations

### Factory + Strategy

**Use Case:** Object creation with swappable algorithms

```typescript
interface PaymentStrategy {
  process(amount: number): void;
}

class PaymentFactory {
  static create(type: string): PaymentStrategy {
    switch (type) {
      case 'credit': return new CreditStrategy();
      case 'debit': return new DebitStrategy();
      case 'crypto': return new CryptoStrategy();
    }
  }
}
```

### Observer + Mediator

**Use Case:** Complex event coordination in UI

```typescript
class UIMediator {
  private observers: Set<UIComponent> = new Set();

  notify(source: UIComponent, event: string): void {
    this.observers.forEach(comp => {
      if (comp !== source) comp.update(event);
    });
  }
}
```

### Command + Memento (Undo/Redo)

**Use Case:** Undo/Redo functionality

```typescript
class HistoryManager {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  execute(command: Command): void {
    command.execute();
    this.undoStack.push(command);
    this.redoStack = [];
  }

  undo(): void {
    const command = this.undoStack.pop();
    command.undo();
    this.redoStack.push(command);
  }
}
```

### Decorator + Builder

**Use Case:** Dynamic configuration building

```typescript
class RequestBuilder {
  private decorators: Middleware[] = [];

  addMiddleware(middleware: Middleware): this {
    this.decorators.push(middleware);
    return this;
  }

  build(): RequestHandler {
    let handler = this.initialHandler;
    for (const mw of this.decorators) {
      handler = mw.wrap(handler);
    }
    return handler;
  }
}
```

### Composite + Visitor

**Use Case:** Tree operations

```typescript
interface Visitor {
  visitFile(file: File): void;
  visitFolder(folder: Folder): void;
}

class FileSystemVisitor implements Visitor {
  visitFile(file: File): void { /* process file */ }
  visitFolder(folder: Folder): void {
    folder.children.forEach(child => child.accept(this));
  }
}
```

## Architectural Patterns

### MVC (Model-View-Controller)

| Component | Pattern | Responsibility |
|-----------|---------|----------------|
| Model | Domain logic | Data and business rules |
| View | Presentation | UI rendering |
| Controller | Request handling | Input processing |

```text
┌─────────────┐      updates       ┌─────────────┐
│    Model    │ ──────────────────> │    View     │
└─────────────┘                    └─────────────┘
      ▲                                 │
      │          modifies               │
      │ ─────────────────────────────► │
      │                                 │
┌─────────────┐      controls       ┌─────────────┐
│ Controller  │                    │    User     │
└─────────────┘                    └─────────────┘
```

### MVP (Model-View-Presenter)

| Component | Pattern | Responsibility |
|-----------|---------|----------------|
| Model | Data layer | Data access |
| View | UI interface | Display data |
| Presenter | Logic | Mediates between Model and View |

### MVVM (Model-View-ViewModel)

| Component | Pattern | Responsibility |
|-----------|---------|----------------|
| Model | Data | Business logic |
| View | UI | User interface |
| ViewModel | Binding | Exposes data, handles commands |

### Event-Driven Architecture

| Pattern | Use Case |
|---------|----------|
| Observer | Pub/Sub messaging |
| Mediator | Event coordination |
| Chain of Responsibility | Event pipeline |

## Real-World Examples

### 1. E-commerce Checkout

| Step | Patterns Used |
|------|---------------|
| Product selection | Factory Method |
| Cart management | Composite |
| Payment processing | Strategy |
| Order state tracking | State, Observer |
| Undo order changes | Command, Memento |

### 2. Web Framework

| Layer | Patterns Used |
|-------|---------------|
| Routing | Strategy, Chain of Responsibility |
| Middleware | Decorator, Chain of Responsibility |
| Error handling | Observer, Mediator |
| Caching | Proxy, Flyweight |

### 3. Game Engine

| System | Patterns Used |
|--------|---------------|
| Entity component | Composite |
| Rendering | Strategy |
| AI behavior | State, Strategy |
| Input handling | Observer, Command |
| Save/Load | Memento |

## Anti-Combination Patterns

| Combination | Problem | Solution |
|-------------|---------|----------|
| Singleton + Global State | Hard to test | Use DI |
| Factory + Over-abstraction | Complexity | Use direct instantiation |
| Decorator + Deep stacking | Performance | Limit chain depth |
| Command + Complex logic | Hard to maintain | Simplify commands |

## Pattern Selection by Context

| Context | Primary Pattern | Secondary Pattern |
|---------|-----------------|-------------------|
| Web API | Factory Method | Strategy |
| UI Framework | Observer | Mediator |
| Data Processing | Pipeline | Chain of Responsibility |
| State Management | State | Command |
| Testing | Dependency Injection | Mock objects |

## Summary

| Pattern Combination | Benefit |
|--------------------|---------|
| Factory + Strategy | Configurable object creation |
| Observer + Mediator | Complex event handling |
| Command + Memento | Undo/Redo functionality |
| Decorator + Builder | Dynamic configuration |
| Composite + Visitor | Tree traversal operations |

## Next Steps

| File | Description |
|------|-------------|
| [features.md](features.md) | All 23 GoF patterns |
| [best-practices.md](best-practices.md) | Pattern usage guidelines |