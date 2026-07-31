# Design Patterns

## รูปแบบการออกแบบ

Design patterns เป็น solutions ที่ใช้ซ้ำได้สำหรับปัญหาที่พบบ่อยใน software design

### Creational Patterns

**Factory Method**: Create objects without specifying exact class

```typescript
interface IProduct {}
class ConcreteProductA implements IProduct {}
class ConcreteProductB implements IProduct {}

interface IFactory {
  createProduct(): IProduct;
}

class FactoryA implements IFactory {
  createProduct(): IProduct {
    return new ConcreteProductA();
  }
}
```

**Builder**: Construct complex objects step by step

```typescript
class House {
  public walls: string = '';
  public roof: string = '';
}

class HouseBuilder {
  private house: House = new House();
  
  buildWalls(walls: string): this {
    this.house.walls = walls;
    return this;
  }
  
  buildRoof(roof: string): this {
    this.house.roof = roof;
    return this;
  }
  
  build(): House {
    return this.house;
  }
}
```

### Structural Patterns

**Adapter**: Convert interface of class into another interface

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

**Decorator**: Add behavior dynamically

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
```

### Behavioral Patterns

**Strategy**: Define family of algorithms, encapsulate each

```typescript
interface IStrategy {
  execute(): void;
}

class StrategyA implements IStrategy {
  execute(): void {
    console.log('Strategy A');
  }
}

class Context {
  private strategy: IStrategy;
  
  constructor(strategy: IStrategy) {
    this.strategy = strategy;
  }
  
  setStrategy(strategy: IStrategy): void {
    this.strategy = strategy;
  }
  
  executeStrategy(): void {
    this.strategy.execute();
  }
}
```

**Observer**: Define one-to-many dependency

```typescript
interface IObserver {
  update(message: string): void;
}

interface ISubject {
  attach(observer: IObserver): void;
  detach(observer: IObserver): void;
  notify(message: string): void;
}

class Subject implements ISubject {
  private observers: IObserver[] = [];
  
  attach(observer: IObserver): void {
    this.observers.push(observer);
  }
  
  detach(observer: IObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }
  
  notify(message: string): void {
    for (const observer of this.observers) {
      observer.update(message);
    }
  }
}
```
