---
description: ความปลอดภัยและ best practices สำหรับ Node.js
---

## Goal

อธิบายความปลอดภัยและ best practices สำหรับการพัฒนาด้วย Node.js

## Scope

สำหรับโปรเจกต์ที่ต้องการความปลอดภัยสูง

## Security Features

### Built-in Security

- **Sandboxing** - รองรับ worker isolation
- **Secure HTTP** - รองรับ HTTPS และ TLS
- **Crypto Module** - Built-in cryptography

## Best Practices

### 1. Environment Variables

ใช้ `.env` และไม่ commit secrets:

```bash
# .env
API_KEY=your_secret_key
DATABASE_URL=postgres://...
```

```javascript
// ใช้ใน code
require('dotenv').config();
const apiKey = process.env.API_KEY;
```

### 2. Input Validation

ใช้ Joi หรือ libraries สำหรับ validation:

```javascript
const Joi = require('joi');

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
```

### 3. Dependency Security

ตรวจสอบ dependencies อย่างสม่ำเสมอ:

```bash
bun audit
bun audit fix
```

### 4. Secure HTTP

ใช้ HTTPS เสมอและ validate certificates:

```javascript
const https = require('https');

const options = {
  hostname: 'api.example.com',
  port: 443,
  path: '/',
  method: 'GET',
};

const req = https.request(options, (res) => {
  // Handle response
});
```

### 5. File System Access

จำกัดการเข้าถึง file system:

```javascript
// ❌ อันตราย
const data = fs.readFileSync(userInput);

// ✅ ปลอดภัย
const allowedPath = './data/safe.txt';
const data = fs.readFileSync(allowedPath);
```

## Common Vulnerabilities

### XSS Prevention

Escape user input ก่อน render:

```javascript
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
```

### SQL Injection

ใช้ parameterized queries:

```javascript
// ❌ อันตราย
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ ปลอดภัย
const query = 'SELECT * FROM users WHERE id = $1';
const values = [userId];
```

### Dependency Injection

ตรวจสอบ dependencies ที่มี vulnerabilities:

```bash
bun audit
bun outdated
```
