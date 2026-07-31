# Key Concept

## Security Engineering Fundamentals

### CIA Triad

### Confidentiality

**Definition**: Protecting data from unauthorized access

**Examples**:
- Encryption
- Access controls
- Authentication

### Integrity

**Definition**: Ensuring data accuracy and consistency

**Examples**:
- Hashing
- Digital signatures
- Version control

### Availability

**Definition**: Ensuring systems are accessible when needed

**Examples**:
- Redundancy
- Load balancing
- DDoS protection

### Authentication vs Authorization

### Authentication

**Definition**: Verifying identity

**Methods**:
- Password-based
- Multi-factor (MFA)
- Biometric
- Certificate-based

**Example**:

```typescript
// Password authentication
if (await verifyPassword(username, password)) {
  // User authenticated
}
```

### Authorization

**Definition**: Verifying permissions

**Methods**:
- Role-based (RBAC)
- Attribute-based (ABAC)
- Policy-based

**Example**:

```typescript
// Role-based authorization
if (user.role === 'admin') {
  // User authorized
}
```

### Cryptography Basics

### Symmetric Encryption

**Definition**: Same key for encryption and decryption

**Algorithms**: AES, ChaCha20, 3DES

**Example**:

```typescript
import crypto from 'crypto';

const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

let encrypted = cipher.update('secret message', 'utf8', 'hex');
encrypted += cipher.final('hex');
```

### Asymmetric Encryption

**Definition**: Public key for encryption, private key for decryption

**Algorithms**: RSA, ECC, ElGamal

**Example**:

```typescript
import crypto from 'crypto';

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});
```

### Hashing

**Definition**: One-way function to verify data integrity

**Algorithms**: SHA-256, SHA-512, MD5 (deprecated)

**Example**:

```typescript
import crypto from 'crypto';

const hash = crypto.createHash('sha256').update('data').digest('hex');
```

### OWASP Top 10

### 1. Broken Access Control

**Definition**: Improper implementation of authorization

**Example**:
- Users can access admin endpoints
- IDOR (Insecure Direct Object References)

### 2. Cryptographic Failures

**Definition**: Poor use of cryptography

**Example**:
- Storing passwords in plain text
- Using weak encryption
- Not validating certificates

### 3. Injection

**Definition**: Untrusted data sent to interpreter

**Example**:
- SQL injection
- Command injection
- XSS (Cross-Site Scripting)

### 4. Insecure Design

**Definition**: Flaws in security architecture

**Example**:
- No security requirements
- Lack of threat modeling
- Insecure by design

### 5. Security Misconfiguration

**Definition**: Incorrect security settings

**Example**:
- Default credentials
- Unnecessary features enabled
- Verbose error messages

### 6. Vulnerable Components

**Definition**: Using outdated libraries

**Example**:
- Known CVEs in dependencies
- Unpatched vulnerabilities

### 7. Authentication Failures

**Definition**: Weak authentication mechanisms

**Example**:
- Weak passwords
- No rate limiting
- Session fixation

### 8. Software/Data Integrity Failures

**Definition**: Code or data tampering

**Example**:
- No code signing
- Insecure CI/CD pipeline
- Unsigned updates

### 9. Logging Failures

**Definition**: Insufficient logging and monitoring

**Example**:
- No audit logs
- Log tampering
- No intrusion detection

### 10. Server-Side Request Forgery (SSRF)

**Definition**: Server making unauthorized requests

**Example**:
- Fetching internal resources
- Accessing cloud metadata

### Security Principles

### Defense in Depth

**Definition**: Multiple layers of security

**Example**:
- Firewall + WAF + Application security
- Authentication + Authorization + Encryption

### Least Privilege

**Definition**: Minimum necessary access

**Example**:
- User can only access their own data
- Service accounts with minimal permissions

### Fail Securely

**Definition**: System fails to secure state

**Example**:
- Access denied on error
- Session invalidated on timeout
