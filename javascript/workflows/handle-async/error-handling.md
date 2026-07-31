# Error Handling

## 1. Try-Catch-Finally

```javascript
async function operation() {
  try {
    const result = await riskyOperation();
    return result;
  } catch (error) {
    console.error('Operation failed:', error);
    throw error;
  } finally {
    console.log('Cleanup');
  }
}
```

## 2. Error Propagation

```javascript
async function parent() {
  try {
    await child();
  } catch (error) {
    console.error('Parent caught:', error);
  }
}

async function child() {
  await grandchild();
}

async function grandchild() {
  throw new Error('Grandchild error');
}
```

## 3. Custom Error Handling

```javascript
class NetworkError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
  }
}

async function fetchWithRetry(url, maxRetries = 3) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new NetworkError('Request failed', response.status);
      }
      return await response.json();
    } catch (error) {
      retries++;
      if (retries >= maxRetries) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
  }
}
```
