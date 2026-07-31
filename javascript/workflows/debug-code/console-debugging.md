# Console Debugging

## 1. Basic Console Methods

```javascript
console.log('Simple log');
console.error('Error message');
console.warn('Warning message');
console.info('Info message');
console.debug('Debug message');
```

## 2. Console with Formatting

```javascript
const name = 'John';
const age = 25;

console.log('Name: %s, Age: %d', name, age);
console.log('Object: %o', { name, age });
console.log('JSON: %O', { name, age });
```

## 3. Console Groups

```javascript
console.group('User Data');
console.log('Name:', name);
console.log('Age:', age);
console.groupEnd();

console.groupCollapsed('Details');
console.log('Additional info');
console.groupEnd();
```

## 4. Console Table

```javascript
const users = [
  { id: 1, name: 'John', age: 25 },
  { id: 2, name: 'Jane', age: 30 }
];

console.table(users);
```

## 5. Console Time

```javascript
console.time('Operation');
// code to measure
console.timeEnd('Operation');
```

## 6. Console Assert

```javascript
const value = 5;
console.assert(value === 10, 'Value should be 10');
```
