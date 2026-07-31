# Common Debugging Scenarios

## 1. Undefined Variables

```javascript
// ❌ ผิด
console.log(myVariable); // undefined

// ✅ ถูก
const myVariable = 'value';
console.log(myVariable);
```

## 2. Type Errors

```javascript
// ❌ ผิด
const num = '5';
console.log(num + 10); // '510'

// ✅ ถูก
const num = Number('5');
console.log(num + 10); // 15
```

## 3. Async Issues

```javascript
// ❌ ผิด
let data;
fetchData().then(result => data = result);
console.log(data); // undefined

// ✅ ถูก
async function loadData() {
  const data = await fetchData();
  console.log(data);
}
```

## 4. Scope Issues

```javascript
// ❌ ผิด
for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 5, 5, 5, 5, 5

// ✅ ถูก
for (let i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2, 3, 4
```
