# Key Concept

## What are Design Patterns?

Design Patterns เป็นเว็บเซอร์วิสที่พิสูจน์แล้วสำหรับการแก้ปัญหาการออกแบบซอฟต์แวร์ที่พบบ่อย ช่วยให้นักพัฒนาสื่อสารและแก้ปัญหาได้อย่างมีประสิทธิภาพ

## Pattern Classification

### GoF (Gang of Four) Patterns

| Category | Count | Patterns |
|----------|-------|----------|
| **Creational** | 5 | Factory Method, Abstract Factory, Builder, Prototype, Singleton |
| **Structural** | 7 | Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy |
| **Behavioral** | 11 | Chain of Resp., Command, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor, Interpreter |

### Architectural Patterns

| Category | Examples |
|----------|----------|
| Application | MVC, MVP, MVVM |
| Integration | Event-Driven, Microservices, SOA |
| Distributed | CQRS, Event Sourcing |
| Messaging | Publisher/Subscriber, Message Queue |

## Core Design Principles

### SOLID Principles

| Principle | Description | Pattern Alignment |
|-----------|-------------|-------------------|
| **S**ingle Responsibility | คลาสควรมีหน้าที่เดียว | Facade, Strategy |
| **O**pen/Closed | เปิดสำหรับ extend, ปิดสำหรับ modify | Template Method, Observer |
| **L**iskov Substitution | Subclass ใช้แทน base class ได้ | Strategy, State |
| **I**nterface Segregation | แยก interfaces ให้เล็ก | Adapter, Facade |
| **D**ependency Inversion | พึ่ง abstractions, ไม่ใช่ concretions | Abstract Factory, Strategy |

### Other Principles

| Principle | Description |
|-----------|-------------|
| **DRY** | Don't Repeat Yourself |
| **KISS** | Keep It Simple, Stupid |
| **YAGNI** | You Aren't Gonna Need It |
| **LoD** | Law of Demeter ( Principle of Least Knowledge ) |

## Pattern Selection Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    Problem Definition                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   Are you creating objects?                                  │
│   ├── Yes → Creational Patterns                             │
│   │         ├── One object → Singleton/Prototype            │
│   │         ├── Factory → Factory Method                    │
│   │         └── Complex creation → Builder                 │
│   │                                                              │
│   └── No → What is your goal?                               │
│              ├── Structure → Structural Patterns             │
│              │         ├── Compatibility → Adapter          │
│              │         ├── Simplify interface → Facade     │
│              │         └── Add functionality → Decorator    │
│              │                                                     │
│              └── Behavior → Behavioral Patterns              │
│                        ├── Request handling → Chain/Command │
│                        ├── Communication → Observer/Mediator │
│                        └── Algorithm selection → Strategy   │
└──────────────────────────────────────────────────────────────┘
```

## When to Use Patterns

| Scenario | Recommended Pattern |
|----------|---------------------|
| Ensure single instance | Singleton |
| Create families of objects | Abstract Factory |
| Decouple sender/receiver | Command, Observer |
| Add behavior dynamically | Decorator, Strategy |
| Simplify complex subsystems | Facade |
| Share common state | Flyweight |
| Handle state transitions | State |
| Build objects step by step | Builder |

## Anti-Patterns

| Anti-Pattern | Description |
|--------------|-------------|
| **God Object** | คลาสที่รู้ทุกอย่างและทำทุกอย่าง |
| **Golden Hammer** | ใช้ pattern ที่รู้จักกับทุกปัญหา |
| **Pattern Overload** | ใช้ pattern มากเกินไปโดยไม่จำเป็น |
| **Speculative Generality** | ออกแบบสำหรับความต้องการที่ยังไม่มี |

## Comparison: Pattern Categories

| Aspect | Creational | Structural | Behavioral |
|--------|------------|------------|------------|
| **Focus** | Object creation | Object composition | Object interaction |
| **Problem** | How to create objects | How to compose objects | How objects communicate |
| **Complexity** | Low-Medium | Medium | Medium-High |
| **Flexibility** | Creation logic | Interface shaping | Behavior modification |