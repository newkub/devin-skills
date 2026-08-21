# Test Organization

## Definition

Test organization คือการจัดเรียง tests ให้:
- เข้าใจง่าย
- บำรุงง่าย
- Run ได้รวดเร็ว
- Debug ง่าย

## Module Organization

### By Feature

```rust
// tests/auth/login.rs
#[cfg(test)]
mod login_tests {
    #[test]
    fn test_login() { }
}

// tests/auth/register.rs
#[cfg(test)]
mod register_tests {
    #[test]
    fn test_register() { }
}
```

### By Layer

```rust
// tests/unit/user.rs
#[cfg(test)]
mod user_tests {
    #[test]
    fn test_user_validation() { }
}

// tests/integration/api.rs
#[cfg(test)]
mod api_tests {
    #[test]
    fn test_api_endpoint() { }
}
```

## Test Naming

### Conventions

```rust
// Good
#[test]
fn test_user_login_with_valid_credentials() { }

#[test]
fn test_user_login_with_invalid_password() { }

// Bad
#[test]
fn test1() { }

#[test]
fn test_login() { }
```

### Pattern

```
test_<feature>_<scenario>_<expected_result>
```

## Test Structure

### AAA Pattern

```rust
#[test]
fn test_user_login() {
    // Arrange
    let user = User::new("test@example.com", "password");
    
    // Act
    let result = user.login();
    
    // Assert
    assert!(result.is_ok());
}
```

## Best Practices

1. **Logical Grouping**: Group tests ตาม logic
2. **Descriptive Names**: ใช้ชื่อที่อธิบายได้
3. **Single Responsibility**: แต่ละ test ทดสอบสิ่งเดียว
4. **Independent Tests**: Tests ไม่พึ่งพากัน
5. **Fast First**: Put fast tests first
