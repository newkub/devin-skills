# How It Works

## Security Mechanisms ทำงานอย่างไร

### Authentication Flow

### Password-Based Authentication

**How it works**:
1. User submits credentials
2. Server retrieves stored hash
3. Server hashes submitted password
4. Server compares hashes
5. Access granted if match

**Example**:

```
Client                          Server
  |                               |
  |--- username, password ------>|
  |                               |
  |<-- access token ------------|
  |                               |
  |    Authentication Complete  |
```

### JWT Authentication

**How it works**:
1. User submits credentials
2. Server validates credentials
3. Server generates JWT
4. Server signs JWT with secret key
5. Client stores JWT
6. Client sends JWT with requests
7. Server verifies JWT signature

**Example**:

```
Client                          Server
  |                               |
  |--- credentials ------------>|
  |                               |
  |<-- JWT (signed) -------------|
  |                               |
  |--- request + JWT ---------->|
  |                               |
  |<-- response ----------------|
```

### Encryption Flow

### Symmetric Encryption

**How it works**:
1. Generate random key
2. Encrypt data with key
3. Store encrypted data
4. Decrypt with same key

**Example**:

```
Plaintext + Key = Ciphertext
Ciphertext + Key = Plaintext
```

### Asymmetric Encryption

**How it works**:
1. Generate key pair (public, private)
2. Share public key
3. Encrypt with public key
4. Decrypt with private key

**Example**:

```
Plaintext + Public Key = Ciphertext
Ciphertext + Private Key = Plaintext
```

### Hashing Flow

**How it works**:
1. Input data
2. Apply hash function
3. Output fixed-size hash
4. Cannot reverse (one-way)

**Example**:

```
Input: "password"
Hash: SHA-256("password") = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
```

### Password Hashing with Salt

**How it works**:
1. Generate random salt
2. Combine password + salt
3. Hash combined value
4. Store salt + hash
5. Verify by repeating process

**Example**:

```
Password: "password"
Salt: "randomsalt"
Hash: SHA-256("password" + "randomsalt")
Stored: "randomsalt$hash"
```

### SSL/TLS Handshake

**How it works**:
1. Client sends ClientHello
2. Server responds with ServerHello + Certificate
3. Client verifies certificate
4. Client generates pre-master secret
5. Client encrypts with server public key
6. Server decrypts with private key
7. Both generate session keys
8. Secure connection established

**Example**:

```
Client                          Server
  |                               |
  |--- ClientHello ------------>|
  |                               |
  |<-- ServerHello + Certificate|
  |                               |
  |--- ClientKeyExchange ------->|
  |                               |
  |--- ChangeCipherSpec -------->|
  |                               |
  |--- Finished --------------->|
  |                               |
  |<-- ChangeCipherSpec ---------|
  |                               |
  |<-- Finished ----------------|
  |                               |
  |    Secure Connection        |
```

### Access Control Flow

### RBAC (Role-Based Access Control)

**How it works**:
1. User assigned to role
2. Role assigned permissions
3. User inherits role permissions
4. Access check based on permissions

**Example**:

```
User: john
Role: admin
Permissions: [read, write, delete]

Check: john.role.permissions.includes('write') = true
```

### ABAC (Attribute-Based Access Control)

**How it works**:
1. Define attributes (user, resource, environment)
2. Define policies based on attributes
3. Evaluate policies at runtime
4. Grant/deny based on policy evaluation

**Example**:

```
User: {role: 'admin', department: 'IT'}
Resource: {type: 'server', owner: 'IT'}
Environment: {time: '9-5', location: 'office'}

Policy: allow if user.role == 'admin' and resource.owner == user.department
Result: allow
```

### Session Management

### Session Creation

**How it works**:
1. User authenticates
2. Server generates session ID
3. Server stores session data
4. Server sends session ID to client
5. Client stores session ID (cookie)

### Session Validation

**How it works**:
1. Client sends session ID
2. Server retrieves session data
3. Server validates session
4. Access granted if valid

### Session Expiration

**How it works**:
1. Session has expiration time
2. Server checks expiration
3. Session invalidated if expired
4. Client must re-authenticate

### Rate Limiting

**How it works**:
1. Track requests per user/IP
2. Compare against limit
3. Block if limit exceeded
4. Reset after time window

**Example**:

```
User: john
Limit: 100 requests/hour
Current: 50 requests
Result: allow

User: john
Limit: 100 requests/hour
Current: 101 requests
Result: block
```
