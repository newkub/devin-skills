# Type Assertions & Type Guards

## Type Assertions

TypeScript มีวิธีการ narrow type หลายรูปแบบ:

### as keyword

```typescript
const value: unknown = "hello";
const str: string = value as string;
```

### Angle bracket syntax

```typescript
const value: unknown = "hello";
const str: string = <string>value;
```

### Non-null assertion

```typescript
const element: HTMLElement | null = document.getElementById("app");
const el: HTMLElement = element!;
```

## Type Guards

### typeof

```typescript
function padLeft(value: string | number) {
  if (typeof value === "string") {
    return value + "...";
  }
  return String(value).padStart(4, "0");
}
```

### instanceof

```typescript
class Bird {
  fly() { console.log("flying"); }
}

class Fish {
  swim() { console.log("swimming"); }
}

function move(pet: Bird | Fish) {
  if (pet instanceof Bird) {
    pet.fly();
  } else {
    pet.swim();
  }
}
```

### in operator

```typescript
interface Car {
  drive(): void;
}

interface Boat {
  sail(): void;
}

function operate(vehicle: Car | Boat) {
  if ("drive" in vehicle) {
    vehicle.drive();
  }
}
```

### Custom type guard

```typescript
interface Fish {
  swim(): void;
}

function isFish(pet: Fish | any): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

## Discriminated Unions

```typescript
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  side: number;
}

type Shape = Circle | Square;

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
  }
}
```

## Best Practices

1. **หลีกเลี่ยง `as any`** - ใช้เมื่อจำเป็นจริงๆ
2. **ใช้ type guard functions** สำหรับ complex types
3. **ใช้ discriminated unions** สำหรับ union types ที่มี variants
4. **ใช้ `unknown` แทน `any`** เมื่อไม่ทราบ type ล่วงหน้า