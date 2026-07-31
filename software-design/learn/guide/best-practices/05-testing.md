# Testing

## 13. Write Testable Code

Design code ให้ง่ายต่อการ test:

```typescript
// ✅ Good: Testable with DI
class UserService {
  private IUserRepository _repository;
  
  public UserService(IUserRepository repository) {
    _repository = repository;
  }
}

// Test with mock
const mockRepo = new Mock<IUserRepository>();
const service = new UserService(mockRepo.Object);

// ❌ Bad: Hard to test
class UserService {
  private UserRepository _repository = new UserRepository();
}
```

## 14. Test Behavior, Not Implementation

Test สิ่งที่ code ทำ ไม่ใช่วิธีที่ทำ:

```typescript
// ✅ Good: Test behavior
[Fact]
CreateUser_ShouldReturnUserWithEmail()
{
  const service = new UserService(mockRepo.Object);
  const user = service.CreateUser("test@example.com", "Test");
  Assert.Equal("test@example.com", user.Email);
}

// ❌ Bad: Test implementation
[Fact]
CreateUser_ShouldCallRepositoryAdd()
{
  const service = new UserService(mockRepo.Object);
  service.CreateUser("test@example.com", "Test");
  mockRepo.Verify(r => r.Add(It.IsAny<User>()), Times.Once);
}
```
