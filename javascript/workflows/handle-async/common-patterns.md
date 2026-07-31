# Common Patterns

## 1. Parallel Execution with Error Handling

```javascript
async function loadAllWithErrorHandling() {
  const results = await Promise.allSettled([
    fetchUser(),
    fetchPosts(),
    fetchComments()
  ]);

  const successful = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  const failed = results
    .filter(r => r.status === 'rejected')
    .map(r => r.reason);

  return { successful, failed };
}
```

## 2. Sequential with Concurrency Limit

```javascript
async function processBatch(items, concurrency = 5) {
  const results = [];
  const batches = [];

  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(item => processItem(item))
    );
    results.push(...batchResults);
  }

  return results;
}
```

## 3. Caching with Promises

```javascript
const cache = new Map();

async function getCachedData(key, fetcher) {
  if (cache.has(key)) {
    return cache.get(key);
  }

  const promise = fetcher(key).then(data => {
    cache.set(key, data);
    return data;
  });

  cache.set(key, promise);
  return promise;
}
```

## 4. Debounce Async Operations

```javascript
function debounceAsync(fn, delay) {
  let timeoutId;
  let pendingPromise;

  return function(...args) {
    clearTimeout(timeoutId);

    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await fn.apply(this, args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}
```
