# Utility Patterns

## 1. Utility Functions

```typescript
// src/utils/date.ts
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function formatTime(date: Date): string {
  return date.toTimeString().split(' ')[0]
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} ${formatTime(date)}`
}
```

## 2. Validation Utilities

```typescript
// src/utils/validation.ts
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function validatePassword(password: string): boolean {
  return password.length >= 8
}
```

## 3. Error Handling Utilities

```typescript
// src/utils/error.ts
export function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unknown error occurred'
}

export function logError(error: unknown): void {
  console.error('Error:', error)
}
```
