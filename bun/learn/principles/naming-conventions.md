# Naming Conventions - Bun

## Overview

ใช้ naming conventions ที่สอดคล้องกับ JavaScript/TypeScript community

## File Naming

- TypeScript files: `.ts` extension
- JavaScript files: `.js` extension
- Test files: `.test.ts` หรือ `.spec.ts`
- Component files: PascalCase (e.g., `Button.tsx`)
- Utility files: camelCase (e.g., `formatDate.ts`)

## Variable Naming

### camelCase

```typescript
const userName = "john"
const isLoggedIn = true
const fetchUserData = async () => { }
```

### PascalCase

```typescript
class UserService { }
interface ApiResponse { }
type UserStatus = "active" | "inactive"
```

### UPPER_SNAKE_CASE

```typescript
const API_BASE_URL = "https://api.example.com"
const MAX_RETRIES = 3
```

## Function Naming

```typescript
// Verb + Noun pattern
function getUserById(id: string) { }
function calculateTotal(items: Item[]) { }
function validateEmail(email: string) { }

// Async functions
async function fetchUserData() { }
async function saveToDatabase(data: any) { }
```

## Directory Structure

```
src/
├── components/      # PascalCase
├── services/       # camelCase
├── utils/          # camelCase
├── types/          # camelCase
└── tests/          # camelCase
```

## Best Practices

- Be descriptive - ชื่อควรบอกความหมายชัดเจน
- Be consistent - ใช้ convention เดียวกันทั้งโปรเจกต์
- Avoid abbreviations - ใช้คำเต็มเสมอ (เว้นแต่ common abbreviations)
- Use TypeScript - ช่วย catch naming errors
