# Features

## Modern JavaScript (ES6+) Features

### 1. Destructuring

```javascript
// Object destructuring
const { name, age, city = "Bangkok" } = person;

// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];

// Function parameters
function greet({ name, surname }) {
  return `Hello, ${name} ${surname}`;
}
```

### 2. Spread & Rest

```javascript
// Spread in arrays
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];  // [1, 2, 3, 4, 5]

// Spread in objects
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };  // { a: 1, b: 2, c: 3 }

// Rest parameters
function sum(...args) {
  return args.reduce((a, b) => a + b, 0);
}
```

### 3. Template Literals

```javascript
const name = "Alice";
const greeting = `Hello, ${name}!`;
const multiline = `
  First line
  Second line
  ${1 + 2} equals three
`;
```

### 4. Optional Chaining

```javascript
const city = user?.address?.city ?? "Unknown";

// Nested property access
const street = data?.users?.[0]?.address?.street;
```

### 5. Nullish Coalescing

```javascript
const value = null ?? "default";  // "default"
const count = 0 ?? 10;            // 0 (only null/undefined)
```

### 6. Classes

```javascript
class Animal {
  #privateVar = "secret";
  static kingdom = "Animalia";
  
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  
  speak() {
    return `${this.name} barks`;
  }
}
```

### 7. Async/Await

```javascript
// Fetch with async/await
async function fetchUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error("Not found");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Parallel execution
const [users, posts] = await Promise.all([
  fetch("/api/users"),
  fetch("/api/posts")
]);
```

### 8. Proxy & Reflect

```javascript
const handler = {
  get(target, prop) {
    console.log(`Getting ${prop}`);
    return target[prop];
  },
  set(target, prop, value) {
    console.log(`Setting ${prop} to ${value}`);
    target[prop] = value;
    return true;
  }
};

const proxy = new Proxy({ name: "Alice" }, handler);
```

### 9. Symbols

```javascript
const sym = Symbol("description");
const obj = {
  [sym]: "value",
  regular: "normal"
};
```

### 10. Iterators & Generators

```javascript
// Generator
function* numberGen() {
  yield 1;
  yield 2;
  yield 3;
}

for (const num of numberGen()) {
  console.log(num);
}

// Custom iterator
const iterable = {
  *[Symbol.iterator]() {
    yield "a";
    yield "b";
    yield "c";
  }
};
```

## Feature Comparison

| Feature | Description | Use Case |
|---------|-------------|----------|
| Destructuring | Extract values from objects/arrays | Cleaner variable assignment |
| Spread/Rest | Expand or collect elements | Immutable updates |
| Classes | OOP syntax | Organized code structure |
| Async/Await | Async operations | API calls, I/O |
| Proxy | Intercept operations | Validation, logging |
| Generators | Lazy iteration | Large data processing |