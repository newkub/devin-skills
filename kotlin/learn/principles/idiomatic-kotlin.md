# Idiomatic Kotlin

## Concept Overview

Idiomatic Kotlin หมายถึงการเขียน Kotlin ตามแนวทางที่ชุมชนและ JetBrains แนะนำ ทำให้โค้ดอ่านง่าย กระชับ และ maintainable

## Kotlin Idioms

### Favor val over var

```kotlin
// Good: Immutable
val name = "Alice"
val list = listOf(1, 2, 3)

// Avoid: Mutable when not needed
var counter = 0  // Only when mutation is required
counter++
```

### Use Expression Bodies

```kotlin
// Good: Single-expression function
fun max(a: Int, b: Int) = if (a > b) a else b

// Acceptable: Multi-line function
fun max(a: Int, b: Int): Int {
    return if (a > b) a else b
}
```

### Use String Templates

```kotlin
// Good
val greeting = "Hello, $name!"
val length = "Length: ${user.name.length}"

// Avoid
val greeting = "Hello, " + name + "!"
```

### Use Data Classes

```kotlin
// Good: Data class for data holders
data class User(val id: Int, val name: String, val email: String)

// Avoid: Manual equals/hashCode/toString
class User(val id: Int, val name: String) {
    override fun equals(other: Any?) = ...
    override fun hashCode() = ...
    override fun toString() = ...
}
```

## Functional Operations

### Prefer map, filter, reduce

```kotlin
// Good: Functional style
val result = users
    .filter { it.age > 18 }
    .map { it.name }
    .joinToString(", ")

// Avoid: Imperative style
val filtered = mutableListOf<String>()
for (user in users) {
    if (user.age > 18) {
        filtered.add(user.name)
    }
}
```

### Use let for Null Checks

```kotlin
// Good: let with safe call
user?.let { u ->
    processUser(u)
}

// Good: let with default
val name = user?.name ?: "Unknown"

// Acceptable: Traditional null check
if (user != null) {
    processUser(user)
}
```

## Named Arguments

### Use for Boolean Parameters

```kotlin
// Good: Named arguments for readability
configure(
    timeout = 3000,
    retries = 3,
    debug = true,
    ssl = true
)

// Bad: Positional arguments unclear
configure(3000, 3, true, true)
```

## Default Parameters

### Replace Builder Pattern

```kotlin
// Good: Default parameters
fun createUser(
    name: String,
    email: String = "unknown@example.com",
    active: Boolean = true
) = User(name, email, active)

// Avoid: Builder for simple cases
fun createUser(block: UserBuilder.() -> Unit) = UserBuilder().apply(block).build()
```

## Scope Functions

### Choose the Right One

```kotlin
// let - transform and return
val result = input?.let { process(it) }

// run - execute block and return result
val result = service.run {
    connect()
    fetchData()
}

// with - multiple operations on object
val length = with(text) {
    println(this)
    length
}

// apply - configure object, return it
val user = User().apply {
    name = "Alice"
    email = "alice@example.com"
}

// also - side effect, return object
val names = users.also { println("Processing ${it.size} users") }
    .map { it.name }
```

## Collections

### Immutable by Default

```kotlin
// Good: Immutable list
val list = listOf(1, 2, 3)

// Bad: Mutable when not needed
val list = mutableListOf(1, 2, 3)
```

### Use Associated Operations

```kotlin
// Good: associateBy for map creation
val userMap = users.associateBy { it.id }

// Good: groupBy for grouping
val byAge = users.groupBy { it.age }

// Good: partition for splitting
val (active, inactive) = users.partition { it.isActive }
```

## Scope Functions Guidelines

| Function | Returns | Use When |
|----------|---------|----------|
| let | Lambda result | Transforming nullable value |
| run | Lambda result | Execute block and return result |
| with | Lambda result | Call multiple methods on object |
| apply | Context object | Configure object properties |
| also | Context object | Perform side effects |

## DRY Principles

### Extension Functions for Utilities

```kotlin
// Good: Extension functions
fun String.isValidEmail() = this.matches(Regex("..."))
fun List<Int>.sumOfSquares() = this.sumOf { it * it }

// Avoid: Utility classes
object StringUtils {
    fun isValidEmail(s: String) = s.matches(...)
}
```

### Use Reified Generics

```kotlin
// Good: Inline with reified
inline fun <reified T> parse(json: String): T {
    return Json.decodeFromString(json)
}

val user: User = parse(jsonString)

// Avoid: Type parameter
fun <T> parse(json: String, clazz: Class<T>): T {
    // ...
}
```

## Expressiveness

### Meaningful Names

```kotlin
// Good: Descriptive names
fun calculateTotalPrice(items: List<Item>, tax: Double)
fun findActiveUsers(): List<User>

// Bad: Abbreviated/meaningless
fun calc(items: List<Item>, t: Double)
fun findUsers(): List<User>
```

### Use Elvis for Defaults

```kotlin
// Good: Elvis operator
val name = user.nickname ?: user.name ?: "Anonymous"

// Bad: Nested if-else
val name = if (user.nickname != null) {
    user.nickname
} else if (user.name != null) {
    user.name
} else {
    "Anonymous"
}
```

## Performance Idioms

### Use Inline Functions

```kotlin
// Good: Inline for small, frequently called functions
inline fun <T> useResource(resource: T, block: (T) -> Unit) {
    try {
        block(resource)
    } finally {
        // cleanup
    }
}

// Used for lambda performance critical code
```

### Avoid Creating Unnecessary Objects

```kotlin
// Good: Reuse pattern
class Validator {
    private val emailRegex = Regex("...")  // Compiled once
    
    fun isValid(email: String) = email.matches(emailRegex)
}

// Bad: Create in method
fun isValid(email: String) = email.matches(Regex("..."))  // Compiled each call
```