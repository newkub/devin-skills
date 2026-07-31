# Best Practices

## Password Security

- **Use bcrypt** สำหรับ password hashing
- **Enforce password policy** ความยาว 12+ ตัวอักษร ผสมตัวพิมพ์ใหญ่ ตัวเลข และอักขระพิเศษ

## Authentication

- **Use MFA** สำหรับความปลอดภัยเพิ่มเติม
- **Implement rate limiting** ป้องกัน brute force attacks
- **Secure session management** httpOnly, secure, sameSite cookies

## Authorization

- **Use least privilege** ให้สิทธิต่ำสุดที่จำเป็น
- **Validate on server-side** ไม่พึ่งพึ่ง client-side validation

## Cryptography

- **Use AES-256** สำหรับ encryption
- **Never store secrets in code** ใช้ environment variables
- **Use key management services** AWS KMS, HashiCorp Vault

## Input Validation

- **Validate all input** ตรวจสอบ email, URLs, ข้อมูลผู้ใช้
- **Use parameterized queries** ป้องกัน SQL injection

## Output Encoding

- **Encode output** ป้องกัน XSS
- **Use CSP** Content Security Policy

## Error Handling

- **Don't expose sensitive info** ใช้ generic error messages

## Logging

- **Log security events** authentication failures, authorization denials
- **Protect logs** redact sensitive data

## HTTPS

- **Always use HTTPS** force HTTPS redirects
- **Use strong TLS** TLS 1.2+, strong ciphers

## Dependencies

- **Keep dependencies updated** bun audit fix
- **Scan for vulnerabilities** bun audit, snyk test

## Testing

- **Include security tests** SQL injection, XSS prevention
- **Perform penetration testing** OWASP ZAP, Burp Suite
