# Security Testing

## Overview

Security testing คือการทดสอบ application สำหรับ vulnerabilities และ security flaws เพื่อป้องกัน attacks

## Common Vulnerabilities

### SQL Injection

```javascript
// VULNERABLE
const query = `SELECT * FROM users WHERE id = ${userId}`;

// SECURE - Parameterized query
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);
```

### XSS (Cross-Site Scripting)

```javascript
// VULNERABLE
div.innerHTML = userInput;

// SECURE - Sanitize
div.textContent = userInput;
// or
div.innerHTML = DOMPurify.sanitize(userInput);
```

### CSRF (Cross-Site Request Forgery)

```javascript
// SECURE - Use CSRF tokens
app.use(csrf());

// Include token in forms
<input type="hidden" name="_csrf" value="${csrfToken}">
```

## Security Testing Tools

### OWASP ZAP

```bash
# Install
brew install zap  # macOS

# Scan application
zap-cli quick-scan --self-contained http://localhost:3000

# Generate report
zap-cli report -o report.html -f html
```

### Snyk

```bash
# Install
bun install -g snyk

# Scan for vulnerabilities
snyk test

# Monitor dependencies
snyk monitor
```

### bun audit

```bash
# Check for vulnerabilities
bun audit

# Fix automatically
bun audit fix

# Force fix (may break)
bun audit fix --force
```

## Security Testing in Tests

### Input Validation Tests

```javascript
describe('Input Validation', () => {
  it('should reject SQL injection attempts', () => {
    const maliciousInput = "1' OR '1'='1";
    expect(() => {
      validateUserId(maliciousInput);
    }).toThrow('Invalid input');
  });

  it('should reject XSS attempts', () => {
    const maliciousInput = '<script>alert("XSS")</script>';
    const sanitized = sanitizeInput(maliciousInput);
    expect(sanitized).not.toContain('<script>');
  });
});
```

### Authentication Tests

```javascript
describe('Authentication', () => {
  it('should reject weak passwords', () => {
    expect(() => {
      validatePassword('123456');
    }).toThrow('Password too weak');
  });

  it('should hash passwords', () => {
    const password = 'securePassword123';
    const hashed = hashPassword(password);
    expect(hashed).not.toBe(password);
    expect(bcrypt.compare(password, hashed)).toBe(true);
  });

  it('should enforce rate limiting', async () => {
    for (let i = 0; i < 10; i++) {
      await attemptLogin('user@example.com', 'password');
    }
    await expect(
      attemptLogin('user@example.com', 'password')
    ).rejects.toThrow('Too many attempts');
  });
});
```

### Authorization Tests

```javascript
describe('Authorization', () => {
  it('should prevent unauthorized access', async () => {
    const response = await request(app)
      .get('/admin')
      .set('Authorization', 'invalid-token');
    
    expect(response.status).toBe(401);
  });

  it('should prevent privilege escalation', async () => {
    const userToken = generateToken({ role: 'user' });
    const response = await request(app)
      .delete('/users/1')
      .set('Authorization', userToken);
    
    expect(response.status).toBe(403);
  });
});
```

### Data Exposure Tests

```javascript
describe('Data Security', () => {
  it('should not expose sensitive data in logs', () => {
    const logger = createLogger();
    logger.log({ password: 'secret123' });
    
    expect(logger.lastMessage).not.toContain('secret123');
  });

  it('should not expose stack traces in production', async () => {
    const response = await request(app)
      .get('/error')
      .set('NODE_ENV', 'production');
    
    expect(response.text).not.toContain('Error:');
    expect(response.text).not.toContain('Stack trace');
  });
});
```

## Best Practices

### 1. Security First

```javascript
// Always validate input
function validateInput(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input');
  }
  if (input.length > 1000) {
    throw new Error('Input too long');
  }
  return input.trim();
}
```

### 2. Use Security Headers

```javascript
// Express middleware
app.use(helmet());

// Custom headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

### 3. Environment Variables

```javascript
// Never hardcode secrets
const apiKey = process.env.API_KEY;

// Validate required env vars
const requiredEnvVars = ['API_KEY', 'DATABASE_URL'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required env var: ${varName}`);
  }
});
```

### 4. Regular Security Audits

```yaml
# GitHub Actions - Security scan
name: Security Scan
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

## OWASP Top 10 Checklist

- [ ] Injection (SQL, NoSQL, OS command)
- [ ] Broken Authentication
- [ ] Sensitive Data Exposure
- [ ] XML External Entities (XXE)
- [ ] Broken Access Control
- [ ] Security Misconfiguration
- [ ] Cross-Site Scripting (XSS)
- [ ] Insecure Deserialization
- [ ] Using Components with Known Vulnerabilities
- [ ] Insufficient Logging & Monitoring
