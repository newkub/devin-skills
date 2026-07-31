# Troubleshooting

## การแก้ปัญหาที่พบบ่อยใน Security

### Authentication Issues

**Authentication Fails**
- **Symptoms**: Users cannot log in, Invalid token errors, Session expiration
- **Causes**: Wrong password hash, Token expiration, Session timeout, Clock skew
- **Solutions**: Handle authentication errors with bcrypt, Handle token expiration with jwt.verify

**Session Hijacking**
- **Symptoms**: Unauthorized access, Session theft, User impersonation
- **Causes**: Session ID in URL, Unencrypted cookies, No session expiration, XSS vulnerabilities
- **Solutions**: Secure session configuration (httpOnly, secure, sameSite), Regenerate session on login

### Encryption Issues

**Decryption Fails**
- **Symptoms**: Cannot decrypt data, Invalid padding errors, Key mismatch
- **Causes**: Wrong key, Corrupted data, Wrong algorithm, IV mismatch
- **Solutions**: Handle decryption errors with try-catch, Validate key and algorithm

**Weak Encryption**
- **Symptoms**: Data easily decrypted, Known vulnerabilities, Outdated algorithms
- **Causes**: Weak key size, Deprecated algorithms, Poor implementation
- **Solutions**: Use AES-256 with 256-bit key, Avoid DES and deprecated algorithms

### Injection Issues

**SQL Injection**
- **Symptoms**: Data leakage, Unauthorized access, Data corruption
- **Causes**: String concatenation, No input validation, No parameterized queries
- **Solutions**: Use parameterized queries, Validate input

**XSS**
- **Symptoms**: Script execution, Cookie theft, Session hijacking
- **Causes**: No output encoding, Unsafe innerHTML, No CSP
- **Solutions**: HTML encode output with escape-html, Use Content Security Policy

### SSL/TLS Issues

**Certificate Error**
- **Symptoms**: Certificate validation failed, Handshake error, Connection refused
- **Causes**: Expired certificate, Wrong hostname, Self-signed certificate, Certificate chain issue
- **Solutions**: Validate certificates with rejectUnauthorized, Use proper servername

### Debugging Tips

- **Enable debug logging**: Log security events with timestamps
- **Use security tools**: OWASP ZAP, Burp Suite, Nmap
- **Check SSL configuration**: openssl s_client, openssl x509
- **Monitor logs**: tail -f /var/log/auth.log, /var/log/error.log

### Common Pitfalls

- **Hardcoding secrets**: Use environment variables instead
- **Not validating input**: Validate email, URLs, user data
- **Not using HTTPS**: Force HTTPS redirects
- **Not implementing rate limiting**: Use express-rate-limit
