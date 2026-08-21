# API Testing Guide

## Description

วิธีใช้งาน API testing ใน Playwright ด้วย APIRequestContext สำหรับ testing HTTP requests โดยไม่ต้องใช้ browser

## Getting Started

### Basic API Request

```typescript
// Send GET request
const response = await request.get('https://api.example.com/users');
console.log(await response.json());
```

### Setup API Context

```typescript
// Create API request context
const context = await request.newContext({
  baseURL: 'https://api.example.com',
  extraHTTPHeaders: {
    'Authorization': 'Bearer token',
  },
});
```

## Common Patterns

### POST Request

```typescript
// Send POST request
const response = await request.post('/users', {
  data: {
    name: 'John Doe',
    email: 'john@example.com',
  },
});
```

### PUT Request

```typescript
// Send PUT request
const response = await request.put('/users/1', {
  data: {
    name: 'Jane Doe',
  },
});
```

### DELETE Request

```typescript
// Send DELETE request
const response = await request.delete('/users/1');
```

### Store API State

```typescript
// Store API state for browser tests
const apiContext = await request.newContext();
const response = await apiContext.post('/login', {
  data: { username: 'user', password: 'pass' },
});

// Use cookies in browser context
const browserContext = await browser.newContext({
  storageState: {
    cookies: await apiContext.cookies(),
  },
});
```

## Advanced Usage

### File Upload

```typescript
// Upload file via API
const response = await request.post('/upload', {
  multipart: {
    file: fs.createReadStream('test.txt'),
  },
});
```

### Response Validation

```typescript
// Validate response
const response = await request.get('/users');
expect(response.status()).toBe(200);
expect(response.ok()).toBeTruthy();
```

### Error Handling

```typescript
// Handle errors
try {
  const response = await request.get('/users');
  expect(response.status()).toBe(200);
} catch (error) {
  console.error('Request failed:', error);
}
```

## Best Practices

1. **Use API Context**: ใช้ APIRequestContext สำหรับ API testing
2. **Share State**: Share cookies ระหว่าง API และ browser tests
3. **Validate Responses**: Validate response status และ body
4. **Mock APIs**: Mock APIs สำหรับ isolated testing
