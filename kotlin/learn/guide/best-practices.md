# Best Practices - Kotlin

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Variables | camelCase | `userName`, `isActive` |
| Functions | camelCase | `getUser()`, `calculateTotal()` |
| Classes | PascalCase | `UserAccount`, `HttpClient` |
| Objects | PascalCase | `Database`, `ConfigManager` |
| Constants | SCREAMING_SNAKE | `MAX_SIZE`, `DEFAULT_TIMEOUT` |
| Packages | lowercase | `com.example.app` |
| Files | PascalCase | `UserService.kt`, `HttpClient.kt` |

## Null Safety

### Prefer Val Over Var

```kotlin
// Prefer immutable
val name = "Alice"  // Recommended

// Only use var when mutation is needed
var counter = 0
counter++  // When mutation is actually required
```

### Use Nullable Types Wisely

```kotlin
// Return nullable when value may not exist
fun findUser(id: Int): User? = users.find { it.id == id }

// Use safe calls
val length = user?.name?.length

// Provide default with Elvis
val name = user?.name ?: "Unknown"

// Avoid !! unless absolutely certain
val length = name!!.length  // Use sparingly
```

## Data Classes

### Use Data Classes for DTOs

```kotlin
// Good: Data class for data holder
data class User(
    val id: Int,
    val name: String,
    val email: String
)

// Bad: Using regular class for data
class User(val id: Int, val name: String) {
    override fun equals(other: Any?) = ...
    override fun hashCode() = ...
    override fun toString() = ...
}
```

### Avoid Data Classes for Domain Objects

```kotlin
// For complex domain objects, prefer regular classes
class User(
    val id: Int,
    val name: String,
    private val passwordHash: String
) {
    fun verifyPassword(input: String): Boolean {
        return hash(passwordInput) == passwordHash
    }
}
```

## Functions

### Use Single-Expression Functions

```kotlin
// Good
fun max(a: Int, b: Int) = if (a > b) a else b

// Acceptable for complex logic
fun max(a: Int, b: Int): Int {
    return if (a > b) a else b
}
```

### Prefer Named Arguments for Complex Calls

```kotlin
// Good: Named arguments for clarity
configure(
    timeout = 3000,
    retries = 3,
    debug = true,
    ssl = true
)

// Acceptable: Simple calls
configure(3000, 3, false)
```

## Collections

### Use Functional Operations

```kotlin
// Transform
val names = users.map { it.name }

// Filter
val activeUsers = users.filter { it.isActive }

// Chain operations
val result = users
    .filter { it.age > 18 }
    .map { it.name }
    .sorted()
```

### Avoid Mutable Collections When Possible

```kotlin
// Prefer immutable
val list = listOf(1, 2, 3)

// Only use mutable when mutation is needed
val mutableList = mutableListOf(1, 2, 3)
mutableList.add(4)
```

## Coroutines

### Use Structured Concurrency

```kotlin
// Good: Structured concurrency with scope
class ViewModel {
    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())
    
    fun loadData() {
        scope.launch {
            val data = fetchData()
            updateUI(data)
        }
    }
    
    fun cleanup() {
        scope.cancel()
    }
}

// Better: Use viewModelScope in Android
class ViewModel : ViewModel() {
    fun loadData() {
        viewModelScope.launch {
            val data = fetchData()
            updateUI(data)
        }
    }
}
```

### Use Correct Dispatchers

```kotlin
// IO for network/disk operations
launch(Dispatchers.IO) {
    val data = api.fetchUsers()
}

// Main for UI updates
withContext(Dispatchers.Main) {
    updateUI(data)
}

// Default for CPU-intensive work
launch(Dispatchers.Default) {
    processData(largeList)
}
```

## Error Handling

### Use Result Type

```kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val exception: Throwable) : Result<Nothing>()
}

fun fetchUser(id: Int): Result<User> {
    return try {
        Result.Success(api.getUser(id))
    } catch (e: Exception) {
        Result.Error(e)
    }
}
```

### Use runCatching

```kotlin
val result = runCatching { 
    parseUser(jsonString)
}.onSuccess { user ->
    println("User: $user")
}.onFailure { error ->
    println("Error: $error")
}
```

## Testing

### Use Descriptive Test Names

```kotlin
// Good: Descriptive names
class UserServiceTest {
    @Test
    fun `should return user when user exists`() { ... }
    
    @Test
    fun `should throw exception when user not found`() { ... }
}
```

### Use Kotlin Test DSL

```kotlin
val user = User(name = "Alice", age = 30)

user shouldHaveName "Alice"
user.age shouldBeGreaterThan 18
```