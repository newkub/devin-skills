# Security Best Practices สำหรับ Tauri

## Security Principles

### 1. Least Privilege

- Grant minimal permissions ที่จำเป็นเท่านั้น
- ใช้ capability-based security model
- Restrict file system access ด้วย allowlists

### 2. Input Validation

- Validate all inputs ทั้ง frontend และ backend
- Sanitize user-generated content
- Use type-safe validation (Zod, serde)

### 3. Secure IPC Communication

- Validate IPC command parameters
- Implement rate limiting
- Use secure serialization

## Configuration Security

### 1. tauri.conf.json Security

```json
{
  "tauri": {
    "allowlist": {
      "fs": {
        "all": false,
        "readFile": true,
        "writeFile": false,
        "scope": ["$HOME/documents/*"]
      },
      "shell": {
        "all": false,
        "open": true
      }
    }
  }
}
```

**Best Practices**
- Disable `all: true` สำหรับ sensitive APIs
- Use specific scopes แทน wildcard
- Restrict to necessary directories

### 2. Environment Variables

- ใช้ environment variables สำหรับ secrets
- ไม่ hardcode API keys ใน source code
- ใช้ `.env` files สำหรับ development เท่านั้น

## Rust Backend Security

### 1. Safe Rust Practices

- ใช้ Rust's type system สำหรับ memory safety
- หลีกเลี่ยง `unsafe` code ถ้าไม่จำเป็น
- Validate external input ก่อน processing

### 2. File System Security

```rust
// Bad: Unrestricted access
fn read_any_file(path: String) -> Result<String> {
    fs::read_to_string(path)
}

// Good: Restricted access
fn read_allowed_file(path: String) -> Result<String> {
    let allowed_dir = PathBuf::from("$HOME/documents");
    let full_path = allowed_dir.join(path);

    if !full_path.starts_with(&allowed_dir) {
        return Err("Path traversal detected".into());
    }

    fs::read_to_string(full_path)
}
```

### 3. Command Injection Prevention

- ใช้ structured command execution
- ไม่ concatenate user input โดยตรง
- Validate and sanitize shell commands

## Frontend Security

### 1. XSS Prevention

- Sanitize HTML ก่อน rendering
- ใช้ frameworks ที่ auto-escape (React, Vue)
- ใช้ Content Security Policy (CSP)

### 2. CSRF Protection

- Implement CSRF tokens
- Validate origin headers
- Use same-site cookies

### 3. Secure Storage

```typescript
// Use Tauri's secure storage
import { invoke } from '@tauri-apps/api/tauri'

// Store sensitive data
await invoke('secure_store', { key: 'api_key', value: 'secret' })

// Retrieve
const value = await invoke('secure_retrieve', { key: 'api_key' })
```

## Network Security

### 1. HTTPS Only

- Enforce HTTPS สำหรับ all API calls
- Validate SSL certificates
- ใช้ certificate pinning สำหรับ critical APIs

### 2. API Security

- Implement authentication และ authorization
- Use rate limiting
- Validate API responses

### 3. WebSocket Security

- Use WSS (WebSocket Secure)
- Implement authentication
- Validate message formats

## Data Protection

### 1. Encryption

- Encrypt sensitive data at rest
- ใช้ platform keychains สำหรับ secrets
- Implement secure key management

### 2. Data Sanitization

- Sanitize logs สำหรับ sensitive information
- ไม่ log passwords หรือ tokens
- Implement data retention policies

## Update Management

### 1. Secure Updates

- Verify update signatures
- Use Tauri's built-in updater
- Implement rollback capability

### 2. Dependency Security

- Regularly update dependencies
- Use `cargo audit` สำหรับ Rust
- Use `bun audit` สำหรับ JavaScript

## Common Security Vulnerabilities

### 1. Path Traversal

**Prevention**
- Validate file paths
- Use canonical paths
- Restrict to allowed directories

### 2. Command Injection

**Prevention**
- Use structured APIs
- Validate all inputs
- Avoid shell execution

### 3. XSS

**Prevention**
- Sanitize all user input
- Use auto-escaping frameworks
- Implement CSP

### 4. Insecure Storage

**Prevention**
- Use secure storage APIs
- Encrypt sensitive data
- ไม่ store secrets in plain text

## Security Checklist

- [ ] Review allowlist configuration
- [ ] Validate all IPC commands
- [ ] Implement input validation
- [ ] Use secure storage for secrets
- [ ] Enable HTTPS for all network calls
- [ ] Regularly update dependencies
- [ ] Implement rate limiting
- [ ] Sanitize logs
- [ ] Test for common vulnerabilities
- [ ] Document security decisions
