# All Features - Kotlin

## Data Types

### Primitives

| Type | Description | Example |
|------|-------------|---------|
| Int | 32-bit integer | `42` |
| Long | 64-bit integer | `42L` |
| Double | 64-bit float | `3.14` |
| Float | 32-bit float | `3.14f` |
| Boolean | True/False | `true`/`false` |
| Char | Single character | `'A'` |

### Collections

```kotlin
// Immutable
val list: List<Int> = listOf(1, 2, 3)
val map: Map<String, Int> = mapOf("a" to 1)
val set: Set<Int> = setOf(1, 2, 3)

// Mutable
val mutableList: MutableList<Int> = mutableListOf(1, 2, 3)
val mutableMap: MutableMap<String, Int> = mutableMapOf()
```

## Classes

### Data Classes

```kotlin
data class User(
    val id: Int,
    val name: String,
    val email: String
)

// Auto-generated: equals, hashCode, toString, copy, componentN()

val user = User(1, "Alice", "alice@example.com")
val copy = user.copy(name = "Bob")  // Change name only
```

### Sealed Classes

```kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val message: String) : Result<Nothing>()
    object Loading : Result<Nothing>()
}

fun handle(result: Result<String>) = when (result) {
    is Result.Success -> println(result.data)
    is Result.Error -> println(result.message)
    Result.Loading -> println("Loading...")
}
```

### Object Declarations

```kotlin
// Singleton
object Database {
    fun connect() = println("Connected")
}

// Companion Object (factory pattern)
class MyClass private constructor(val value: Int) {
    companion object {
        fun create(value: Int) = MyClass(value)
    }
}
```

## Functions

### Default Parameters

```kotlin
fun greet(
    name: String,
    greeting: String = "Hello",
    punctuation: String = "!"
) = "$greeting, $name$punctuation"

greet("Alice")  // Hello, Alice!
greet("Bob", "Hi", "!!")  // Hi, Bob!!
```

### Named Arguments

```kotlin
fun configure(
    timeout: Int = 3000,
    retries: Int = 3,
    debug: Boolean = false
) {}

configure(timeout = 5000, debug = true)
```

### Extension Functions

```kotlin
fun String.addExclamation() = this + "!"

val text = "Hello".addExclamation()  // "Hello!"

fun <T> List<T>.second(): T = this[1]
```

### Lambda Expressions

```kotlin
// Lambda syntax
val sum = { a: Int, b: Int -> a + b }
sum(1, 2)  // 3

// Trailing lambda
listOf(1, 2, 3).map { it * 2 }  // [2, 4, 6]

// Method reference
listOf(1, 2, 3).map(::triple)
```

## Null Safety

```kotlin
var nullable: String? = null

// Safe call
nullable?.length  // null if nullable is null

// Elvis operator
val len = nullable?.length ?: 0

// Not-null assertion (avoid if possible)
val len2 = nullable!!.length

// Safe cast
val str: String? = nullable as? String
```

## Control Flow

### When Expression

```kotlin
val result = when (x) {
    1 -> "one"
    in 2..10 -> "two to ten"
    is String -> "it's a string"
    else -> "unknown"
}
```

### Ranges

```kotlin
for (i in 1..10) { }        // 1 to 10 (inclusive)
for (i in 1 until 10) { }   // 1 to 9
for (i in 10 downTo 1) { }  // 10 to 1
for (i in 0..100 step 5) { }  // 0, 5, 10, ...
```

## Type System

### Generics

```kotlin
class Box<T>(val value: T)
interface Repository<T, ID> {
    fun findById(id: ID): T?
    fun findAll(): List<T>
}

fun <T : Comparable<T>> maxOf(a: T, b: T): T {
    return if (a > b) a else b
}
```

### Variance

```kotlin
// Covariance (out)
interface Producer<out T> {
    fun produce(): T
}

// Contravariance (in)
interface Consumer<in T> {
    fun consume(t: T)
}
```