# Async Error Handling

## 1. Promise.catch()

```javascript
fetch('/api/data')
  .then(response => response.json())
  .then(data => processData(data))
  .catch(error => {
    console.error('Fetch failed:', error);
    showError('Failed to load data');
  });
```

## 2. Async/Await with Try-Catch

```javascript
async function loadData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return processData(data);
  } catch (error) {
    console.error('Load failed:', error);
    throw new Error('Failed to load data');
  }
}
```

## 3. Promise.all() Error Handling

```javascript
async function loadMultiple() {
  try {
    const [users, posts, comments] = await Promise.all([
      fetch('/api/users').then(r => r.json()),
      fetch('/api/posts').then(r => r.json()),
      fetch('/api/comments').then(r => r.json())
    ]);
    return { users, posts, comments };
  } catch (error) {
    console.error('One of the requests failed:', error);
    throw error;
  }
}
```

## 4. Promise.allSettled()

```javascript
async function loadMultipleWithErrors() {
  const results = await Promise.allSettled([
    fetch('/api/users').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
    fetch('/api/comments').then(r => r.json())
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
