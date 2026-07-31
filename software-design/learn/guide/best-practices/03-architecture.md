# Architecture

## 8. Define Clear Boundaries

กำหนด boundaries ที่ชัดเจนระหว่าง components:

```yaml
# ✅ Good: Clear boundaries
bounded_contexts:
  - name: user
    entities: [User, Profile]
    services: [UserService]
  - name: order
    entities: [Order, OrderItem]
    services: [OrderService]
```

## 9. Use Dependency Injection

Inject dependencies แทนที่จะ create ใน class:

```typescript
// ✅ Good: DI
class Startup {
  ConfigureServices(IServiceCollection services) {
    services.AddScoped<IUserRepository, UserRepository>();
    services.AddScoped<UserService>();
  }
}

// ❌ Bad: Manual instantiation
class UserService {
  private UserRepository _repository = new UserRepository();
}
```
