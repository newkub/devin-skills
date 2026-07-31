# Creational Patterns

## Factory Method

**Intent**: Define interface for creating object, let subclasses decide

**When to use**:
- Cannot anticipate class of objects to create
- Want subclasses to specify objects to create

**Example**:

```typescript
// Creator
interface ILoggerFactory {
  createLogger(): ILogger;
}

class ConsoleLoggerFactory implements ILoggerFactory {
  createLogger(): ILogger {
    return new ConsoleLogger();
  }
}

class FileLoggerFactory implements ILoggerFactory {
  createLogger(): ILogger {
    return new FileLogger();
  }
}

// Usage
const factory: ILoggerFactory = new ConsoleLoggerFactory();
const logger: ILogger = factory.createLogger();
```

## Builder

**Intent**: Separate construction from representation

**When to use**:
- Complex objects with many parameters
- Different representations of construction process

**Example**:

```typescript
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
  
  buildWindows(windows: string): this {
    this.house.windows = windows;
    return this;
  }
  
  build(): House {
    return this.house;
  }
}

// Usage
const house = new HouseBuilder()
  .buildWalls('Brick')
  .buildRoof('Tile')
  .buildWindows('Glass')
  .build();
```

## Singleton

**Intent**: Ensure class has only one instance

**When to use**:
- Exactly one instance needed
- Global access point required

**Example**:

```typescript
class Logger {
  private static instance: Logger;
  private static lock: object = {};
  
  private constructor() {}
  
  static getInstance(): Logger {
    if (!Logger.instance) {
      synchronized(Logger.lock, () => {
        if (!Logger.instance) {
          Logger.instance = new Logger();
        }
      });
    }
    return Logger.instance;
  }
}
```
