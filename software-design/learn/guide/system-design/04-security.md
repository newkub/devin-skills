# Security Design

## Authentication vs Authorization

**Authentication**: Who are you?

**Authorization**: What can you do?

**Example**:

```typescript
// Authentication
const user = await authService.AuthenticateAsync(username, password);

// Authorization
if (!authorizationService.CanAccess(user, resource, action)) {
  throw new UnauthorizedAccessException();
}
```

## Security Best Practices

**Input Validation**:
- Validate all inputs
- Use parameterized queries
- Sanitize user input

**Output Encoding**:
- Encode HTML output
- Encode JSON output
- Use safe APIs

**Encryption**:
- Encrypt sensitive data at rest
- Use TLS in transit
- Key management

**Defense in Depth**:
- Multiple security layers
- Fail securely
- Least privilege
