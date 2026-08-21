# Network Interception

## Definition

Network Interception คือความสามารถของ Playwright ในการ:
- Intercept HTTP requests และ responses
- Mock หรือ modify network traffic
- Monitor network activity
- Block specific requests
- Handle WebSocket connections

## Core Concepts

### Request Interception

```typescript
// Intercept all requests
await page.route('**/*', async route => {
  console.log(route.request().url());
  await route.continue();
});
```

### Response Mocking

```typescript
// Mock API responses
await page.route('**/api/data', async route => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ data: 'mocked' }),
  });
});
```

### Request Modification

```typescript
// Modify request headers
await page.route('**/*', async route => {
  const headers = route.request().headers();
  headers['Authorization'] = 'Bearer token';
  await route.continue({ headers });
});
```

### Request Blocking

```typescript
// Block specific requests
await page.route('**/*.{png,jpg,jpeg}', route => route.abort());
```

## Use Cases

### API Mocking

```typescript
// Mock API for faster tests
await page.route('**/api/users', async route => {
  await route.fulfill({
    status: 200,
    body: JSON.stringify([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ]),
  });
});
```

### Error Simulation

```typescript
// Simulate API errors
await page.route('**/api/error', async route => {
  await route.fulfill({
    status: 500,
    body: 'Internal Server Error',
  });
});
```

### Network Monitoring

```typescript
// Monitor network activity
const requests = [];
page.on('request', request => {
  requests.push({
    url: request.url(),
    method: request.method(),
  });
});
```

## Best Practices

1. **Use Specific Routes**: ใช้ routes ที่ specific เพื่อ avoid unintended side effects
2. **Clean Up Routes**: Unroute เมื่อไม่ต้องการ
3. **Mock Only When Needed**: Mock เฉพาะสิ่งที่จำเป็น
4. **Test Real APIs**: Test กับ real APIs เป็นบางส่วน
