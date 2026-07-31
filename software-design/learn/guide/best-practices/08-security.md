# Security

## 19. Validate All Inputs

Validate inputs ทุกที่:

```typescript
// ✅ Good: Input validation
CreateUser(string email, string password) {
  if (string.IsNullOrWhiteSpace(email))
    throw new ArgumentException("Email is required");
  
  if (!IsValidEmail(email))
    throw new ArgumentException("Invalid email format");
  
  if (password.Length < 8)
    throw new ArgumentException("Password must be at least 8 characters");
}

// ❌ Bad: No validation
CreateUser(string email, string password) {
  // No validation
}
```

## 20. Use Secure Defaults

Use secure defaults โดย default:

```typescript
// ✅ Good: Secure defaults
class Configuration {
  public boolean EnableHttps { get; set; } = true;
  public boolean RequireAuthentication { get; set; } = true;
  public number SessionTimeoutMinutes { get; set; } = 30;
}

// ❌ Bad: Insecure defaults
class Configuration {
  public boolean EnableHttps { get; set; } = false;
  public boolean RequireAuthentication { get; set; } = false;
}
```
