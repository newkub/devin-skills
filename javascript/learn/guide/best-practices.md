# Best Practices

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Variables | camelCase | `userName`, `isActive` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_URL` |
| Functions | camelCase, verb prefix | `getUser()`, `fetchData()` |
| Classes | PascalCase | `UserService`, `ApiClient` |
| Files | kebab-case | `user-service.js`, `api-client.ts` |
| Boolean | is/has/can prefix | `isLoggedIn`, `hasPermission` |

## Variable Declaration

```javascript
// ✅ Prefer const for values that won't change
const PI = 3.14159;
const user = { name: 'Alice', age: 30 };

// ✅ Use let when reassignment is needed
let count = 0;
for (let i = 0; i < 10; i++) {
  count += i;
}

// ❌ Avoid var
var old = 'deprecated';
```

## Functions

```javascript
// ✅ Arrow functions for short functions
const add = (a, b) => a + b;

// ✅ Named functions for recursion
function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

// ✅ Default parameters
function greet(name = 'Guest') {
  return `Hello, ${name}`;
}

// ✅ Destructure parameters
function createUser({ name, email, role = 'user' }) {
  return { name, email, role };
}
```

## Async Operations

```javascript
// ✅ Async/await with try/catch
async function fetchData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Fetch failed:', err);
    throw err;
  }
}

// ✅ Parallel execution
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts()
]);

// ❌ Avoid .then chains for complex logic
// // BAD
// fetchData().then(data => {
//   processData(data).then(result => {
//     saveResult(result);
//   });
// });
```

## Imports

```javascript
// ✅ Named imports (tree-shaking friendly)
import { add, subtract } from './math.js';

// ✅ Default import
import React from 'react';

// ✅ Namespace import
import * as helpers from './helpers.js';

// ✅ Import type (TypeScript)
import type { User } from './types.js';
```

## Error Handling

```javascript
// ✅ Custom error classes
class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = 'AppError';
  }
}

// ✅ Use error boundaries (frontend)
class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    logError(error, info);
  }
}

// ✅ Graceful degradation
try {
  const data = JSON.parse(input);
} catch (err) {
  return defaultValue;
}
```

## Performance

```javascript
// ✅ Use event delegation
document.querySelector('ul').addEventListener('click', (e) => {
  if (e.target.matches('li')) {
    handleClick(e.target);
  }
});

// ✅ Memoize expensive operations
const cache = new Map();
function expensiveCalc(key) {
  if (cache.has(key)) return cache.get(key);
  const result = compute(key);
  cache.set(key, result);
  return result;
}

// ✅ Avoid creating functions in render
const handleClick = () => { /* ... */ };
<button onClick={handleClick}>Click</button>
```

## Security

```javascript
// ✅ Sanitize user input
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(dirtyHTML);

// ✅ Validate input
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ✅ Use environment variables
const SECRET = process.env.API_SECRET;
```

## Code Organization

```
src/
├── utils/           # Pure utility functions
├── services/        # Business logic
├── components/      # Reusable UI components
├── hooks/           # Custom hooks
├── constants/       # Application constants
└── index.js        # Entry point
```

## Testing

```javascript
// ✅ Test file naming
// src/utils.js → tests/utils.test.js

// ✅ Clear test structure
describe('add', () => {
  it('should add two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
});
```