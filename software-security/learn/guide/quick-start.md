# Quick Start

## เริ่มต้น Security Engineering อย่างรวดเร็ว

### Step 1: สร้าง Project Structure

```bash
mkdir security-demo
cd security-demo
mkdir src tests docs keys
```

### Step 2: สร้าง Password Hashing (TypeScript)

**src/password_hash.ts**:
```typescript
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 14);
}

async function checkPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

async function main() {
  const password = 'my-secure-password';
  
  const hash = await hashPassword(password);
  console.log(`Hash: ${hash}`);
  
  const valid = await checkPassword(password, hash);
  console.log(`Valid: ${valid}`);
}

main();
```

### Step 3: สร้าง JWT Authentication (TypeScript)

**src/jwt_auth.ts**:
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

const token = generateToken('user123');
console.log(`Token: ${token}`);

const claims = validateToken(token);
console.log(`User ID: ${claims.sub}`);
```

### Step 4: สร้าง Encryption (TypeScript)

**src/encryption.ts**:
```typescript
import crypto from 'crypto';

function encrypt(key: Buffer, plaintext: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(key: Buffer, ciphertext: string): string {
  const parts = ciphertext.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

const key = Buffer.from('32-byte-long-key-123456789012345');
const plaintext = 'secret message';

const encrypted = encrypt(key, plaintext);
console.log(`Encrypted: ${encrypted}`);

const decrypted = decrypt(key, encrypted);
console.log(`Decrypted: ${decrypted}`);
```

### Step 5: สร้าง Hashing (TypeScript)

**src/hashing.ts**:
```typescript
import crypto from 'crypto';

function hash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

const data = 'important data';
const hashValue = hash(data);

console.log(`Data: ${data}`);
console.log(`Hash: ${hashValue}`);
```

### Step 6: สร้าง Tests

**tests/password_test.ts**:
```typescript
import { hashPassword, checkPassword } from '../src/password_hash';

async function testHashPassword() {
  const password = 'test-password';
  
  const hash = await hashPassword(password);
  const valid = await checkPassword(password, hash);
  
  if (!valid) {
    throw new Error('Password check failed');
  }
  
  const invalid = await checkPassword('wrong-password', hash);
  if (invalid) {
    throw new Error('Wrong password accepted');
  }
  
  console.log('All tests passed');
}

testHashPassword();
```

### Step 7: Build และ Run

```bash
# Run password hashing
bun run src/password_hash.ts

# Run JWT auth
bun run src/jwt_auth.ts

# Run encryption
bun run src/encryption.ts

# Run hashing
bun run src/hashing.ts

# Run tests
bun test tests/
```

### Step 8: Generate SSL Certificate

```bash
# Generate private key
openssl genrsa -out keys/private.key 2048

# Generate CSR
openssl req -new -key keys/private.key -out keys/request.csr

# Generate self-signed certificate
openssl x509 -req -days 365 -in keys/request.csr -signkey keys/private.key -out keys/certificate.crt
```

### Step 9: Test with curl

```bash
# Test with JWT
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/users

# Test with HTTPS
curl -k https://localhost:8443/api/users
```

### Next Steps

1. อ่าน `key-concept.md` สำหรับ concepts เพิ่มเติม
2. ดู `how-it-works.md` สำหรับ security mechanisms
3. ศึกษา `auth.md` สำหรับ authentication และ authorization
4. ดู `cryptography.md` สำหรับ cryptography basics
5. ดู `owasp.md` สำหรับ OWASP top 10
