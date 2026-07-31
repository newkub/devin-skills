# Migrate to TypeScript

## Context

มี JavaScript project ที่ต้องการ migrate เป็น TypeScript

## Steps

### 1. Setup TypeScript

```bash
# Install TypeScript
bun add -D typescript @types/node

# Initialize tsconfig
bunx tsc --init
```

### 2. Configure tsconfig

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### 3. Rename Files

```bash
# Rename .js to .ts/.tsx
find src -name "*.js" -type f | while read f; do
  mv "$f" "${f%.js}.ts"
done
```

### 4. Add Type Annotations

```typescript
// Before (JavaScript)
function processUser(user) {
  return {
    ...user,
    fullName: user.firstName + " " + user.lastName,
  };
}

// After (TypeScript)
interface User {
  firstName: string;
  lastName: string;
  email: string;
}

function processUser(user: User): { fullName: string; email: string } {
  return {
    fullName: `${user.firstName} ${user.lastName}`,
    email: user.email,
  };
}
```

### 5. Create Type Definitions

```typescript
// src/types/index.ts

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}

export type UserRole = "admin" | "user" | "guest";

export type ApiResponse<T> = {
  data: T;
  status: number;
  message?: string;
};
```

### 6. Fix Type Errors

```bash
# Check for errors
bunx tsc --noEmit

# Fix common issues:
# - Add missing types
# - Handle null/undefined
# - Use proper type guards
```

### 7. Enable Strict Mode

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

## Migration Order

1. **Utils/Helpers** - Start with simple functions
2. **Types/Interfaces** - Define data structures
3. **Components** - Add props types
4. **API Layer** - Type response data
5. **State Management** - Type store/action

## Common Issues

| Issue | Solution |
|-------|----------|
| `any` types | Replace with specific types or `unknown` |
| Null checks | Use optional chaining `?.` and nullish coalescing `??` |
| Function types | Define function signatures properly |
| Third-party libs | Install `@types/*` packages |

## Related

- [principles/type-safety.md](../principles/type-safety.md)
- [guide/configuration.md](../guide/configuration.md)
