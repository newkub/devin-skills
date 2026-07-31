# This Keyword

## Overview

`this` เป็น keyword พิเศษใน JavaScript ที่ reference ถึง object ปัจจุบันขึ้นอยู่กับ context การเรียกใช้

## What is This?

`this` ไม่ได้ reference ถึง function ที่ถูกประกาศ แต่ reference ถึง object ที่เรียก function นั้น

```javascript
const person = {
  name: 'John',
  greet: function() {
    console.log(`Hello, ${this.name}`);
  }
};

person.greet(); // Hello, John (this = person)
```

## This Binding Rules

### 1. Default Binding

เมื่อ function ถูกเรียกใน global mode ไม่มี object owner

```javascript
function showThis() {
  console.log(this);
}

showThis(); // window (browser) or global (Node.js)
```

**Strict Mode:**

```javascript
'use strict';

function showThis() {
  console.log(this);
}

showThis(); // undefined
```

### 2. Implicit Binding

เมื่อ function ถูกเรียกผ่าน object

```javascript
const obj = {
  value: 42,
  show: function() {
    console.log(this.value);
  }
};

obj.show(); // 42 (this = obj)
```

**Nested Objects:**

```javascript
const outer = {
  value: 'outer',
  inner: {
    value: 'inner',
    show: function() {
      console.log(this.value);
    }
  }
};

outer.inner.show(); // inner (this = inner object)
```

### 3. Explicit Binding

ใช้ `call()`, `apply()`, หรือ `bind()` เพื่อกำหนด `this` อย่างชัดเจน

#### call()

```javascript
function greet(greeting) {
  console.log(`${greeting}, ${this.name}`);
}

const person = { name: 'John' };

greet.call(person, 'Hello'); // Hello, John
```

#### apply()

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const person = { name: 'John' };

greet.apply(person, ['Hello', '!']); // Hello, John!
```

#### bind()

```javascript
function greet(greeting) {
  console.log(`${greeting}, ${this.name}`);
}

const person = { name: 'John' };
const boundGreet = greet.bind(person);

boundGreet('Hello'); // Hello, John
```

### 4. new Binding

เมื่อ function ถูกเรียกด้วย `new` keyword

```javascript
function Person(name) {
  this.name = name;
}

const john = new Person('John');
console.log(john.name); // John (this = new instance)
```

### 5. Arrow Function Binding

Arrow functions ไม่มี `this` ของตัวเอง แต่ inherit จาก outer scope

```javascript
const obj = {
  value: 42,
  regular: function() {
    console.log(this.value); // 42
  },
  arrow: () => {
    console.log(this.value); // undefined (inherits from outer)
  }
};

obj.regular(); // 42
obj.arrow(); // undefined
```

**Arrow Function in Methods:**

```javascript
const obj = {
  value: 42,
  show: function() {
    const arrow = () => {
      console.log(this.value); // 42 (inherits from show's this)
    };
    arrow();
  }
};

obj.show(); // 42
```

## Common Patterns

### 1. Method Chaining

```javascript
class Calculator {
  constructor(value = 0) {
    this.value = value;
  }
  
  add(n) {
    this.value += n;
    return this;
  }
  
  subtract(n) {
    this.value -= n;
    return this;
  }
  
  result() {
    return this.value;
  }
}

const calc = new Calculator(10);
console.log(calc.add(5).subtract(3).result()); // 12
```

### 2. Event Handlers

```javascript
const button = document.getElementById('myButton');

// ❌ this is button element
button.addEventListener('click', function() {
  console.log(this); // button element
});

// ✅ Use arrow function to access outer this
class App {
  constructor() {
    this.count = 0;
    const button = document.getElementById('myButton');
    button.addEventListener('click', () => {
      this.count++;
      console.log(this.count);
    });
  }
}
```

### 3. Constructor Functions

```javascript
function User(name, email) {
  this.name = name;
  this.email = email;
  
  this.greet = function() {
    console.log(`Hello, ${this.name}`);
  };
}

const user = new User('John', 'john@example.com');
user.greet(); // Hello, John
```

### 4. Borrowing Methods

```javascript
const person = {
  name: 'John',
  greet: function() {
    console.log(`Hello, ${this.name}`);
  }
};

const anotherPerson = { name: 'Jane' };

person.greet.call(anotherPerson); // Hello, Jane
```

## Common Pitfalls

### 1. Losing this in Callbacks

```javascript
const obj = {
  value: 42,
  show: function() {
    setTimeout(function() {
      console.log(this.value); // undefined (this changed)
    }, 100);
  }
};

// ✅ Solution 1: Arrow function
const obj = {
  value: 42,
  show: function() {
    setTimeout(() => {
      console.log(this.value); // 42
    }, 100);
  }
};

// ✅ Solution 2: bind
const obj = {
  value: 42,
  show: function() {
    setTimeout(function() {
      console.log(this.value); // 42
    }.bind(this), 100);
  }
};

// ✅ Solution 3: Capture this
const obj = {
  value: 42,
  show: function() {
    const self = this;
    setTimeout(function() {
      console.log(self.value); // 42
    }, 100);
  }
};
```

### 2. this in Nested Functions

```javascript
const obj = {
  value: 42,
  outer: function() {
    console.log(this.value); // 42
    
    function inner() {
      console.log(this.value); // undefined (default binding)
    }
    
    inner();
  }
};

// ✅ Use arrow function
const obj = {
  value: 42,
  outer: function() {
    console.log(this.value); // 42
    
    const inner = () => {
      console.log(this.value); // 42
    };
    
    inner();
  }
};
```

### 3. this with Array Methods

```javascript
const arr = [1, 2, 3];

// ❌ this is undefined in strict mode
arr.forEach(function(item) {
  console.log(this); // undefined
});

// ✅ Pass thisArg
arr.forEach(function(item) {
  console.log(this); // { context: 'data' }
}, { context: 'data' });
```

## Best Practices

### 1. Use Arrow Functions for Callbacks

```javascript
// ✅ Prefer arrow functions
class Component {
  constructor() {
    this.state = { count: 0 };
    
    // Arrow function preserves this
    this.handleClick = () => {
      this.state.count++;
    };
  }
}
```

### 2. Avoid this in Simple Functions

```javascript
// ❌ Unnecessary this
function process(data) {
  this.data = data;
}

// ✅ Use parameters
function process(data) {
  return data;
}
```

### 3. Use Classes for OOP

```javascript
// ✅ Classes handle this automatically
class Counter {
  constructor() {
    this.count = 0;
  }
  
  increment() {
    this.count++;
  }
}
```

### 4. Explicit Binding When Needed

```javascript
// ✅ Clear intent with bind
const boundFunction = originalFunction.bind(context);
```

## Related Concepts

- [Scope](./scope.md)
- [Closures](./closures.md)
- [Prototypes](./prototypes.md)
- [Classes](../guide/architecture.md)
