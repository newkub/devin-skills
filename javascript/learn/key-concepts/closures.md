# Closures

## Overview

Closures เป็นหนึ่งใน concept ที่สำคัญที่สุดใน JavaScript ที่ให้ฟังก์ชันสามารถเข้าถึงตัวแปรจาก scope ภายนอกได้ แม้ว่าฟังก์ชันภายนอกจะ return ไปแล้วก็ตาม

## ความหมาย

Closure คือฟังก์ชันที่รวมเอา environment ของตัวเองไว้ด้วย ซึ่งประกอบด้วย:

- ฟังก์ชันเอง
- Lexical environment ที่ฟังก์ชันถูกสร้างขึ้น
- ตัวแปรทั้งหมดที่อยู่ใน scope ขณะที่ฟังก์ชันถูกสร้าง

## ตัวอย่างพื้นฐาน

```javascript
function createCounter() {
  let count = 0;

  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

## Use Cases

### 1. Data Privacy

```javascript
function createPerson(name) {
  let _name = name;

  return {
    getName: () => _name,
    setName: (newName) => { _name = newName; }
  };
}

const person = createPerson('John');
console.log(person.getName()); // 'John'
person.setName('Jane');
console.log(person.getName()); // 'Jane'
// _name ไม่สามารถเข้าถึงได้โดยตรง
```

### 2. Function Factories

```javascript
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

### 3. State Management

```javascript
function createStore(initialState) {
  let state = initialState;
  const listeners = [];

  return {
    getState: () => state,
    setState: (newState) => {
      state = newState;
      listeners.forEach(listener => listener(state));
    },
    subscribe: (listener) => {
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        listeners.splice(index, 1);
      };
    }
  };
}
```

### 4. Memoization

```javascript
function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensive = memoize((n) => {
  console.log('Computing...');
  return n * n;
});

console.log(expensive(5)); // Computing... 25
console.log(expensive(5)); // 25 (from cache)
```

## Common Pitfalls

### 1. Loop Variables

```javascript
// ❌ ผิด - ทุกปุ่มจะแสดงค่าเดียวกัน
for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 5, 5, 5, 5, 5

// ✅ ถูก - ใช้ let หรือ IIFE
for (let i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2, 3, 4
```

### 2. Memory Leaks

```javascript
// ❌ อาจเกิด memory leak ถ้าไม่ยกเลิกการ subscribe
function setupHandler() {
  const data = { /* large data */ };
  element.addEventListener('click', () => {
    console.log(data);
  });
}

// ✅ ยกเลิกการ subscribe เมื่อไม่ใช้งาน
function setupHandler() {
  const data = { /* large data */ };
  const handler = () => console.log(data);
  element.addEventListener('click', handler);
  return () => element.removeEventListener('click', handler);
}
```

## Best Practices

1. **ใช้ closures สำหรับ encapsulation** - ซ่อน implementation details
2. **ระวัง memory leaks** - ยกเลิก references เมื่อไม่ใช้งาน
3. **ใช้ let/const แทน var** - หลีกเลี่ยงปัญหา loop variables
4. **เขียนชื่อฟังก์ชันให้ชัดเจน** - บ่งบอกว่าเป็น closure
5. **จำกัด scope** - ไม่ capture ตัวแปรที่ไม่จำเป็น

## Performance Considerations

- Closures มี overhead เล็กน้อยเพราะต้อง maintain lexical environment
- หลีกเลี่ยงการสร้าง closures ใน loops ที่ทำซ้ำบ่อย
- ใช้ closures อย่างมีเหตุผล ไม่ใช้ทุกที่

## References

- [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
- [JavaScript.info: Closures](https://javascript.info/closure)
