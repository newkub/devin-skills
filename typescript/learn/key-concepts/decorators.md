# Decorators

## Overview

Decorators เป็น experimental feature ใน TypeScript ที่ช่วยให้ modify behavior ของ classes, methods, properties และ parameters

## Enabling Decorators

ต้อง enable experimental decorators ใน `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Class Decorators

```typescript
function sealed(target: Function) {
  Object.seal(target);
  Object.seal(target.prototype);
}

@sealed
class BugReport {
  type: string = "report";
}
```

## Method Decorators

```typescript
function readonly(
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  descriptor.writable = false;
}

class Calculator {
  @readonly
  add(a: number, b: number): number {
    return a + b;
  }
}
```

## Property Decorators

```typescript
function format(target: Object, key: string) {
  let value: string = (target as any)[key];
  
  Object.defineProperty(target, key, {
    get: () => value,
    set: (v: string) => {
      value = v.toUpperCase();
    },
  });
}

class Greeter {
  @format
  message: string = "Hello";
}
```

## Parameter Decorators

```typescript
function required(
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number
) {
  // implementation
}

class Greeter {
  greet(@required name: string, greeting?: string) {
    // ...
  }
}
```

## Decorator Factories

```typescript
function logger(message: string) {
  return function(target: Function) {
    console.log(`Logger: ${message}`);
  };
}

@logger("Application started")
class App {}
```

## Common Use Cases

- **Dependency Injection** - Angular, NestJS
- **Validation** - class-validator
- **Routing** - Express decorators
- **Logging** - method/function tracing
- **ORM** - TypeORM, Sequelize

## Best Practices

1. ใช้ decorator factories สำหรับ configuration
2. เขียน decorator ที่ composable
3. Document decorator API อย่างชัดเจน
4. ใช้ `Reflect.metadata` สำหรับ metadata reflection