# Debugging Techniques

## 1. Binary Search Debugging

```javascript
function findBug(data) {
  console.log('Start debugging');
  console.log('Data length:', data.length);

  const mid = Math.floor(data.length / 2);
  console.log('Middle index:', mid);
  console.log('Middle value:', data[mid]);

  // Continue narrowing down
}
```

## 2. Logging State Changes

```javascript
let state = { count: 0 };

function increment() {
  console.log('Before:', state);
  state.count++;
  console.log('After:', state);
}
```

## 3. Tracing Function Calls

```javascript
function traceFunction(fn, name) {
  return function(...args) {
    console.log(`Calling ${name} with:`, args);
    const result = fn.apply(this, args);
    console.log(`${name} returned:`, result);
    return result;
  };
}

const tracedAdd = traceFunction((a, b) => a + b, 'add');
tracedAdd(5, 3);
```

## 4. Memory Profiling

```javascript
// Use Chrome DevTools Memory tab
// Take heap snapshots
// Compare snapshots to find memory leaks

// Or use Node.js
node --heap-prof app.js
```
