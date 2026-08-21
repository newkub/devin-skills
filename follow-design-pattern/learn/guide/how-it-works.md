# How It Works

## Purpose

อธิบายกลไกการทำงานของ Design Patterns หลัก เพื่อให้เข้าใจว่าแต่ละ pattern ทำงานอย่างไร

## Scope

- Creational Patterns Mechanism
- Structural Patterns Mechanism
- Behavioral Patterns Mechanism

## Creational Patterns

### Singleton

```text
┌─────────────────────────────────────────────┐
│              Singleton Class                 │
├─────────────────────────────────────────────┤
│  - instance: static Singleton               │
│  - constructor(): private                   │
│  + getInstance(): static Singleton          │
└─────────────────────────────────────────────┘
                      │
                      ▼
              ┌───────────────┐
              │  return instance │
              │  (create if null) │
              └───────────────┘
```

**Flow:**
1. Client เรียก `getInstance()`
2. ตรวจสอบว่า instance มีหรือยัง
3. ถ้ายัง → สร้าง instance ใหม่
4. ถ้ามีแล้ว → return existing instance

### Factory Method

```text
┌──────────────────┐         creates          ┌──────────────────┐
│   Creator        │ ──────────────────────> │    Product        │
├──────────────────┤                          ├──────────────────┤
│ + factoryMethod()│                          │ + operation()     │
└──────────────────┘                          └──────────────────┘
         │                                            ▲
         │ implements                                │ extends
         ▼                                            │
┌──────────────────┐                                 │
│ ConcreteCreator  │                                 │
├──────────────────┤                                 │
│ + factoryMethod()│ ───────────────────────────────>│
└──────────────────┘         returns                 └──────────────────┘
                                                          │
                                                    ┌──────────────┐
                                                    │ConcreteProduct│
                                                    └──────────────┘
```

### Builder

```text
Client                                          Director
  │                                              │
  ├─ createBuilder() ─────────────────────────>   │
  │                                              │
  │  ┌──────────────────────────────────────┐   │
  │  │           Builder Interface            │   │
  │  ├──────────────────────────────────────┤   │
  │  │ + buildPartA()                       │   │
  │  │ + buildPartB()                       │   │
  │  │ + getResult(): Product               │   │
  │  └──────────────────────────────────────┘   │
  │                                              │
  ├─ construct() ─────────────────────> Builder │
  │                                              │
  │  Part A ──────> Part B ──────> Product      │
  │                                              │
  └─ getProduct() <─────────────────────────────┘
```

## Structural Patterns

### Adapter

```text
┌──────────────┐         uses          ┌──────────────┐
│    Client    │ ────────────────────> │   Target     │
└──────────────┘                       └──────┬───────┘
                                              │ asks
                                              ▼
                                    ┌──────────────────┐
                                    │      Adapter     │
                                    ├──────────────────┤
                                    │ - adaptee: Adaptee│
                                    │ + request()      │
                                    └────────┬─────────┘
                                             │ translates
                                             ▼
                                    ┌──────────────────┐
                                    │     Adaptee      │
                                    └──────────────────┘
```

### Decorator

```text
┌────────────┐
│ Component  │  ← interface
└─────┬──────┘
      │ implements
      ▼
┌────────────┐              ┌────────────┐
│  Concrete  │              │  Decorator │
│  Component │              ├────────────┤
└────────────┘              │ - wrapped  │
                            │ + operation()│
                            │   → wrapped │
                            │     .op()   │
                            └──────┬───────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
              ┌──────────┐  ┌──────────┐  ┌──────────┐
              │DecoratorA│  │DecoratorB│  │DecoratorC│
              └──────────┘  └──────────┘  └──────────┘
```

### Facade

```text
Client                         Facade
  │                              │
  ├─ simpleMethod() ──────────────┤
  │                              │
  │                         ┌────┴────────────────┐
  │                         │   Complex Subsystem   │
  │                         ├─────────────────────┤
  │                         │ - subsystemClass1    │
  │                         │ - subsystemClass2    │
  │                         │ - subsystemClass3    │
  │                         └─────────────────────┘
  │                              │
  └──────────────────────────────┘
           Coordinates internal classes
```

## Behavioral Patterns

### Observer

```text
Subject                          Observer
    │                               │
    ├─ attach(observer) ────────────│
    │                               │
    ├─ detach(observer)             │
    │                               │
    ├─ notify()                     │
    │   │                           │
    │   ▼                           │
    │ ┌───────────────────────┐    │
    │ │ for each observer:     │    │
    │ │   observer.update()    │────
    │ └───────────────────────┘    │
    │                               │
    └─ getState() ◄─────────────────┘
              update() gets called
```

### Strategy

```text
Context                          Strategy Interface
    │                               │
    ├─ setStrategy(s)               │
    │                               │
    ├─ execute() ──────────────────►│
    │                               │
    │                         ┌──────┴──────┐
    │                         │             │
    │                         ▼             ▼
                    ┌─────────────┐ ┌─────────────┐
                    │ Strategy A  │ │ Strategy B  │
                    ├─────────────┤ ├─────────────┤
                    │ + execute() │ │ + execute() │
                    └─────────────┘ └─────────────┘
```

### Command

```text
Invoker                      Command Interface
    │                               │
    ├─ setCommand(c)                │
    │                               │
    ├─ execute() ──────────────────►│
    │                               │
    │                         ┌──────┴──────┐
    │                         │             │
    │                         ▼             ▼
                    ┌─────────────┐ ┌─────────────┐
                    │ ConcreteCmd │ │ ConcreteCmd │
                    ├─────────────┤ ├─────────────┤
                    │ - receiver  │ │ - receiver  │
                    │ + execute() │ │ + execute() │
                    └──────┬──────┘ └──────┬──────┘
                           │               │
                           └───────┬───────┘
                                   ▼
                             ┌───────────┐
                             │  Receiver │
                             └───────────┘
```

## Pattern Relationships

```
Creational ──► Structural ──► Behavioral
    │              │               │
    │              │               │
 Singleton    Adapter          Observer
 Factory      Decorator        Strategy
 Builder      Facade           Command
 Prototype    Composite        State
              Proxy            Chain
```

## When Each Pattern Works

| Pattern | Mechanism | Use When |
|---------|-----------|----------|
| **Singleton** | Global instance | Only one instance needed |
| **Factory Method** | Subclass creates | Extend product types |
| **Builder** | Step-by-step build | Complex object construction |
| **Adapter** | Interface translation | Incompatible interfaces |
| **Decorator** | Wrapper adds behavior | Extend without subclassing |
| **Facade** | Simplify subsystem | Complex system interface |
| **Observer** | Event notification | One-to-many dependency |
| **Strategy** | Interchangeable algorithms | Multiple algorithms needed |
| **Command** | Encapsulate request | Queue, undo, logging |
