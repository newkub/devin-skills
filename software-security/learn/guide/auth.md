# Authentication และ Authorization

## Authentication Methods

### Password-Based Authentication

**Flow**:
1. User submits username and password
2. Server retrieves stored password hash
3. Server hashes submitted password
4. Server compares hashes
5. Access granted if match

**Example (TypeScript)**:

```typescript
import bcrypt from 'bcrypt';

async function authenticate(username: string, password: string): Promise<boolean> {
  // Retrieve user from database
  const user = await getUser(username);
  
  // Compare password hash
  return await bcrypt.compare(password, user.passwordHash);
}
```

### Multi-Factor Authentication (MFA)

**Methods**:
- SMS OTP
- TOTP (Time-based One-Time Password)
- Hardware token
- Biometric

**Example (TypeScript with TOTP)**:

```typescript
import { authenticator } from 'otplib';

function verifyTOTP(secret: string, code: string): boolean {
  return authenticator.verify({ token: code, secret });
}
```

### OAuth 2.0

**Flow**:
1. Client redirects to authorization server
2. User authorizes
3. Authorization server returns authorization code
4. Client exchanges code for access token
5. Client uses access token to access resources

**Example (TypeScript)**:

```typescript
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  redirectUri: 'https://example.com/callback',
});

async function exchangeToken(code: string) {
  const { tokens } = await client.getToken(code);
  return tokens;
}
```

### JWT (JSON Web Tokens)

**Structure**:
```
Header.Payload.Signature
```

**Example (TypeScript)**:

```typescript
import jwt from 'jsonwebtoken';

const jwtSecret = 'your-secret-key';

function generateToken(userID: string): string {
  return jwt.sign(
    { sub: userID },
    jwtSecret,
    { expiresIn: '24h' }
  );
}

function validateToken(tokenString: string): any {
  try {
    return jwt.verify(tokenString, jwtSecret);
  } catch (error) {
    throw new Error('Invalid token');
  }
}
```

### Session-Based Authentication

**Flow**:
1. User authenticates
2. Server creates session
3. Server generates session ID
4. Server stores session data
5. Server sends session ID to client (cookie)
6. Client sends session ID with requests
7. Server validates session

**Example (TypeScript with Express)**:

```typescript
import express from 'express';
import session from 'express-session';

const app = express();

app.use(session({
  secret: 'session-secret',
  cookie: { maxAge: 3600000 }, // 1 hour
}));

function createSession(req: express.Request, userID: string): void {
  req.session!.userID = userID;
}

function validateSession(req: express.Request): string | null {
  return req.session!.userID || null;
}
```

## Authorization Models

### RBAC (Role-Based Access Control)

**Concept**: Users assigned to roles, roles have permissions

**Example (TypeScript)**:

```typescript
type Role = 'admin' | 'user';

interface User {
  id: number;
  name: string;
  role: Role;
}

function canAccess(user: User, resource: string): boolean {
  switch (user.role) {
    case 'admin':
      return true;
    case 'user':
      return resource === `user-${user.id}`;
    default:
      return false;
  }
}
```

### ABAC (Attribute-Based Access Control)

**Concept**: Policies based on user, resource, and environment attributes

**Example (TypeScript)**:

```typescript
interface User {
  id: number;
  role: string;
  department: string;
}

interface Resource {
  id: number;
  type: string;
  owner: string;
}

interface Environment {
  time: string;
  location: string;
}

function evaluatePolicy(user: User, resource: Resource, env: Environment): boolean {
  // Policy: Admins can access anything during business hours
  if (user.role === 'admin' && env.time >= '09:00' && env.time <= '17:00') {
    return true;
  }
  
  // Policy: Users can access their own resources
  if (resource.owner === `user-${user.id}`) {
    return true;
  }
  
  return false;
}
```

## Permission Checks

### Middleware (TypeScript with Express)

```typescript
import { Request, Response, NextFunction } from 'express';

function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  try {
    const decoded = validateToken(token);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

## Best Practices

### 1. Use HTTPS for Authentication

```typescript
// ✅ Good: HTTPS only
if (req.protocol !== 'https') {
  return res.redirect(`https://${req.hostname}${req.originalUrl}`);
}
```

### 2. Implement Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// ✅ Good: Rate limit authentication
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
});

app.use('/api/auth', limiter);
```

### 3. Use Secure Session Cookies

```typescript
// ✅ Good: Secure session cookies
app.use(session({
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  },
}));
```

### 4. Rotate Tokens

```typescript
// ✅ Good: Token rotation
function rotateToken(oldToken: string): string {
  const claims = validateToken(oldToken);
  return generateToken(claims.sub);
}
```

### 5. Implement Logout

```typescript
// ✅ Good: Invalidate session
function logout(req: express.Request, res: express.Response): void {
  req.session!.destroy(() => {
    res.clearCookie('session');
    res.json({ message: 'Logged out' });
  });
}
```
