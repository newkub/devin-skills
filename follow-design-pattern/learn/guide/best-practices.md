# Best Practices

## Purpose

แนวทางปฏิบัติที่ดีที่สุดสำหรับการใช้งาน Design Patterns อย่างมีประสิทธิภาพ

## Scope

- Pattern Usage Guidelines
- Common Mistakes
- Anti-Patterns to Avoid
- Performance Considerations

## Pattern Usage Guidelines

### Do's

| Practice | Description |
|----------|-------------|
| **Start Simple** | Use pattern when it solves real problem |
| **Know Your Problem** | Understand problem before choosing pattern |
| **Follow SOLID** | Use patterns that respect SOLID principles |
| **Document Intent** | Comment why pattern is used |
| **Prefer Composition** | Favor composition over inheritance |
| **Test Patterns** | Write unit tests for pattern implementations |

### Don'ts

| Practice | Description |
|----------|-------------|
| **Force Patterns** | Don't use pattern just to use it |
| **Over-Engineer** | Simple solutions for simple problems |
| **Ignore Context** | Consider team skills and project constraints |
| **Premature Generalize** | Don't over-abstract for future needs |
| **Mix Patterns Randomly** | Combine patterns thoughtfully |

## Common Mistakes

### 1. Singleton Overuse

| Problem | Solution |
|---------|----------|
| Global state | Use dependency injection |
| Testing difficulty | Create interfaces for mocking |
| Tight coupling | Consider factory + DI |

```typescript
// ❌ Bad: Direct singleton
const config = Config.getInstance();

// ✅ Better: Dependency injection
class Service {
  constructor(private config: IConfig) {}
}
```

### 2. Pattern Worship

| Problem | Solution |
|---------|----------|
| Using patterns everywhere | KISS - Keep It Simple |
| Complex implementations | Start simple, refactor when needed |
| Over-abstraction | YAGNI - You Aren't Gonna Need It |

### 3. Factory Overuse

| Problem | Solution |
|---------|----------|
| Unnecessary indirection | Direct instantiation when simple |
| Hard to trace | Use when polymorphism needed |

## Anti-Patterns

| Anti-Pattern | Description | Fix |
|--------------|-------------|-----|
| **God Class** | Single class does everything | Split into smaller classes |
| **Shotgun Surgery** | One change requires many changes | Use mediator, facade |
| **Parallel Hierarchies** | Duplicate class trees | Use composition |
| **Refused Bequest** | Inherit unused methods | Use delegation |
| **Swiss Army Knife** | One class does everything | Use single responsibility |

## Pattern-Specific Best Practices

### Singleton

| Do | Don't |
|----|-------|
| Use lazy initialization | Initialize eagerly unless needed |
| Make thread-safe | Ignore thread safety |
| Limit global state | Use for config only |

### Factory Method

| Do | Don't |
|----|-------|
| Return interface type | Return concrete class |
| Keep factory focused | Make factory do too much |
| Use for polymorphism | Use for simple creation |

### Observer

| Do | Don't |
|----|-------|
| Unsubscribe in cleanup | Leak observers |
| Use weak references | Prevent garbage collection |
| Batch updates | Notify too frequently |

### Strategy

| Do | Don't |
|----|-------|
| Keep strategies small | Create fat strategies |
| Use consistent interface | Change strategy interface |
| Compose strategies | Nest strategies deeply |

### Command

| Do | Don't |
|----|-------|
| Keep commands simple | Complex command logic |
| Support undo/redo | Forget state management |
| Use command queue | Execute directly always |

## Performance Considerations

| Pattern | Impact | Mitigation |
|---------|--------|------------|
| **Observer** | Memory for subscribers | Unsubscribe, use weak refs |
| **Flyweight** | Complexity | Use only when needed |
| **Decorator** | Call stack depth | Limit decorator chain |
| **Composite** | Traversal overhead | Cache results when possible |

## Testing Patterns

| Pattern | Testing Approach |
|---------|-----------------|
| **Singleton** | Mock interface, test instance |
| **Factory** | Test product creation |
| **Strategy** | Test each strategy |
| **Observer** | Test notification, unsubscribe |
| **Command** | Test execute, undo operations |

## Refactoring to Patterns

| From | To | When |
|------|-----|------|
| Magic numbers | Constants | Values repeated |
| Long methods | Strategy/Command | Multiple behaviors |
| Complex conditionals | State/Strategy | Multiple states/algorithms |
| Duplicated code | Template Method | Similar with variations |

## Team Considerations

| Aspect | Recommendation |
|--------|----------------|
| **Knowledge** | Document patterns used |
| **Consistency** | Follow team conventions |
| **Code Review** | Review pattern usage |
| **Onboarding** | Explain patterns to new members |

## Summary Checklist

- [ ] Use pattern when solving real problem
- [ ] Keep implementations simple
- [ ] Follow SOLID principles
- [ ] Document pattern usage
- [ ] Write tests for patterns
- [ ] Avoid anti-patterns
- [ ] Consider team skills
- [ ] Refactor when complexity grows

## Next Steps

| File | Description |
|------|-------------|
| [integration.md](integration.md) | Combining patterns |
| [how-it-works.md](how-it-works.md) | Pattern mechanics |
