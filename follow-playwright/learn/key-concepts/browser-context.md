# Browser Context

## Definition

Browser Context คือ isolated session ภายใน browser instance:
- Incognito-like session
- Isolated cookies และ local storage
- Independent permissions
- Can create multiple contexts per browser

## Core Concepts

### Creating Context

```typescript
// Create new context
const context = await browser.newContext();

// Create context with options
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  userAgent: 'Custom User Agent',
  locale: 'th-TH',
  timezoneId: 'Asia/Bangkok',
});
```

### Context Storage State

```typescript
// Save storage state
await context.storageState({ path: 'state.json' });

// Load storage state
const context = await browser.newContext({
  storageState: 'state.json',
});
```

### Cookies Management

```typescript
// Get cookies
const cookies = await context.cookies();

// Set cookies
await context.addCookies([
  {
    name: 'session',
    value: 'abc123',
    domain: 'example.com',
    path: '/',
  },
]);

// Clear cookies
await context.clearCookies();
```

### Permissions

```typescript
// Grant permissions
await context.grantPermissions(['geolocation']);

// Revoke permissions
await context.clearPermissions();
```

## Use Cases

### Authentication Testing

```typescript
// Login once and reuse session
const context = await browser.newContext();
const page = await context.newPage();
await page.goto('https://example.com/login');
await page.getByLabel('Username').fill('user');
await page.getByLabel('Password').fill('pass');
await page.getByRole('button', { name: 'Login' }).click();

// Save state
await context.storageState({ path: 'auth-state.json' });

// Reuse in other tests
const context = await browser.newContext({
  storageState: 'auth-state.json',
});
```

### Multi-User Testing

```typescript
// Test with multiple users
const user1Context = await browser.newContext();
const user2Context = await browser.newContext();

// User 1 actions
const page1 = await user1Context.newPage();
await page1.goto('https://example.com');

// User 2 actions
const page2 = await user2Context.newPage();
await page2.goto('https://example.com');
```

### Mobile Emulation

```typescript
// Emulate mobile device
const context = await browser.newContext({
  ...devices['iPhone 13'],
});
```

## Best Practices

1. **Use Contexts for Isolation**: ใช้ contexts สำหรับ isolated sessions
2. **Reuse Auth State**: Save และ reuse authentication state
3. **Clean Up**: Close contexts เมื่อไม่ต้องการ
4. **Parallel Testing**: ใช้ contexts สำหรับ parallel testing
