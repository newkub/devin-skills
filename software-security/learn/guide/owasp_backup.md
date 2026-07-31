# OWASP Top 10 Vulnerabilities

## 1. Broken Access Control

### Description

Users can act outside of their intended permissions

### Example

```typescript
// ❌ Vulnerable: No authorization check
function getUser(req: Request, res: Response): void {
  const userID = req.query.id as string;
  const user = getUserByID(userID);
  res.json(user);
}

// ✅ Secure: Check authorization
function getUser(req: Request, res: Response): void {
  const userID = req.query.id as string;
  
  // Check if user can access this resource
  if (!canAccess(req, userID)) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  
  const user = getUserByID(userID);
  res.json(user);
}
```

### Prevention

- Implement proper authorization checks
- Use deny-by-default approach
- Validate permissions on server-side
- Implement principle of least privilege

### 2. Cryptographic Failures

### Description

Poor use of cryptography or lack of encryption

### Example

```go
// ❌ Vulnerable: Plain text passwords
func saveUser(user User) error {
    query := "INSERT INTO users (password) VALUES (?)"
    _, err := db.Exec(query, user.Password)
    return err
}

// ✅ Secure: Hash passwords
func saveUser(user User) error {
    hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
    if err != nil {
        return err
    }
    
    query := "INSERT INTO users (password_hash) VALUES (?)"
    _, err := db.Exec(query, hash)
    return err
}
```

### Prevention

- Hash passwords with bcrypt/scrypt/Argon2
- Use strong encryption (AES-256)
- Use HTTPS everywhere
- Validate SSL certificates
- Never store secrets in code

## 3. Injection

### Description

Untrusted data sent to interpreter as command or query

### SQL Injection Example

```typescript
// ❌ Vulnerable: SQL injection
async function getUser(username: string): Promise<User> {
  const query = `SELECT * FROM users WHERE username = '${username}'`;
  // Attacker can inject: ' OR '1'='1
}

// ✅ Secure: Parameterized query
async function getUser(username: string): Promise<User> {
  const query = 'SELECT * FROM users WHERE username = ?';
  const row = await db.query(query, [username]);
  // Safe from injection
}
```

### XSS Example

```typescript
import escape from 'escape-html';

// ❌ Vulnerable: XSS
app.get('/search', (req, res) => {
  const query = req.query.q as string;
  res.send(`Results for: ${query}`);
  // Attacker can inject: <script>alert('XSS')</script>
});

// ✅ Secure: HTML encoding
app.get('/search', (req, res) => {
  const query = req.query.q as string;
  res.send(`Results for: ${escape(query)}`);
});
```

### Prevention

- Use parameterized queries
- Validate and sanitize input
- Use ORM/Query builders
- Encode output (HTML, URL, JS)
- Use Content Security Policy

## 4. Insecure Design

### Description

Flaws in security architecture

### Example

```typescript
// ❌ Vulnerable: No security requirements
// No threat modeling
// Insecure by design

// ✅ Secure: Security-first design
// Threat modeling
// Security requirements
```

### Prevention

- Perform threat modeling
- Define security requirements
- Implement security by design
- Use secure frameworks
- Regular security reviews

## 5. Security Misconfiguration

### Description

Incorrect security settings

### Example

```typescript
// ❌ Vulnerable: Default credentials
if (username === 'admin' && password === 'admin123') {
  // Attacker can access with default credentials
}

// ✅ Secure: Force password change
if (user.isDefaultPassword) {
  forcePasswordChange(user);
}

// ❌ Vulnerable: Verbose error messages
res.status(500).json({ error: `Database error: ${err.message}` });

// ✅ Secure: Generic error message
res.status(500).json({ error: 'An error occurred' });
```

### Prevention

- Remove default credentials
- Disable unnecessary features
- Use generic error messages
- Implement proper logging
- Regular security audits

## 6. Vulnerable Components

### Description

Using outdated or vulnerable libraries

### Example

```bash
# ❌ Vulnerable: Outdated dependencies
bun install express@3.0.0  # Has known vulnerabilities

# ✅ Secure: Update dependencies
bun audit fix
bun update
```

### Prevention

- Keep dependencies updated
- Use dependency scanning tools
- Monitor security advisories
- Remove unused dependencies
- Use software composition analysis (SCA)

## 7. Authentication Failures

### Description

Weak authentication mechanisms

### Example

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
});

// ❌ Vulnerable: No rate limiting
function login(username: string, password: string): void {
  // Attacker can brute force passwords
}

// ✅ Secure: Rate limiting
function login(username: string, password: string): void {
  if (!limiter) {
    throw new Error('Too many attempts');
  }
}

// ❌ Vulnerable: Weak password policy
if (password.length < 6) {
  throw new Error('Password too short');
}

// ✅ Secure: Strong password policy
if (!isStrongPassword(password)) {
  throw new Error('Password must be strong');
}
```

### Prevention

- Implement rate limiting
- Use strong password policies
- Implement MFA
- Secure session management
- Implement account lockout

## 8. Software/Data Integrity Failures

### Description

Code or data tampering

### Example

```bash
# ❌ Vulnerable: No code signing
# Unsigned code can be tampered

# ✅ Secure: Code signing
gpg --sign --detach-sign app.exe
```

### Prevention

- Sign code and updates
- Use secure CI/CD pipelines
- Verify signatures
- Use subresource integrity (SRI)
- Implement checksums

## 9. Logging Failures

### Description

Insufficient logging and monitoring

### Example

```typescript
// ❌ Vulnerable: No security logging
function login(username: string, password: string): void {
  // No logging of authentication attempts
}

// ✅ Secure: Security logging
function login(username: string, password: string): void {
  console.log(`Authentication attempt: user=${username}, ip=${clientIP}, success=${success}`);
}
```

### Prevention

- Log security events
- Implement intrusion detection
- Monitor for anomalies
- Protect log files
- Regular log reviews

## 10. Server-Side Request Forgery (SSRF)

### Description

Server making unauthorized requests

### Example

```typescript
// ❌ Vulnerable: SSRF
async function fetchURL(url: string): Promise<string> {
  const resp = await fetch(url);
  // Attacker can request internal resources
}

// ✅ Secure: URL validation
async function fetchURL(url: string): Promise<string> {
  if (!isAllowedURL(url)) {
    throw new Error('URL not allowed');
  }
  const resp = await fetch(url);
  return resp.text();
}
```

### Prevention

- Validate and sanitize URLs
- Use allow-lists
- Implement network segmentation
- Disable unnecessary URL schemes
- Use proxy for external requests
