# Quick Start - Kotlin

## Hello World

```kotlin
// src/main/kotlin/Main.kt
fun main() {
    println("Hello, Kotlin!")
}
```

```bash
kotlinc Main.kt -include-runtime -d app.jar
kotlin app.jar
```

## Variables

```kotlin
// Immutable (recommended)
val name = "Alice"
val age: Int = 30

// Mutable
var counter = 0
counter++

// Type inference
val city = "Bangkok"  // inferred as String
```

## Functions

```kotlin
// Basic function
fun greet(name: String): String {
    return "Hello, $name!"
}

// Single-expression function
fun add(a: Int, b: Int) = a + b

// Default parameters
fun greet(name: String, greeting: String = "Hello") =
    "$greeting, $name!"

// Named arguments
greet(name = "Alice", greeting = "Hi")
```

## Classes

```kotlin
// Simple class
class User(val name: String, val age: Int)

// Data class
data class User(
    val id: Int,
    val name: String,
    val email: String
)

val user = User(1, "Alice", "alice@example.com")
println(user.name)
println(user.copy(name = "Bob"))  // Copy with modified field
```

## Null Safety

```kotlin
var nullable: String? = null

// Safe call
nullable?.length

// Elvis operator
val len = nullable?.length ?: 0

// Safe cast
val str: String? = nullable as? String
```

## Collections

```kotlin
// Immutable list
val list = listOf(1, 2, 3)

// Mutable list
val mutableList = mutableListOf(1, 2, 3)
mutableList.add(4)

// Transform
val doubled = list.map { it * 2 }

// Filter
val evens = list.filter { it % 2 == 0 }
```

## Control Flow

```kotlin
// If expression
val result = if (x > 0) "positive" else "negative"

// When expression
val type = when (x) {
    1 -> "one"
    in 2..10 -> "two to ten"
    else -> "unknown"
}

// For loop
for (item in list) {
    println(item)
}
```

## Coroutines Basics

```kotlin
import kotlinx.coroutines.*

suspend fun fetchData(): String {
    delay(1000)  // Non-blocking delay
    return "data"
}

fun main() = runBlocking {
    val result = fetchData()
    println(result)
}
```

## Example: Simple Task List

```kotlin
data class Task(
    val id: Int,
    val title: String,
    var completed: Boolean = false
)

class TaskList {
    private val tasks = mutableListOf<Task>()
    
    fun add(title: String) {
        tasks.add(Task(tasks.size + 1, title))
    }
    
    fun complete(id: Int) {
        tasks.find { it.id == id }?.completed = true
    }
    
    fun list() = tasks.toList()
}

fun main() {
    val todo = TaskList()
    todo.add("Learn Kotlin")
    todo.add("Build app")
    todo.complete(1)
    todo.list().forEach { println(it) }
}
```

## Running Kotlin

```bash
# Compile and run
kotlinc Main.kt -include-runtime -d app.jar
kotlin app.jar

# Run with Gradle
gradle run

# Run tests
gradle test
```