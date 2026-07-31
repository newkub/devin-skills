# Documentation

```rust
/// Represents a user in the system.
///
/// # Examples
///
/// ```
/// let user = User::new("Alice", "alice@example.com");
/// ```
pub struct User {
    /// User's display name
    name: String,
    /// User's email address
    email: String,
}

impl User {
    /// Creates a new user with the given name and email.
    ///
    /// # Arguments
    ///
    /// * `name` - The user's display name
    /// * `email` - The user's email address
    ///
    /// # Examples
    ///
    /// ```
    /// let user = User::new("Alice", "alice@example.com");
    /// ```
    pub fn new(name: &str, email: &str) -> Self {
        User {
            name: name.to_string(),
            email: email.to_string(),
        }
    }
}
```
