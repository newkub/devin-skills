# Configuration

## Purpose

แนวทางการเลือกใช้ Design Patterns ตาม context และเงื่อนไขต่างๆ

## Pattern Selection Criteria

### By Problem Type

| Problem | Recommended Patterns |
|---------|---------------------|
| Object Creation | Singleton, Factory Method, Abstract Factory, Builder, Prototype |
| Object Structure | Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy |
| Object Behavior | Chain of Responsibility, Command, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor, Interpreter |

### By Code Complexity

| Complexity | Recommended Patterns |
|------------|---------------------|
| Low | Singleton, Factory Method, Strategy, Observer |
| Medium | Builder, Decorator, Command, State |
| High | Abstract Factory, Flyweight, Memento, Visitor |

### By Flexibility Need

| Flexibility | Pattern |
|-------------|---------|
| Runtime selection | Strategy, State, Observer |
| Compile-time selection | Factory Method, Abstract Factory |
| Hybrid | Decorator, Adapter |

## Context-Based Selection

### Web Application

| Layer | Recommended Patterns |
|-------|---------------------|
| Data Access | Repository, Unit of Work |
| Business Logic | Strategy, Command, State |
| Presentation | Observer, MVC, MVP, MVVM |
| Cross-cutting | Decorator (logging), Proxy (caching) |

### Backend Services

| Scenario | Pattern |
|----------|---------|
| Microservices | Facade, Adapter, Observer |
| Event-driven | Observer, Mediator, Chain of Responsibility |
| Workflow | State, Chain of Responsibility |
| Data processing | Pipeline, Chain of Responsibility |

### Library/Framework

| Purpose | Pattern |
|---------|---------|
| Extensibility | Template Method, Strategy, Observer |
| Reusability | Factory Method, Builder, Prototype |
| Maintainability | Facade, Adapter, Decorator |

## Anti-Pattern Checklist

| Question | If Yes → Consider |
|----------|------------------|
| Do you really need a pattern? | Simpler solution first |
| Is the pattern over-engineering? | Simplify |
| Does pattern add complexity? | Alternative approach |
| Is pattern forced into design? | Remove unnecessary pattern |
| Do developers understand pattern? | Documentation needed |

## Selection Flowchart

```
START: What do you need?
          │
          ▼
   Is object creation complex?
          │
    ┌─────┴─────┐
   Yes          No
    │            │
    ▼            ▼
Builder      What behavior?
Prototype    need?
    │            │
    ▼      ┌─────┴─────┐
Singleton   Need to      Need to
Factory     extend?     communicate?
    │            │            │
    ▼            ▼            ▼
Abstract    Decorator   Observer
Factory     Adapter     Mediator
                     │
                     ▼
              Command
```

## Pattern Combination Guide

| Combination | Use Case |
|-------------|----------|
| Factory + Strategy | Configurable object creation with swappable algorithms |
| Observer + Mediator | Complex event coordination |
| Decorator + Builder | Dynamic configuration building |
| Command + Memento | Undo with state capture |
| Composite + Visitor | Tree operations |

## When NOT to Use

| Situation | Reason |
|----------|--------|
| Simple code | Patterns add unnecessary complexity |
| Team unfamiliar | Documentation overhead |
| Over-engineering | KISS principle violation |
| Premature optimization | YAGNI violation |

## Next Steps

| File | Description |
|------|-------------|
| [quick-start.md](quick-start.md) | Quick implementation guide |
| [best-practices.md](best-practices.md) | Pattern usage best practices |
