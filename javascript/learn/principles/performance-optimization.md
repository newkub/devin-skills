# Performance Optimization

## Overview

Performance optimization ใน JavaScript เกี่ยวข้องกับการทำให้ code ทำงานเร็วขึ้น ใช้ memory น้อยลง และให้ประสบการณ์ผู้ใช้ที่ดีขึ้น

## Measurement Tools

### Chrome DevTools Performance

1. เปิด DevTools → Performance tab
2. กด Record
3. ทำ actions ที่ต้องการวัด
4. กด Stop
5. วิเคราะห์ results

### Lighthouse

```bash
# Run Lighthouse
npx lighthouse https://example.com
```

### Performance API

```javascript
// Measure execution time
const start = performance.now();

// ... code ...

const duration = performance.now() - start;
console.log(`Execution time: ${duration}ms`);
```

### Node.js Profiling

```bash
# Start with profiling
node --prof app.js

# Analyze profile
node --prof-process isolate-*.log > profile.txt
```

## Optimization Techniques

### 1. Minimize DOM Manipulation

```javascript
// ❌ Bad - multiple DOM updates
for (let i = 0; i < 1000; i++) {
  document.body.innerHTML += `<div>Item ${i}</div>`;
}

// ✅ Good - single DOM update
const items = [];
for (let i = 0; i < 1000; i++) {
  items.push(`<div>Item ${i}</div>`);
}
document.body.innerHTML = items.join('');
```

### 2. Use DocumentFragment

```javascript
// ✅ Use DocumentFragment for batch DOM operations
const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  div.textContent = `Item ${i}`;
  fragment.appendChild(div);
}

document.body.appendChild(fragment);
```

### 3. Event Delegation

```javascript
// ❌ Bad - listener for each item
items.forEach(item => {
  item.addEventListener('click', handleClick);
});

// ✅ Good - single listener with delegation
container.addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    handleClick(e);
  }
});
```

### 4. Debounce and Throttle

```javascript
// Debounce - wait until user stops
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle - limit execution rate
function throttle(fn, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Usage
const handleResize = debounce(() => {
  // expensive operation
}, 200);

const handleScroll = throttle(() => {
  // expensive operation
}, 100);
```

### 5. Lazy Loading

```javascript
// ✅ Lazy load images
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      imageObserver.unobserve(img);
    }
  });
});

images.forEach(img => imageObserver.observe(img));
```

### 6. Code Splitting

```javascript
// ✅ Dynamic import for code splitting
async function loadModule() {
  const module = await import('./heavy-module.js');
  module.doSomething();
}

// Use in routing
const routes = {
  '/dashboard': () => import('./dashboard.js'),
  '/settings': () => import('./settings.js')
};
```

### 7. Memoization

```javascript
// ✅ Cache expensive function results
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

const expensiveCalculation = memoize((n) => {
  // expensive computation
  return n * n;
});
```

### 8. Use Efficient Data Structures

```javascript
// ❌ Bad - O(n) lookup
const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
const user = users.find(u => u.id === 1);

// ✅ Good - O(1) lookup
const userMap = new Map([[1, { name: 'John' }], [2, { name: 'Jane' }]]);
const user = userMap.get(1);
```

### 9. Avoid Unnecessary Re-renders

```javascript
// React example
// ❌ Bad - creates new function on every render
function Component() {
  return <button onClick={() => handleClick()}>Click</button>;
}

// ✅ Good - stable function reference
function Component() {
  const handleClick = useCallback(() => {
    // handle click
  }, []);
  
  return <button onClick={handleClick}>Click</button>;
}
```

### 10. Optimize Loops

```javascript
// ❌ Bad - repeated property access
for (let i = 0; i < items.length; i++) {
  process(items[i]);
}

// ✅ Good - cache length
const len = items.length;
for (let i = 0; i < len; i++) {
  process(items[i]);
}

// ✅ Better - reverse loop (faster in some engines)
for (let i = items.length - 1; i >= 0; i--) {
  process(items[i]);
}
```

## Memory Optimization

### 1. Object Pooling

```javascript
class ObjectPool {
  constructor(createFn, resetFn, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
    
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(createFn());
    }
  }
  
  acquire() {
    return this.pool.pop() || this.createFn();
  }
  
  release(obj) {
    this.resetFn(obj);
    this.pool.push(obj);
  }
}
```

### 2. Clean Up References

```javascript
// ✅ Remove references when done
let largeData = loadHugeData();
// ... use data ...
largeData = null; // Allow garbage collection
```

### 3. Use WeakMap/WeakSet

```javascript
// ✅ WeakMap allows garbage collection
const cache = new WeakMap();

function memoize(obj) {
  if (cache.has(obj)) {
    return cache.get(obj);
  }
  
  const result = expensiveOperation(obj);
  cache.set(obj, result);
  return result;
}
```

## Network Optimization

### 1. Minimize Requests

```javascript
// ❌ Bad - multiple requests
fetch('/api/user/1');
fetch('/api/user/2');
fetch('/api/user/3');

// ✅ Good - single request
fetch('/api/users?ids=1,2,3');
```

### 2. Use Caching

```javascript
// ✅ Cache API responses
const cache = new Map();

async function fetchWithCache(url) {
  if (cache.has(url)) {
    return cache.get(url);
  }
  
  const response = await fetch(url);
  const data = await response.json();
  cache.set(url, data);
  return data;
}
```

### 3. Compression

```javascript
// Enable compression on server
// Express example
const compression = require('compression');
app.use(compression());
```

## Best Practices

### 1. Measure Before Optimizing

```javascript
// Always measure first
const start = performance.now();
// ... code ...
const duration = performance.now() - start;

if (duration > 100) {
  console.warn('Slow operation detected');
}
```

### 2. Optimize Critical Path

```javascript
// Focus on code that runs frequently
function render() {
  // This runs every frame - optimize it
}

function init() {
  // This runs once - less critical
}
```

### 3. Use Web Workers for Heavy Computation

```javascript
// ✅ Offload heavy work to worker
const worker = new Worker('worker.js');

worker.postMessage({ data: largeData });

worker.onmessage = (e) => {
  console.log('Result:', e.data);
};
```

### 4. Avoid Premature Optimization

```javascript
// ❌ Don't optimize without measurement
function add(a, b) {
  // Unnecessary optimization
  return (a + b) | 0;
}

// ✅ Keep it simple
function add(a, b) {
  return a + b;
}
```

## Common Performance Issues

### 1. Memory Leaks

```javascript
// ❌ Event listener not removed
element.addEventListener('click', handler);

// ✅ Remove when done
element.addEventListener('click', handler);
// Later: element.removeEventListener('click', handler);
```

### 2. Blocking the Main Thread

```javascript
// ❌ Heavy computation blocks UI
function heavy() {
  for (let i = 0; i < 1e9; i++) {
    // CPU intensive
  }
}

// ✅ Use Web Worker or chunking
async function heavyChunked() {
  for (let i = 0; i < 1e9; i += 10000) {
    await new Promise(resolve => setTimeout(resolve, 0));
  }
}
```

### 3. Excessive Re-renders

```javascript
// React example
// ❌ Unnecessary re-renders
function App() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData().then(setData);
  }, []); // Missing dependency
  
  return <Child data={data} />;
}
```

## Performance Checklist

- [ ] Measure performance before optimizing
- [ ] Minimize DOM manipulations
- [ ] Use event delegation
- [ ] Implement debounce/throttle
- [ ] Lazy load resources
- [ ] Implement code splitting
- [ ] Use memoization for expensive operations
- [ ] Choose efficient data structures
- [ ] Clean up references
- [ ] Use caching for network requests
- [ ] Offload heavy work to Web Workers
- [ ] Monitor memory usage
- [ ] Test on real devices

## Related Concepts

- [Event Loop](../key-concepts/event-loop.md)
- [Memory Management](../key-concepts/memory-management.md)
- [Async Patterns](../key-concepts/async-patterns.md)
