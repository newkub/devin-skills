# Behavioral Patterns

## Strategy

**Intent**: Define family of algorithms, encapsulate each

**When to use**:
- Many related classes differ only in behavior
- Need variants of algorithm

**Example**:

```typescript
interface ISortStrategy {
  sort(array: number[]): void;
}

class BubbleSort implements ISortStrategy {
  sort(array: number[]): void {
    /* bubble sort */
  }
}

class QuickSort implements ISortStrategy {
  sort(array: number[]): void {
    /* quick sort */
  }
}

class Sorter {
  private strategy: ISortStrategy;
  
  constructor(strategy: ISortStrategy) {
    this.strategy = strategy;
  }
  
  setStrategy(strategy: ISortStrategy): void {
    this.strategy = strategy;
  }
  
  sort(array: number[]): void {
    this.strategy.sort(array);
  }
}

// Usage
const sorter = new Sorter(new BubbleSort());
sorter.sort(array);
sorter.setStrategy(new QuickSort());
sorter.sort(array);
```

## Observer

**Intent**: Define one-to-many dependency

**When to use**:
- Change to object requires changing others
- Don't know how many objects need to be changed

**Example**:

```typescript
interface IObserver {
  update(message: string): void;
}

interface ISubject {
  attach(observer: IObserver): void;
  detach(observer: IObserver): void;
  notify(message: string): void;
}

class NewsAgency implements ISubject {
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

class NewsChannel implements IObserver {
  update(message: string): void {
    console.log(`News received: ${message}`);
  }
}

// Usage
const agency = new NewsAgency();
const channel1 = new NewsChannel();
const channel2 = new NewsChannel();

agency.attach(channel1);
agency.attach(channel2);
agency.notify('Breaking news!');
```

## Command

**Intent**: Encapsulate request as object

**When to use**:
- Parameterize objects with operations
- Queue operations, execute at different times

**Example**:

```typescript
interface ICommand {
  execute(): void;
  undo(): void;
}

class Light {
  on(): void {
    console.log('Light is on');
  }
  off(): void {
    console.log('Light is off');
  }
}

class LightOnCommand implements ICommand {
  constructor(private light: Light) {}
  
  execute(): void {
    this.light.on();
  }
  
  undo(): void {
    this.light.off();
  }
}

class RemoteControl {
  private command: ICommand;
  
  setCommand(command: ICommand): void {
    this.command = command;
  }
  
  pressButton(): void {
    this.command.execute();
  }
  
  pressUndo(): void {
    this.command.undo();
  }
}

// Usage
const light = new Light();
const command = new LightOnCommand(light);
const remote = new RemoteControl();
remote.setCommand(command);
remote.pressButton();
```
