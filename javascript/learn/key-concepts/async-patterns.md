# Async Patterns

## Overview

Async patterns ใช้สำหรับจัดการ operations ที่ใช้เวลา เช่น network requests, file I/O, timers โดยไม่ block main thread

## Callbacks

### Basic Callback

```javascript
function fetchData(callback) {
  setTimeout(() => {
    callback('Data loaded');
  }, 1000);
}

fetchData((data) => {
  console.log(data); // Data loaded
});
```

### Callback Hell

```javascript
// ❌ Callback hell - hard to read
getData(function(a) {
  getMoreData(a, function(b) {
    getMoreData(b, function(c) {
      getMoreData(c, function(d) {
        // ...
      });
    });
  });
});
```

### Named Functions

```javascript
// ✅ Use named functions to avoid callback hell
function handleData(data) {
  console.log(data);
}

function handleError(error) {
  console.error(error);
}

fetchData(handleData, handleError);
```

## Promises

### Creating Promises

```javascript
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;
      if (success) {
        resolve('Data loaded');
      } else {
        reject(new Error('Failed to load'));
      }
    }, 1000);
  });
}
```

### Consuming Promises

```javascript
fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### Promise Chaining

```javascript
fetchData()
  .then(data => processData(data))
  .then(processed => saveData(processed))
  .then(saved => console.log('Saved:', saved))
  .catch(error => console.error('Error:', error));
```

### Promise.all

```javascript
// Run multiple promises in parallel
const promises = [
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments')
];

Promise.all(promises)
  .then(responses => Promise.all(responses.map(r => r.json())))
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### Promise.allSettled

```javascript
// Wait for all promises to settle (fulfilled or rejected)
const promises = [
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments')
];

Promise.allSettled(promises)
  .then(results => {
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        console.log('Success:', result.value);
      } else {
        console.error('Failed:', result.reason);
      }
    });
  });
```

### Promise.race

```javascript
// Use result of first promise to settle
const promises = [
  fetch('/api/fast'),
  fetch('/api/slow')
];

Promise.race(promises)
  .then(response => console.log('First response:', response))
  .catch(error => console.error(error));
```

### Promise.any

```javascript
// Use first fulfilled promise (ignore rejections)
const promises = [
  fetch('/api/backup1'),
  fetch('/api/backup2'),
  fetch('/api/backup3')
];

Promise.any(promises)
  .then(response => console.log('First success:', response))
  .catch(error => console.error('All failed:', error));
```

## Async/Await

### Basic Usage

```javascript
async function loadData() {
  const data = await fetchData();
  console.log(data);
}

loadData();
```

### Error Handling

```javascript
async function loadData() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

### Sequential Operations

```javascript
async function processSequentially() {
  const user = await fetchUser(1);
  const posts = await fetchPosts(user.id);
  const comments = await fetchComments(posts[0].id);
  
  return { user, posts, comments };
}
```

### Parallel Operations

```javascript
async function processInParallel() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(1),
    fetchPosts(1),
    fetchComments(1)
  ]);
  
  return { user, posts, comments };
}
```

### Async Iteration

```javascript
async function* fetchAllUsers() {
  let page = 1;
  while (true) {
    const users = await fetchUsersPage(page);
    if (users.length === 0) break;
    
    for (const user of users) {
      yield user;
    }
    page++;
  }
}

// Usage
for await (const user of fetchAllUsers()) {
  console.log(user);
}
```

## Common Patterns

### 1. Fetch with Retry

```javascript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### 2. Fetch with Timeout

```javascript
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}
```

### 3. Caching with Promises

```javascript
const cache = new Map();

async function fetchWithCache(url) {
  if (cache.has(url)) {
    return cache.get(url);
  }
  
  const promise = fetch(url).then(r => r.json());
  cache.set(url, promise);
  
  return promise;
}
```

### 4. Debounce Async

```javascript
function debounceAsync(fn, delay) {
  let timeoutId;
  let pendingPromise;
  
  return function(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(async () => {
      pendingPromise = fn.apply(this, args);
      try {
        await pendingPromise;
      } finally {
        pendingPromise = null;
      }
    }, delay);
    
    return pendingPromise;
  };
}
```

### 5. Throttle Async

```javascript
function throttleAsync(fn, limit) {
  let inProgress = false;
  let queue = [];
  
  return async function(...args) {
    return new Promise((resolve, reject) => {
      queue.push({ args, resolve, reject });
      
      if (!inProgress) {
        inProgress = true;
        processQueue();
      }
    });
  };
  
  async function processQueue() {
    while (queue.length > 0) {
      const batch = queue.splice(0, limit);
      await Promise.allSettled(
        batch.map(({ args, resolve, reject }) =>
          fn(...args).then(resolve).catch(reject)
        )
      );
    }
    inProgress = false;
  }
}
```

### 6. Parallel with Concurrency Limit

```javascript
async function parallelWithLimit(tasks, limit) {
  const results = [];
  const executing = [];
  
  for (const task of tasks) {
    const promise = task().then(result => {
      executing.splice(executing.indexOf(promise), 1);
      return result;
    });
    
    results.push(promise);
    executing.push(promise);
    
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }
  
  return Promise.all(results);
}
```

## Error Handling Patterns

### 1. Global Error Handler

```javascript
async function withErrorHandler(fn) {
  try {
    return await fn();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage
const result = await withErrorHandler(() => fetchData());
```

### 2. Custom Error Classes

```javascript
class NetworkError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
  }
}

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new NetworkError('Request failed', response.status);
    }
    return response.json();
  } catch (error) {
    if (error instanceof NetworkError) {
      // Handle network error
    }
    throw error;
  }
}
```

### 3. Error Boundaries

```javascript
async function safeExecute(fn, fallback) {
  try {
    return await fn();
  } catch (error) {
    console.error('Error:', error);
    return fallback;
  }
}

// Usage
const data = await safeExecute(
  () => fetch('/api/data').then(r => r.json()),
  { error: true }
);
```

## Best Practices

### 1. Always Handle Errors

```javascript
// ❌ No error handling
async function loadData() {
  const data = await fetchData();
  return data;
}

// ✅ Always handle errors
async function loadData() {
  try {
    const data = await fetchData();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
```

### 2. Use Async/Await Over Callbacks

```javascript
// ❌ Callback hell
fetchData((data) => {
  processData(data, (processed) => {
    saveData(processed, (saved) => {
      console.log(saved);
    });
  });
});

// ✅ Async/await
async function main() {
  const data = await fetchData();
  const processed = await processData(data);
  const saved = await saveData(processed);
  console.log(saved);
}
```

### 3. Parallel When Possible

```javascript
// ❌ Sequential (slow)
async function loadAll() {
  const user = await fetchUser();
  const posts = await fetchPosts();
  const comments = await fetchComments();
  return { user, posts, comments };
}

// ✅ Parallel (fast)
async function loadAll() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments()
  ]);
  return { user, posts, comments };
}
```

### 4. Avoid Mixed Patterns

```javascript
// ❌ Mixing callbacks and promises
function mixedPattern(callback) {
  fetchData().then(data => callback(data));
}

// ✅ Consistent pattern
async function consistentPattern() {
  const data = await fetchData();
  return data;
}
```

### 5. Clean Up Resources

```javascript
async function withResource(resource, fn) {
  try {
    return await fn(resource);
  } finally {
    await resource.dispose();
  }
}

// Usage
const connection = await createConnection();
const result = await withResource(connection, conn => conn.query('SELECT *'));
```

## Related Concepts

- [Event Loop](./event-loop.md)
- [Promises](../references/api.md)
- [Async/Await](../references/api.md)
- [Error Handling](../principles/error-handling/index.md)
