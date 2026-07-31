# API Reference - Kotlin

## Standard Library

### Kotlin Standard Library (kotlin-stdlib)

#### Core Types

| Package | Description |
|---------|-------------|
| `kotlin` | Core language types and functions |
| `kotlin.collections` | Collection interfaces and implementations |
| `kotlin.text` | String manipulation and regex |
| `kotlin.io` | I/O operations |
| `kotlin.math` | Mathematical functions |
| `kotlin.ranges` | Range and progression classes |
| `kotlin.sequences` | Lazy sequence operations |
| `kotlin.reflect` | Reflection API |

#### Common Functions

| Function | Description | Example |
|----------|-------------|---------|
| `let` | Execute block with object as argument | `user.let { println(it.name) }` |
| `run` | Execute block and return result | `run { println("Hello") }` |
| `with` | Execute block with object context | `with(user) { println(name) }` |
| `apply` | Configure object and return it | `user.apply { name = "Alice" }` |
| `also` | Perform side effects and return object | `user.also { println(it) }` |
| `takeIf` | Return object if predicate true | `value.takeIf { it > 0 }` |
| `takeUnless` | Return object if predicate false | `value.takeUnless { it == 0 }` |
| `repeat` | Execute block n times | `repeat(5) { println(it) }` |
| `require` | Throw IllegalArgumentException if false | `require(value > 0) { "Must be positive" }` |
| `check` | Throw IllegalStateException if false | `check(state) { "Invalid state" }` |

### Collections API

#### List Operations

| Function | Description | Example |
|----------|-------------|---------|
| `listOf()` | Create immutable list | `listOf(1, 2, 3)` |
| `mutableListOf()` | Create mutable list | `mutableListOf(1, 2, 3)` |
| `map` | Transform elements | `list.map { it * 2 }` |
| `filter` | Filter elements | `list.filter { it > 0 }` |
| `flatMap` | Transform and flatten | `list.flatMap { listOf(it, it) }` |
| `fold` | Reduce to single value | `list.fold(0) { acc, i -> acc + i }` |
| `reduce` | Reduce to single value | `list.reduce { acc, i -> acc + i }` |
| `find` | Find first matching | `list.find { it > 0 }` |
| `any` | Check if any matches | `list.any { it > 0 }` |
| `all` | Check if all match | `list.all { it > 0 }` |
| `sortedBy` | Sort by selector | `list.sortedBy { it }` |
| `groupBy` | Group by key | `list.groupBy { it % 2 }` |
| `associateBy` | Create map by key | `list.associateBy { it.id }` |

#### Map Operations

| Function | Description | Example |
|----------|-------------|---------|
| `mapOf()` | Create immutable map | `mapOf("a" to 1)` |
| `mutableMapOf()` | Create mutable map | `mutableMapOf("a" to 1)` |
| `getOrDefault` | Get value or default | `map.getOrDefault("a", 0)` |
| `getOrElse` | Get value or compute | `map.getOrElse("a") { 0 }` |
| `computeIfAbsent` | Compute if missing | `map.computeIfAbsent("a") { 0 }` |
| `filterKeys` | Filter by keys | `map.filterKeys { it.startsWith("a") }` |
| `filterValues` | Filter by values | `map.filterValues { it > 0 }` |
| `mapKeys` | Transform keys | `map.mapKeys { it.key.uppercase() }` |
| `mapValues` | Transform values | `map.mapValues { it.value * 2 }` |

### String API

| Function | Description | Example |
|----------|-------------|---------|
| `substring` | Extract substring | `"hello".substring(0, 2)` |
| `replace` | Replace occurrences | `"hello".replace("l", "L")` |
| `split` | Split by delimiter | `"a,b,c".split(",")` |
| `trim` | Remove whitespace | `"  hello  ".trim()` |
| `toLowerCase` | Convert to lowercase | `"Hello".toLowerCase()` |
| `toUpperCase` | Convert to uppercase | `"hello".toUpperCase()` |
| `startsWith` | Check prefix | `"hello".startsWith("he")` |
| `endsWith` | Check suffix | `"hello".endsWith("lo")` |
| `contains` | Check substring | `"hello".contains("ell")` |
| `toInt` | Parse to int | `"123".toInt()` |
| `toBoolean` | Parse to boolean | `"true".toBoolean()` |
| `toDouble` | Parse to double | `"3.14".toDouble()` |

### Regex API

```kotlin
// Create regex
val regex = Regex("\\d+")

// Find matches
val matches = regex.findAll("abc123def456")

// Replace
val replaced = regex.replace("abc123", "X")

// Split
val parts = regex.split("a1b2c3")

// Check match
val isMatch = regex.matches("123")
```

## Kotlinx Libraries

### Kotlinx Coroutines

| Package | Description |
|---------|-------------|
| `kotlinx.coroutines` | Core coroutine primitives |
| `kotlinx.coroutines.flow` | Reactive streams |
| `kotlinx.coroutines.channels` | Channel-based communication |
| `kotlinx.coroutines.select` | Select expression |

#### Coroutine Builders

| Builder | Description | Example |
|---------|-------------|---------|
| `launch` | Fire and forget | `launch { doWork() }` |
| `async` | Return deferred result | `async { compute() }` |
| `runBlocking` | Block until complete | `runBlocking { doWork() }` |
| `withContext` | Switch context | `withContext(Dispatchers.IO) { }` |

#### Dispatchers

| Dispatcher | Description | Use Case |
|------------|-------------|----------|
| `Dispatchers.Default` | CPU-bound | Computation |
| `Dispatchers.IO` | I/O-bound | Network, disk |
| `Dispatchers.Main` | UI thread | Android UI |
| `Dispatchers.Unconfined` | No dispatcher | Testing |

#### Flow Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `map` | Transform values | `flow.map { it * 2 }` |
| `filter` | Filter values | `flow.filter { it > 0 }` |
| `collect` | Consume values | `flow.collect { println(it) }` |
| `flatMap` | Transform to flow | `flow.flatMap { emit(it) }` |
| `reduce` | Reduce to single | `flow.reduce { acc, i -> acc + i }` |
| `fold` | Reduce with initial | `flow.fold(0) { acc, i -> acc + i }` |
| `buffer` | Buffer emissions | `flow.buffer()` |
| `conflate` | Conflate values | `flow.conflate()` |

### Kotlinx Serialization

| Package | Description |
|---------|-------------|
| `kotlinx.serialization` | Core serialization |
| `kotlinx.serialization.json` | JSON format |
| `kotlinx.serialization.protobuf` | Protocol Buffers |
| `kotlinx.serialization.properties` | Properties format |

```kotlin
@Serializable
data class User(val name: String, val age: Int)

val json = Json.encodeToString(User("Alice", 30))
val user = Json.decodeFromString<User>(json)
```

### Kotlinx DateTime

| Package | Description |
|---------|-------------|
| `kotlinx.datetime` | Date and time API |

```kotlin
val now = Clock.System.now()
val localDate = now.toLocalDateTime(TimeZone.UTC).date
val instant = Instant.parse("2024-01-01T00:00:00Z")
```

## Testing API

### Kotlin Test

| Package | Description |
|---------|-------------|
| `kotlin.test` | Testing assertions and utilities |

#### Assertions

| Assertion | Description | Example |
|-----------|-------------|---------|
| `assertEquals` | Assert equality | `assertEquals(1, 1)` |
| `assertNotEquals` | Assert inequality | `assertNotEquals(1, 2)` |
| `assertTrue` | Assert true | `assertTrue(condition)` |
| `assertFalse` | Assert false | `assertFalse(condition)` |
| `assertNull` | Assert null | `assertNull(value)` |
| `assertNotNull` | Assert not null | `assertNotNull(value)` |
| `assertThrows` | Assert exception | `assertThrows<Exception> { }` |
| `fail` | Force failure | `fail("Should not reach")` |

## Reflection API

### Kotlin Reflection

| Package | Description |
|---------|-------------|
| `kotlin.reflect` | Kotlin-specific reflection |

```kotlin
val kClass = MyClass::class
val properties = kClass.memberProperties
val functions = kClass.memberFunctions
val constructor = kClass.primaryConstructor
```

## Java Interop

### Java Standard Library

Kotlin seamlessly interoperates with Java standard library:

| Java Class | Kotlin Usage |
|------------|-------------|
| `java.util.List` | `List<T>` |
| `java.util.Map` | `Map<K, V>` |
| `java.util.Set` | `Set<T>` |
| `java.io.File` | `java.io.File` |
| `java.time.*` | `java.time.*` |

### Platform Types

When calling Java code, Kotlin uses platform types:

```kotlin
// Java method returns String (nullable or not)
val result: String? = javaMethod()  // Treat as nullable
```

## Android API

### Android Kotlin Extensions

| API | Description |
|-----|-------------|
| `androidx.core` | Core Android extensions |
| `androidx.fragment` | Fragment extensions |
| `androidx.lifecycle` | Lifecycle-aware components |
| `androidx.compose` | Jetpack Compose |

#### View Binding

```kotlin
// Old way (deprecated)
import kotlinx.android.synthetic.main.activity_main.*

// New way
binding.textView.text = "Hello"
```

## Ktor API

### Ktor Client

| Package | Description |
|---------|-------------|
| `io.ktor.client` | HTTP client |
| `io.ktor.client.features` | Client features |

```kotlin
val client = HttpClient()
val response = client.get("https://api.example.com")
```

### Ktor Server

| Package | Description |
|---------|-------------|
| `io.ktor.server` | HTTP server |
| `io.ktor.server.routing` | Routing |
| `io.ktor.server.plugins` | Server plugins |

```kotlin
routing {
    get("/") {
        call.respondText("Hello")
    }
}
```

## API Documentation Links

| API | Documentation |
|-----|---------------|
| Kotlin Standard Library | https://kotlinlang.org/api/latest/jvm/stdlib/ |
| Kotlinx Coroutines | https://kotlinlang.org/api/kotlinx.coroutines/ |
| Kotlinx Serialization | https://kotlinlang.org/api/kotlinx.serialization/ |
| Kotlinx DateTime | https://kotlinlang.org/api/kotlinx-datetime/ |
| Kotlin Test | https://kotlinlang.org/api/latest/kotlin.test/ |
| Android Kotlin | https://developer.android.com/reference/kotlin/packages |
| Ktor | https://ktor.io/docs/ |
