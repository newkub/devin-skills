# Structural Patterns

## Adapter

**Intent**: Convert interface of class into another interface

**When to use**:
- Need to use existing class with incompatible interface
- Want to create reusable class that cooperates with unrelated classes

**Example**:

```typescript
interface ITarget {
  request(): void;
}

class Adaptee {
  specificRequest() { /* ... */ }
}

class Adapter implements ITarget {
  private adaptee: Adaptee;
  
  constructor(adaptee: Adaptee) {
    this.adaptee = adaptee;
  }
  
  request(): void {
    this.adaptee.specificRequest();
  }
}
```

## Decorator

**Intent**: Add responsibilities dynamically

**When to use**:
- Add responsibilities to individual objects dynamically
- Withdraw responsibilities dynamically

**Example**:

```typescript
interface ICoffee {
  cost(): number;
  description(): string;
}

class SimpleCoffee implements ICoffee {
  cost(): number {
    return 1.0;
  }
  description(): string {
    return 'Simple coffee';
  }
}

class MilkDecorator implements ICoffee {
  private coffee: ICoffee;
  
  constructor(coffee: ICoffee) {
    this.coffee = coffee;
  }
  
  cost(): number {
    return this.coffee.cost() + 0.5;
  }
  
  description(): string {
    return this.coffee.description() + ', milk';
  }
}

class SugarDecorator implements ICoffee {
  private coffee: ICoffee;
  
  constructor(coffee: ICoffee) {
    this.coffee = coffee;
  }
  
  cost(): number {
    return this.coffee.cost() + 0.2;
  }
  
  description(): string {
    return this.coffee.description() + ', sugar';
  }
}

// Usage
const coffee = new SimpleCoffee();
const milkCoffee = new MilkDecorator(coffee);
const sweetCoffee = new SugarDecorator(milkCoffee);
```

## Facade

**Intent**: Provide unified interface to set of interfaces

**When to use**:
- Complex subsystem needs simple interface
- Want to layer subsystems

**Example**:

```typescript
class ComputerFacade {
  private cpu: CPU;
  private memory: Memory;
  private hardDrive: HardDrive;
  
  constructor() {
    this.cpu = new CPU();
    this.memory = new Memory();
    this.hardDrive = new HardDrive();
  }
  
  start(): void {
    this.cpu.freeze();
    this.memory.load(0x0000, this.hardDrive.read(0, 1024));
    this.cpu.jump(0x0000);
    this.cpu.execute();
  }
}

// Usage
const computer = new ComputerFacade();
computer.start();
```
