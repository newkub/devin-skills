# Data Classes

## Concept Overview

Data Classes เป็น class ที่ออกแบบมาเพื่อเก็บข้อมูลโดยเฉพาะ คลาสจะได้รับ automatic implementation ของ `equals()`, `hashCode()`, `toString()`, `copy()` และ `componentN()` functions

## Declaration

```kotlin
data class User(
    val id: Int,
    val name: String,
    val email: String
)

// Automatically generates:
// - equals() and hashCode() based on all properties
// - toString() with format: User(id=1, name=Alice, email=...)
// - copy() for creating modified copies
// - component1(), component2(), component3() for destructuring
```

## Auto-Generated Functions

```kotlin
val user1 = User(1, "Alice", "alice@example.com")
val user2 = User(1, "Alice", "alice@example.com")

// equals()
println(user1 == user2)  // true (same content)

// hashCode()
println(user1.hashCode() == user2.hashCode())  // true

// toString()
println(user1)  
// User(id=1, name=Alice, email=alice@example.com)

// componentN() for destructuring
val (id, name, email) = user1
println("$name has id $id")
```

## Copy Function

```kotlin
val user = User(1, "Alice", "alice@example.com")

// Copy with all same values
val sameUser = user.copy()

// Copy with modified fields
val updatedUser = user.copy(name = "Bob")

// Copy with multiple modifications
val modifiedUser = user.copy(
    name = "Bob",
    email = "bob@example.com"
)
```

## Destructuring

```kotlin
val user = User(1, "Alice", "alice@example.com")

// Destructure to variables
val (id, name, email) = user
println(name)  // Alice

// In loop
val users = listOf(User(1, "Alice", "a@a.com"))
for ((id, name, _) in users) {
    println(name)
}

// In lambda
users.map { (id, name, email) -> name }
```

## Default Values

```kotlin
data class User(
    val id: Int,
    val name: String,
    val email: String = "unknown@example.com",  // Default
    val isActive: Boolean = true
)

val user = User(1, "Alice")
println(user.email)    // unknown@example.com
println(user.isActive) // true
```

## Inheritance

```kotlin
// Data classes can inherit from open classes
open class BaseEntity(val createdAt: Long)

data class User(
    val id: Int,
    val name: String
) : BaseEntity(System.currentTimeMillis())

// Data classes cannot inherit from other data classes
// data class Admin(val role: String) : User(...) // ERROR
```

## Equality

### Data Equality (equals)

```kotlin
val u1 = User(1, "Alice")
val u2 = User(1, "Alice")

u1 == u2  // true - based on property values
u1 === u2 // false - reference comparison
```

### Reference Equality

```kotlin
val u1 = User(1, "Alice")
val u2 = u1
val u3 = u1.copy()

u1 === u2  // true - same reference
u1 === u3  // false - different objects, same content
```

## When with Data Classes

```kotlin
sealed class Result<out T>
data class Success<T>(val data: T) : Result<T>()
data class Error(val message: String) : Result<Nothing>()

fun handle(result: Result<String>) = when (result) {
    is Success -> "Got: ${result.data}"
    is Error -> "Error: ${result.message}"
}
```

## Patterns

### Builder-like Copy

```kotlin
data class Config(
    val host: String = "localhost",
    val port: Int = 8080,
    val ssl: Boolean = false,
    val timeout: Int = 3000
)

fun main() {
    val prodConfig = Config(
        host = "production.example.com",
        ssl = true
    )
}
```

### Immutable DTOs

```kotlin
// Good for immutable data transfer
data class UserDto(
    val id: Int,
    val name: String,
    val email: String
)

// Conversion to domain
fun UserDto.toDomain() = User(id, name, email)

// Conversion from domain
fun User.toDto() = UserDto(id, name, email)
```

### Comparable Data Classes

```kotlin
data class Point(val x: Int, val y: Int) : Comparable<Point> {
    override fun compareTo(other: Point): Int {
        return when {
            x != other.x -> x.compareTo(other.x)
            else -> y.compareTo(other.y)
        }
    }
}
```

## Common Mistakes

```kotlin
// Bad: Mutable properties in data class
data class MutableUser(
    var name: String  // Can be changed, breaking equality
)

// Good: Immutable properties
data class ImmutableUser(
    val name: String  // Cannot be changed after creation
)

// Bad: Custom equals/hashCode overrides
data class Bad(
    val id: Int,
    val name: String
) {
    override fun equals(other: Any?) = // Don't do this!
}

// Good: Let compiler generate
data class Good(
    val id: Int,
    val name: String
) // Compiler handles equality
```