---
name: follow-object-oriented-programming
description: พัฒนาโปรเจกต์ด้วย OOP principles พร้อม encapsulation, inheritance, polymorphism
---

## Goal

พัฒนาโปรเจกต์ด้วย object-oriented programming principles เพื่อเพิ่มความสามารถในการ reuse, maintainability และ scalability

## Execute

### 1. Use Encapsulation

ใช้ encapsulation เพื่อซ่อน implementation details

1. ใช้ private fields สำหรับ internal state
2. ใช้ #private syntax สำหรับ hard private fields
3. ใช้ protected สำหรับ subclass access
4. ใช้ public สำหรับ external API เท่านั้น
5. ใช้ getters/setters สำหรับ controlled access
6. ใช้ utility types: Pick, Omit, Readonly, NonNullable

### 2. Use Inheritance

ใช้ inheritance สำหรับ code reuse และ hierarchy

1. ใช้ interfaces สำหรับ contracts
2. ใช้ extends สำหรับ class inheritance
3. ใช้ implements สำหรับ interface implementation
4. ใช้ abstract classes สำหรับ base implementations
5. ใช้ union types สำหรับ multiple inheritance scenarios
6. ใช้ intersection types สำหรับ combining types
7. ใช้ type guards สำหรับ narrowing

### 3. Use Polymorphism

ใช้ polymorphism สำหรับ flexible behavior

1. ใช้ generics สำหรับ type-safe polymorphism
2. ใช้ method overloading สำหรับ multiple signatures
3. ใช้ interface-based polymorphism
4. ใช้ decorator pattern สำหรับ runtime behavior
5. ใช้ composition over inheritance เมื่อเหมาะสม
6. ใช้ Partial สำหรับ optional properties

### 4. Design Classes

ออกแบบ classes ตาม OOP principles

1. Single responsibility per class
2. ใช้ meaningful class names
3. Group related data and behavior
4. ใช้ constructors สำหรับ initialization
5. ใช้ methods สำหรับ behavior
6. ใช้ static members สำหรับ class-level data

### 5. Manage State

จัดการ state ใน objects

1. ใช้ readonly สำหรับ immutable state
2. ใช้ Object.freeze สำหรับ runtime immutability
3. ใช้ private fields สำหรับ encapsulation
4. ใช้ getters สำหรับ computed values
5. ใช้ setters สำหรับ validation
6. Avoid shared mutable state

### 6. Use Composition

ใช้ composition เมื่อเหมาะสมกว่า inheritance

1. ใช้ has-a relationships เมื่อเหมาะสม
2. ใช้ dependency injection
3. ใช้ decorator pattern สำหรับ extending behavior
4. ใช้ composition root สำหรับ wiring dependencies
5. หลีกเลี่ยง deep inheritance hierarchies

### 7. Type Safety

ใช้ TypeScript เพื่อเพิ่มความปลอดภัยของ OOP

1. ใช้ interfaces สำหรับ contracts
2. ใช้ type guards สำหรับ narrowing
3. ใช้ this typing สำหรับ fluent APIs
4. ใช้ instanceof สำหรับ runtime checks
5. ใช้ discriminated unions สำหรับ complex types
6. Avoid any และ unknown

### 8. Testing

เขียน tests สำหรับ OOP code

1. Test public interfaces เท่านั้น
2. Mock dependencies ด้วย interfaces
3. Test inheritance hierarchies
4. Test polymorphic behavior
5. Use dependency injection สำหรับ testability

## Rules

### Encapsulation

ซ่อน implementation details อย่างเหมาะสม

- ใช้ `private/#private` สำหรับ internal state
- ใช้ `protected` สำหรับ subclasses
- ใช้ `public` สำหรับ API เท่านั้น
- ใช้ `getters/setters` สำหรับ controlled access
- ใช้ `utility types` สำหรับ type constraints
- Avoid exposing `internal state`

### Inheritance

ใช้ inheritance อย่างเหมาะสม

- ใช้ `interfaces` สำหรับ contracts
- ใช้ `abstract classes` สำหรับ base implementations
- หลีกเลี่ยง `deep hierarchies`
- ใช้ `composition` เมื่อเหมาะสม
- ใช้ `type guards` สำหรับ narrowing
- Favor `composition` over inheritance

### Polymorphism

ใช้ polymorphism สำหรับ flexibility

- ใช้ `generics` สำหรับ type safety
- ใช้ `interfaces` สำหรับ polymorphic behavior
- ใช้ `method overloading` อย่างระมัดระวัง
- ใช้ `decorator pattern` สำหรับ runtime behavior
- ใช้ `union/intersection types` อย่างเหมาะสม
- Keep `polymorphism` predictable

### Class Design

ออกแบบ classes ให้มีคุณภาพ

- `Single responsibility`
- `Meaningful names`
- Cohesive data and behavior
- Proper `constructors`
- Clear `public API`
- Avoid `god classes`

### State Management

จัดการ state อย่างปลอดภัย

- ใช้ `readonly` สำหรับ immutability
- ใช้ `private fields` สำหรับ encapsulation
- ใช้ `getters` สำหรับ computed values
- ใช้ `setters` สำหรับ validation
- Avoid `shared mutable state`
- Prefer `immutable state`

### Composition

ใช้ composition เมื่อเหมาะสม

- ใช้ `has-a relationships`
- ใช้ `dependency injection`
- ใช้ `decorator pattern`
- หลีกเลี่ยง `deep inheritance`
- ใช้ `composition root`
- Favor `composition` over inheritance

### Type Safety

ใช้ TypeScript เพื่อความปลอดภัย

- ใช้ `interfaces` สำหรับ contracts
- ใช้ `type guards`
- ใช้ `this typing`
- ใช้ `instanceof`
- ใช้ `discriminated unions`
- Avoid `any/unknown`

## Expected Outcome

- Well-encapsulated classes
- Appropriate use of inheritance
- Flexible polymorphic behavior
- Single responsibility classes
- Safe state management
- Proper composition patterns
- Type-safe OOP code
- Testable object-oriented design
