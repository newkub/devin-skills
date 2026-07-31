# Documentation

## 15. Document Public APIs

Document interfaces และ public methods:

```typescript
/// <summary>
/// Service for managing user operations
/// </summary>
interface IUserService {
  /// <summary>
  /// Creates a new user
  /// </summary>
  /// <param name="email">User's email address</param>
  /// <param name="name">User's display name</param>
  /// <returns>The created user</returns>
  /// <exception cref="ArgumentException">Thrown when email is invalid</exception>
  Promise<User> CreateUserAsync(string email, string name);
}
```

## 16. Keep Documentation Updated

Update documentation เมื่อ code เปลี่ยน:

```typescript
// Update docs when API changes
// @deprecated Use CreateUserAsync instead
[Obsolete("Use CreateUserAsync instead")]
public User CreateUser(string email, string name) { }
```
