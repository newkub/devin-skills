# Security

## Security Considerations สำหรับ Vite Projects

Vite มี security features และ best practices ที่ควรปฏิบัติตาม

## Development Server Security

### 1. Host Configuration

ตั้งค่า host อย่างเหมาะสมเพื่อป้องกันการเข้าถึงจากภายนอก

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    host: 'localhost',  // Default - only accessible locally
    // host: true,      // Accessible from network
    // host: '0.0.0.0', // Accessible from all interfaces
  },
})
```

### 2. CORS Configuration

ตั้งค่า CORS สำหรับ development server

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    cors: true,  // Enable CORS (default)
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
})
```

### 3. HTTPS in Development

ใช้ HTTPS สำหรับ development เมื่อจำเป็น

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    https: {
      key: './key.pem',
      cert: './cert.pem',
    },
  },
})
```

## Environment Variables

### 1. Secure Environment Variables

ใช้ `.env` files สำหรับ environment variables

```bash
# .env
VITE_API_KEY=your_api_key_here
VITE_API_URL=https://api.example.com
```

```typescript
// Access in code
const apiKey = import.meta.env.VITE_API_KEY
```

### 2. Prefix Convention

ใช้ `VITE_` prefix สำหรับ variables ที่ต้องการ expose ไปยัง client

```bash
# .env
VITE_PUBLIC_KEY=public_value    # Exposed to client
SECRET_KEY=secret_value         # NOT exposed to client
```

### 3. Production Environment Variables

ใช้ `.env.production` สำหรับ production-specific values

```bash
# .env.production
VITE_API_URL=https://api.production.com
```

## Dependency Security

### 1. Audit Dependencies

ตรวจสอบ security vulnerabilities ใน dependencies

```bash
bun audit
```

### 2. Use Latest Versions

อัปเดต dependencies เป็นเวอร์ชันล่าสุดเสมอ

```bash
bun update
```

### 3. Lockfile

ใช้ lockfile (`bun.lockb`) เพื่อความสม่ำเสมอ

```bash
bun install
```

## Content Security Policy (CSP)

### 1. CSP Headers

ตั้งค่า CSP headers ใน production

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
    },
  },
})
```

### 2. CSP in Production

ตั้งค่า CSP ใน production server (Nginx example)

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;
```

## XSS Prevention

### 1. Auto-Escaping

Vite ไม่ auto-escape HTML แต่ frameworks ทำให้

```vue
<!-- Vue - auto-escaped -->
<div>{{ userInput }}</div>

<!-- React - auto-escaped -->
<div>{userInput}</div>
```

### 2. Sanitize User Input

ใช้ libraries สำหรับ sanitize user input

```bash
bun add dompurify
bun add -D @types/dompurify
```

```typescript
import DOMPurify from 'dompurify'

const clean = DOMPurify.sanitize(dirtyInput)
```

## CSRF Protection

### 1. Use SameSite Cookies

ตั้งค่า SameSite attribute สำหรับ cookies

```typescript
// In your backend
res.cookie('session', sessionId, {
  sameSite: 'strict',
  secure: true,
  httpOnly: true,
})
```

### 2. CSRF Tokens

ใช้ CSRF tokens สำหรับ state-changing operations

```typescript
// Include CSRF token in requests
fetch('/api/data', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken,
  },
})
```

## Security Checklist

### Development

- [ ] ใช้ `host: 'localhost'` สำหรับ local development
- [ ] ไม่ expose sensitive data ใน client-side code
- [ ] ใช้ environment variables สำหรับ secrets
- [ ] ตรวจสอบ dependencies ด้วย `bun audit`
- [ ] ไม่ commit `.env` files

### Production

- [ ] ใช้ HTTPS
- [ ] ตั้งค่า CSP headers
- [ ] ใช้ SameSite cookies
- [ ] ใช้ CSRF tokens
- [ ] Sanitize user input
- [ ] อัปเดต dependencies เป็นเวอร์ชันล่าสุด
- [ ] ตรวจสอบ bundle สำหรับ sensitive data

## Common Security Issues

### 1. Exposing Secrets

```typescript
// Bad - exposing API key in client code
const apiKey = 'sk-1234567890abcdef'

// Good - use environment variable
const apiKey = import.meta.env.VITE_API_KEY
```

### 2. XSS Vulnerabilities

```vue
<!-- Bad - v-html with user input -->
<div v-html="userInput"></div>

<!-- Good - auto-escaped -->
<div>{{ userInput }}</div>

<!-- Or sanitize -->
<div v-html="sanitizedInput"></div>
```

### 3. Insecure Dependencies

```bash
# Regularly audit dependencies
bun audit

# Update to fix vulnerabilities
bun update
```

## Security Tools

### 1. bun audit

```bash
bun audit
```

### 2. Snyk

```bash
bunx snyk test
```

### 3. Dependabot

เปิดใช้งาน Dependabot ใน GitHub repository เพื่อ auto-detect vulnerabilities
