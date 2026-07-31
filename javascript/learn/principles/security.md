# Security

## Overview

Security ใน JavaScript เกี่ยวข้องกับการป้องกัน vulnerabilities เช่น XSS, CSRF, injection attacks และการจัดการ sensitive data อย่างปลอดภัย

## Common Vulnerabilities

### 1. Cross-Site Scripting (XSS)

#### Stored XSS

```javascript
// ❌ Vulnerable - user input rendered directly
function renderComment(comment) {
  document.getElementById('comments').innerHTML = comment;
}

// ✅ Safe - sanitize input
function renderComment(comment) {
  const sanitized = escapeHtml(comment);
  document.getElementById('comments').innerHTML = sanitized;
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
```

#### Reflected XSS

```javascript
// ❌ Vulnerable - URL parameter reflected
const name = new URLSearchParams(window.location.search).get('name');
document.getElementById('greeting').textContent = `Hello, ${name}`;

// ✅ Safe - use textContent (auto-escapes)
const name = new URLSearchParams(window.location.search).get('name');
document.getElementById('greeting').textContent = `Hello, ${name}`;
```

#### DOM-based XSS

```javascript
// ❌ Vulnerable - eval with user input
const userInput = getUserInput();
eval(userInput);

// ✅ Safe - avoid eval
const userInput = getUserInput();
// Use alternative approach
```

### 2. Cross-Site Request Forgery (CSRF)

```javascript
// ❌ Vulnerable - no CSRF protection
fetch('/api/transfer', {
  method: 'POST',
  body: JSON.stringify({ to: 'attacker', amount: 1000 })
});

// ✅ Safe - use CSRF token
fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': getCsrfToken()
  },
  body: JSON.stringify({ to: 'user', amount: 100 })
});
```

### 3. Injection Attacks

#### SQL Injection

```javascript
// ❌ Vulnerable - string concatenation
const query = `SELECT * FROM users WHERE name = '${userName}'`;

// ✅ Safe - parameterized queries
const query = 'SELECT * FROM users WHERE name = ?';
db.query(query, [userName]);
```

#### Command Injection

```javascript
// ❌ Vulnerable - command with user input
const { exec } = require('child_process');
exec(`ls ${userInput}`);

// ✅ Safe - validate and sanitize
const { exec } = require('child_process');
const safeInput = validateAndSanitize(userInput);
exec(`ls ${safeInput}`);
```

## Security Best Practices

### 1. Input Validation

```javascript
// ✅ Validate input before use
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validateInput(input, rules) {
  const errors = [];
  
  if (rules.required && !input) {
    errors.push('Field is required');
  }
  
  if (rules.minLength && input.length < rules.minLength) {
    errors.push(`Minimum length is ${rules.minLength}`);
  }
  
  if (rules.maxLength && input.length > rules.maxLength) {
    errors.push(`Maximum length is ${rules.maxLength}`);
  }
  
  if (rules.pattern && !rules.pattern.test(input)) {
    errors.push('Invalid format');
  }
  
  return errors;
}
```

### 2. Output Encoding

```javascript
// ✅ Encode output based on context
function encodeForHtml(str) {
  return str.replace(/[&<>"']/g, (match) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[match]));
}

function encodeForJs(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function encodeForUrl(str) {
  return encodeURIComponent(str);
}
```

### 3. Content Security Policy (CSP)

```javascript
// ✅ Set CSP headers
// Express example
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.example.com; style-src 'self' 'unsafe-inline'"
  );
  next();
});
```

### 4. Secure HTTP Headers

```javascript
// ✅ Set security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});
```

### 5. HTTPS Only

```javascript
// ✅ Enforce HTTPS
app.use((req, res, next) => {
  if (!req.secure && process.env.NODE_ENV === 'production') {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});
```

## Handling Sensitive Data

### 1. Environment Variables

```javascript
// ❌ Bad - hardcoded secrets
const API_KEY = 'sk-1234567890abcdef';

// ✅ Good - environment variables
const API_KEY = process.env.API_KEY;

// Validate presence
if (!API_KEY) {
  throw new Error('API_KEY is required');
}
```

### 2. Secret Management

```javascript
// ✅ Use secret management service
async function getSecret(secretName) {
  // Use AWS Secrets Manager, HashiCorp Vault, etc.
  const secret = await secretsManager.getSecret(secretName);
  return secret;
}
```

### 3. Secure Storage

```javascript
// ❌ Bad - localStorage for sensitive data
localStorage.setItem('token', 'sensitive-token');

// ✅ Good - use httpOnly cookies
res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});
```

### 4. Encryption

```javascript
// ✅ Encrypt sensitive data
const crypto = require('crypto');

function encrypt(text, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text, key) {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encrypted = parts.join(':');
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

## Authentication & Authorization

### 1. Password Hashing

```javascript
// ✅ Use bcrypt for password hashing
const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

async function verifyPassword(password, hash) {
  const match = await bcrypt.compare(password, hash);
  return match;
}
```

### 2. JWT Tokens

```javascript
// ✅ Use JWT for stateless authentication
const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}
```

### 3. Role-Based Access Control

```javascript
// ✅ Implement RBAC
function hasPermission(user, permission) {
  return user.permissions.includes(permission);
}

function requirePermission(permission) {
  return (req, res, next) => {
    if (!hasPermission(req.user, permission)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// Usage
app.delete('/api/users/:id', requirePermission('user:delete'), deleteUser);
```

## Secure API Design

### 1. Rate Limiting

```javascript
// ✅ Implement rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests'
});

app.use('/api/', limiter);
```

### 2. Input Sanitization

```javascript
// ✅ Sanitize input
const { body, validationResult } = require('express-validator');

app.post('/api/users', [
  body('email').isEmail().normalizeEmail(),
  body('name').trim().escape()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process request
});
```

### 3. Secure File Uploads

```javascript
// ✅ Validate file uploads
const multer = require('multer');
const path = require('path');

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (!allowedTypes.includes(ext)) {
      return cb(new Error('Invalid file type'));
    }
    
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});
```

## Security Checklist

- [ ] Validate all user inputs
- [ ] Encode all outputs
- [ ] Use parameterized queries
- [ ] Implement CSRF protection
- [ ] Set security headers
- [ ] Use HTTPS in production
- [ ] Store secrets in environment variables
- [ ] Hash passwords with bcrypt
- [ ] Implement rate limiting
- [ ] Validate file uploads
- [ ] Use Content Security Policy
- [ ] Keep dependencies updated
- [ ] Implement proper authentication
- [ ] Use role-based access control
- [ ] Log security events
- [ ] Regular security audits

## Related Concepts

- [Error Handling](./error-handling/index.md)
- [Type Coercion](../key-concepts/type-coercion.md)
- [Async Patterns](../key-concepts/async-patterns.md)
