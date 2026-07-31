# Network Interception Guide

## Description

วิธีใช้งาน network interception ใน Playwright สำหรับ mock, modify, และ monitor network traffic

## Getting Started

### Basic Interception

```typescript
// Intercept all requests
await page.route('**/*', async route => {
  console.log(route.request().url());
  await route.continue();
});
```

### Mock API Responses

```typescript
// Mock API for faster tests
await page.route('**/api/users', async route => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ]),
  });
});
```

## Common Patterns

### Modify Request Headers

```typescript
await page.route('**/*', async route => {
  const headers = route.request().headers();
  headers['Authorization'] = 'Bearer token';
  await route.continue({ headers });
});
```

### Block Resources

```typescript
// Block images for faster loading
await page.route('**/*.{png,jpg,jpeg}', route => route.abort());
```

### Handle Errors

```typescript
// Simulate API errors
await page.route('**/api/error', async route => {
  await route.fulfill({
    status: 500,
    body: 'Internal Server Error',
  });
});
```

### HAR Recording

```typescript
// Record network activity
await context.routeFromHAR('network.har', {
  url: '**/api/**',
  update: false,
});
```

## Advanced Usage

### WebSocket Interception

```typescript
// Intercept WebSocket connections
page.on('websocket', ws => {
  console.log('WebSocket opened', ws.url());
  ws.on('framesent', data => console.log('Sent:', data));
  ws.on('framereceived', data => console.log('Received:', data));
});
```

### Request Filtering

```typescript
// Intercept only specific requests
await page.route('**/api/**', async route => {
  // Handle API requests
  await route.continue();
});
```

## Best Practices

1. **Use Specific Routes**: ใช้ routes ที่ specific เพื่อ avoid unintended side effects
2. **Clean Up Routes**: Unroute เมื่อไม่ต้องการ
3. **Mock Only When Needed**: Mock เฉพาะสิ่งที่จำเป็น
4. **Test Real APIs**: Test กับ real APIs เป็นบางส่วน
