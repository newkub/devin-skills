# Quick Start - TypeScript

## Hello World

```typescript
// src/index.ts
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet("World"));
```

```bash
tsc src/index.ts
node dist/index.js
```

## Variables

```typescript
// Explicit type
let name: string = "Alice";
let age: number = 30;
let isActive: boolean = true;

// Type inference
let city = "Bangkok";  // inferred as string

// Arrays
let nums: number[] = [1, 2, 3];
let names: Array<string> = ["a", "b"];

// Object
const user: { name: string; age: number } = {
  name: "Alice",
  age: 30
};
```

## Functions

```typescript
// Function declaration
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Optional parameters
function greet(name: string, greeting?: string): string {
  return `${greeting ?? "Hello"}, ${name}`;
}

// Rest parameters
function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}
```

## Interfaces

```typescript
interface User {
  name: string;
  age: number;
  email?: string;
}

function greetUser(user: User): string {
  return `Hello, ${user.name}!`;
}

const user: User = {
  name: "Alice",
  age: 30
};
```

## Classes

```typescript
class User {
  constructor(
    public name: string,
    private age: number
  ) {}

  greet(): string {
    return `I'm ${this.name}`;
  }

  getAge(): number {
    return this.age;
  }
}

const user = new User("Alice", 30);
```

## Running TypeScript

```bash
# Compile
tsc src/index.ts

# Watch mode
tsc --watch src/index.ts

# Run directly (with ts-node/tsx)
tsx src/index.ts
```

## Example: Todo List

```typescript
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

class TodoList {
  private todos: Todo[] = [];

  add(title: string): void {
    this.todos.push({
      id: Date.now(),
      title,
      completed: false
    });
  }

  toggle(id: number): void {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }

  list(): Todo[] {
    return this.todos;
  }
}

const todos = new TodoList();
todos.add("Learn TypeScript");
todos.add("Build a project");
console.log(todos.list());
```