# Architecture

## Project Structure

### Monorepo Structure

```
my-app/
├── packages/
│   ├── shared/          # Shared code
│   │   ├── src/
│   │   └── package.json
│   ├── web/             # Frontend
│   │   ├── src/
│   │   └── package.json
│   └── api/             # Backend
│       ├── src/
│       └── package.json
├── package.json         # Root workspace
└── bun-workspace.yaml
```

### Feature-Based Structure

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── index.js
│   ├── products/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── index.js
│   └── orders/
│       ├── components/
│       ├── hooks/
│       ├── api/
│       └── index.js
├── shared/
│   ├── components/
│   ├── utils/
│   └── constants/
├── routes/
└── app.js
```

## Layer Architecture

```
┌─────────────────────────────────────────┐
│           Presentation Layer             │
│  (Components, Pages, UI)                 │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│            Service Layer                │
│  (Business Logic, Data Transformation)  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│            Data Layer                   │
│  (API Calls, Local Storage, Caching)    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│           Infrastructure                │
│  (Database, External APIs)             │
└─────────────────────────────────────────┘
```

## Design Patterns

### Module Pattern

```javascript
// Encapsulate logic in IIFE
const Calculator = (() => {
  let result = 0;

  function add(n) {
    result += n;
    return this;
  }

  function subtract(n) {
    result -= n;
    return this;
  }

  function getResult() {
    return result;
  }

  return { add, subtract, getResult };
})();
```

### Factory Pattern

```javascript
function createUser(type, config) {
  const users = {
    admin: () => new AdminUser(config),
    guest: () => new GuestUser(config),
    premium: () => new PremiumUser(config)
  };

  return users[type]?.() ?? new GuestUser(config);
}
```

### Observer Pattern

```javascript
class EventEmitter {
  #events = {};

  on(event, callback) {
    (this.#events[event] ??= []).push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    this.#events[event] = this.#events[event]
      ?.filter(cb => cb !== callback);
  }

  emit(event, data) {
    this.#events[event]?.forEach(cb => cb(data));
  }
}
```

### Repository Pattern

```javascript
class UserRepository {
  #cache = new Map();

  async findById(id) {
    if (this.#cache.has(id)) {
      return this.#cache.get(id);
    }

    const user = await db.users.findUnique({ where: { id } });
    this.#cache.set(id, user);
    return user;
  }

  async save(user) {
    const saved = await db.users.upsert({ where: { id: user.id }, update: user, create: user });
    this.#cache.set(saved.id, saved);
    return saved;
  }
}
```

## State Management

### Simple State

```javascript
// Functional state management
const createStore = (initialState) => {
  let state = initialState;
  const listeners = new Set();

  return {
    getState: () => state,
    setState: (newState) => {
      state = typeof newState === 'function' ? newState(state) : newState;
      listeners.forEach(l => l(state));
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
};
```

### Context Pattern (React)

```javascript
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

## Error Handling Architecture

```javascript
class AppError extends Error {
  constructor(message, code, statusCode = 500) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

class ValidationError extends AppError {
  constructor(field, message) {
    super(message, 'VALIDATION_ERROR', 400);
    this.field = field;
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
  }
}

// Error handler
function handleError(err) {
  if (err instanceof AppError) {
    return { status: err.statusCode, body: { code: err.code, message: err.message } };
  }
  return { status: 500, body: { code: 'INTERNAL_ERROR', message: 'Unknown error' } };
}
```

## API Layer Architecture

```
src/
├── api/
│   ├── index.js          # API exports
│   ├── client.js         # HTTP client config
│   ├── endpoints/        # API endpoints
│   │   ├── users.js
│   │   └── posts.js
│   └── middleware/       # Request/response middleware
│       ├── auth.js
│       └── logger.js
```

```javascript
// api/client.js
export const apiClient = axios.create({
  baseURL: process.env.API_URL,
  timeout: 10000
});

apiClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res.data,
  (err) => handleError(err)
);
```

## Performance Patterns

### Lazy Loading

```javascript
// Dynamic import
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

// Route-based code splitting
const routes = [
  { path: '/dashboard', component: lazy(() => import('./Dashboard')) }
];
```

### Virtualization

```javascript
// For large lists
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={50}
    >
      {({ index, style }) => (
        <div style={style}>{items[index].name}</div>
      )}
    </FixedSizeList>
  );
}
```