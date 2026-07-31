# Configuration

## Security Tools Configuration

### OpenSSL Configuration

### Generate Private Key

```bash
openssl genrsa -out private.key 2048
```

### Generate CSR

```bash
openssl req -new -key private.key -out request.csr
```

### Self-Signed Certificate

```bash
openssl x509 -req -days 365 -in request.csr -signkey private.key -out certificate.crt
```

### Generate Certificate Bundle

```bash
cat certificate.crt intermediate.crt > bundle.crt
```

### GPG Configuration

### Generate Key Pair

```bash
gpg --full-generate-key
```

### Export Public Key

```bash
gpg --export --armor your-email@example.com > public.key
```

### Import Public Key

```bash
gpg --import public.key
```

### Encrypt File

```bash
gpg --encrypt --recipient recipient@example.com file.txt
```

### Decrypt File

```bash
gpg --decrypt file.txt.gpg
```

## Application Configuration

### Environment Variables

```bash
# .env
JWT_SECRET=your-secret-key
ENCRYPTION_KEY=your-encryption-key
DATABASE_PASSWORD=your-db-password
```

### Security Headers

```typescript
import { Request, Response, NextFunction } from 'express';

function securityHeaders(req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
}

app.use(securityHeaders);
```

### CORS Configuration

```typescript
import cors from 'cors';

app.use(cors({
  origin: 'https://example.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Rate Limiting Configuration

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
});

app.use(limiter);
```

### Session Configuration

```typescript
import session from 'express-session';

app.use(session({
  secret: 'secret-key',
  cookie: {
    maxAge: 3600 * 24, // 24 hours
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  },
}));
```

### JWT Configuration

```typescript
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { sub: user.id },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

## Database Security Configuration

### PostgreSQL

```sql
-- Create user with limited permissions
CREATE USER app_user WITH PASSWORD 'secure-password';

-- Grant specific permissions
GRANT SELECT, INSERT, UPDATE ON mytable TO app_user;

-- Revoke unnecessary permissions
REVOKE ALL ON mytable FROM app_user;
GRANT SELECT, INSERT, UPDATE ON mytable TO app_user;
```

### MySQL

```sql
-- Create user with limited permissions
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'secure-password';

-- Grant specific permissions
GRANT SELECT, INSERT, UPDATE ON mydb.mytable TO 'app_user'@'localhost';

-- Revoke unnecessary permissions
REVOKE ALL PRIVILEGES ON mydb.mytable FROM 'app_user'@'localhost';
GRANT SELECT, INSERT, UPDATE ON mydb.mytable TO 'app_user'@'localhost';
```

## Firewall Configuration

### UFW (Ubuntu)

```bash
# Enable firewall
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Deny all other traffic
sudo ufw default deny incoming
```

### iptables

```bash
# Allow SSH
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Drop all other traffic
iptables -A INPUT -j DROP
```

## SSL/TLS Configuration

### Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
}
```

### Apache

```apache
<VirtualHost *:443>
    ServerName example.com

    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key

    SSLProtocol all -SSLv2 -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite HIGH:!aNULL:!MD5
    SSLHonorCipherOrder on
</VirtualHost>
```

## Logging Configuration

### TypeScript

```typescript
// Enable security logging
console.log = function(...args: any[]) {
  const timestamp = new Date().toISOString();
  process.stdout.write(`[SECURITY] [${timestamp}] `);
  process.stdout.write(args.join(' ') + '\n');
};

// Log security events
console.log(`Authentication failed for user: ${username}`);
console.log(`Authorization denied for user: ${username}, resource: ${resource}`);
```
