# Security Features

## Password Protection

```json
// vercel.json
{
  "passwords": [
    {
      "path": "/staging",
      "password": "secret123"
    }
  ]
}
```

## Headers

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

## Edge Security

```typescript
// Rate limiting at edge
export const config = {
  rateLimit: {
    window: '10s',
    max: 100
  }
};
```
