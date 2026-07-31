# Prototypes

## Overview

Prototypes เป็นกลไกที่ JavaScript ใช้สำหรับ inheritance และ object sharing โดยทุก object ใน JavaScript มี prototype chain ที่เชื่อมโยงกัน

## ความหมาย

Prototype คือ object ที่ใช้เป็น template สำหรับสร้าง objects อื่น และทุก object ใน JavaScript มี internal property `[[Prototype]]` ที่ชี้ไปยัง prototype ของมัน

## Prototype Chain

```javascript
const person = {
  name: 'John',
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

const john = Object.create(person);
john.name = 'John Doe';

john.greet(); // 'Hello, I'm John Doe'
console.log(john.__proto__ === person); // true
```

## Object Creation

### 1. Object Literals

```javascript
const obj = { a: 1 };
console.log(obj.__proto__ === Object.prototype); // true
```

### 2. Object.create()

```javascript
const prototype = { greet() { console.log('Hello'); } };
const obj = Object.create(prototype);
obj.greet(); // 'Hello'
```

### 3. Constructor Functions

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  console.log(`Hello, I'm ${this.name}`);
};

const john = new Person('John');
john.greet(); // 'Hello, I'm John'
```

### 4. ES6 Classes

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
}

const john = new Person('John');
john.greet(); // 'Hello, I'm John'
```

## Prototype Methods

### Object.getPrototypeOf()

```javascript
const obj = {};
const proto = Object.getPrototypeOf(obj);
console.log(proto === Object.prototype); // true
```

### Object.setPrototypeOf()

```javascript
const obj = {};
const proto = { greet() { console.log('Hello'); } };
Object.setPrototypeOf(obj, proto);
obj.greet(); // 'Hello'
```

### Object.create()

```javascript
const proto = { x: 1 };
const obj = Object.create(proto);
console.log(obj.x); // 1
console.log(obj.__proto__ === proto); // true
```

### hasOwnProperty()

```javascript
const obj = { a: 1 };
console.log(obj.hasOwnProperty('a')); // true
console.log(obj.hasOwnProperty('toString')); // false
```

## Inheritance Patterns

### 1. Prototype Inheritance

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  console.log(`${this.name} makes a sound`);
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  console.log(`${this.name} barks`);
};

const dog = new Dog('Buddy', 'Golden Retriever');
dog.speak(); // 'Buddy makes a sound'
dog.bark(); // 'Buddy barks'
```

### 2. Class Inheritance

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  bark() {
    console.log(`${this.name} barks`);
  }
}

const dog = new Dog('Buddy', 'Golden Retriever');
dog.speak(); // 'Buddy makes a sound'
dog.bark(); // 'Buddy barks'
```

### 3. Object Composition

```javascript
const canSpeak = {
  speak() {
    console.log(`${this.name} makes a sound`);
  }
};

const canBark = {
  bark() {
    console.log(`${this.name} barks`);
  }
};

function createDog(name, breed) {
  const dog = {
    name,
    breed
  };
  Object.assign(dog, canSpeak, canBark);
  return dog;
}

const dog = createDog('Buddy', 'Golden Retriever');
dog.speak(); // 'Buddy makes a sound'
dog.bark(); // 'Buddy barks'
```

## Best Practices

### 1. ใช้ ES6 Classes สำหรับ inheritance

```javascript
// ✅ ถูก
class Person {
  constructor(name) {
    this.name = name;
  }
}

// ❌ ผิด - ใช้ constructor functions
function Person(name) {
  this.name = name;
}
```

### 2. ไม่แก้ไข built-in prototypes

```javascript
// ❌ ผิด - แก้ไข built-in prototype
Array.prototype.sum = function() {
  return this.reduce((a, b) => a + b, 0);
};

// ✅ ถูก - สร้าง utility function
const arraySum = (arr) => arr.reduce((a, b) => a + b, 0);
```

### 3. ใช้ Object.create() สำหรับ inheritance

```javascript
// ✅ ถูก
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

// ❌ ผิด
Child.prototype = new Parent();
```

### 4. ใช้ hasOwnProperty() เมื่อต้องการ check own properties

```javascript
for (const key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(key);
  }
}
```

## Common Pitfalls

### 1. สับสนระหว่าง __proto__ และ prototype

```javascript
function Person() {}
const john = new Person();

// __proto__ คือ prototype ของ instance
console.log(john.__proto__ === Person.prototype); // true

// prototype คือ property ของ constructor
console.log(Person.prototype); // { constructor: Person }
```

### 2. ลืม set constructor หลัง inheritance

```javascript
function Parent() {}
function Child() {}

Child.prototype = Object.create(Parent.prototype);
// ลืม: Child.prototype.constructor = Child;

console.log(Child.prototype.constructor === Parent); // true (ผิด)
```

### 3. ใช้ arrow functions ใน prototypes

```javascript
// ❌ ผิด - arrow functions ไม่มี this
class Person {
  constructor(name) {
    this.name = name;
  }

  greet = () => {
    console.log(this.name); // this ถูก bind ตั้งแต่สร้าง
  };
}

// ✅ ถูก
class Person {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(this.name);
  }
}
```

## Performance Considerations

- Prototype chain lookup มี overhead เล็กน้อย
- หลีกเลี่ยง prototype chain ที่ลึกเกินไป
- ใช้ properties บน object แทน prototype สำหรับ performance-critical code

## References

- [MDN: Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
- [JavaScript.info: Prototypes](https://javascript.info/prototype-inheritance)
