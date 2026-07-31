# Sealed Classes

## Concept Overview

Sealed Classes ช่วยให้สร้าง restricted class hierarchies ได้ - subclasses ทั้งหมดต้องอยู่ใน file เดียวกัน ทำให้ compiler รู้ทุก cases และช่วย enforce exhaustive when expressions

## Declaration

```kotlin
// All subclasses must be in same file
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val message: String) : Result<Nothing>()
    object Loading : Result<Nothing>()
}
```

## Why Sealed Classes?

```text
┌─────────────────────────────────────────────────────────────┐
│           Sealed Class vs Open Class                         │
├─────────────────────────────────────────────────────────────┤
│  Open Class                                                  │
│  - Can have unlimited subclasses                             │
│  - Can be extended from any file                            │
│  - when needs else branch                                    │
│                                                             │
│  Sealed Class                                                │
│  - Restricted to file-level subclasses                      │
│  - All cases known at compile time                          │
│  - when can be exhaustive without else                       │
└─────────────────────────────────────────────────────────────┘
```

## Exhaustive When

```kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val message: String) : Result<Nothing>()
    object Loading : Result<Nothing>()
}

fun handle(result: Result<String>) = when (result) {
    is Result.Success -> println("Data: ${result.data}")
    is Result.Error -> println("Error: ${result.message}")
    Result.Loading -> println("Loading...")
    // No else needed - all cases covered!
}
```

## Sealed Interfaces

```kotlin
// Since Kotlin 1.5
sealed interface Error {
    val message: String
}

data class NetworkError(override val message: String) : Error
data class ValidationError(override val message: String, val field: String) : Error
object UnknownError : Error {
    override val message = "Unknown error occurred"
}
```

## Generic Constraints

```kotlin
// Covariant out parameter
sealed class Response<out T> {
    data class Data<T>(val value: T) : Response<T>()
    data class Error(val message: String) : Response<Nothing>()
    
    // Can use T in out positions
    fun getOrNull(): T? = when (this) {
        is Data -> value
        is Error -> null
    }
}
```

## Nested Classes

```kotlin
sealed class ApiError {
    data class Network(val code: Int) : ApiError()
    data class Validation(val errors: List<String>) : ApiError()
    
    // Nested sealed class
    sealed class Server : ApiError() {
        data class NotFound(val resource: String) : Server()
        data class Unauthorized(val token: String?) : Server()
    }
}

// Handle nested cases
fun handleApiError(error: ApiError) = when (error) {
    is ApiError.Network -> "Network error: ${error.code}"
    is ApiError.Validation -> "Validation: ${error.errors}"
    is ApiError.Server.NotFound -> "Not found: ${error.resource}"
    is ApiError.Server.Unauthorized -> "Unauthorized"
}
```

## Enum vs Sealed Class

```kotlin
// Enum - limited to single values
enum class Status {
    ACTIVE, INACTIVE, PENDING
}

// Sealed - can hold data
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val code: Int, val message: String) : Result<Nothing>()
}
```

## Combining with Data Classes

```kotlin
sealed class Event {
    data class Click(val x: Int, val y: Int) : Event()
    data class KeyPress(val key: String) : Event()
    object AppStarted : Event()
    data class Error(val exception: Throwable) : Event()
}

fun handleEvent(event: Event) {
    when (event) {
        is Event.Click -> println("Clicked at ${event.x}, ${event.y}")
        is Event.KeyPress -> println("Pressed ${event.key}")
        Event.AppStarted -> println("App started")
        is Event.Error -> println("Error: ${event.exception.message}")
    }
}
```

## Practical Examples

### State Management

```kotlin
sealed class ViewState<out T> {
    object Loading : ViewState<Nothing>()
    data class Success<T>(val data: T) : ViewState<T>()
    data class Error(val message: String) : ViewState<Nothing>()
    
    // Helper functions
    fun getOrNull(): T? = (this as? Success)?.data
    
    fun isLoading() = this is Loading
    fun isError() = this is Error
}

// Usage in ViewModel
class MyViewModel : ViewModel() {
    private val _state = MutableStateFlow<ViewState<List<User>>>(ViewState.Loading)
    val state: StateFlow<ViewState<List<User>>> = _state
    
    fun loadUsers() {
        viewModelScope.launch {
            _state.value = ViewState.Loading
            try {
                val users = repository.getUsers()
                _state.value = ViewState.Success(users)
            } catch (e: Exception) {
                _state.value = ViewState.Error(e.message ?: "Unknown error")
            }
        }
    }
}
```

### Navigation

```kotlin
sealed class Screen {
    object Home : Screen()
    object Profile : Screen()
    data class Detail(val id: Int) : Screen()
    data class Settings(val section: String?) : Screen()
}

fun navigateTo(screen: Screen) = when (screen) {
    Screen.Home -> Unit
    Screen.Profile -> Unit
    is Screen.Detail -> loadDetail(screen.id)
    is Screen.Settings -> loadSettings(screen.section)
}
```

## Sealed Classes with Functions

```kotlin
sealed class Operation {
    abstract fun apply(x: Int, y: Int): Int
    
    data class Add(val value: Int) : Operation() {
        override fun apply(x: Int, y: Int) = x + y
    }
    
    data class Multiply(val value: Int) : Operation() {
        override fun apply(x: Int, y: Int) = x * y
    }
    
    object Negate : Operation() {
        override fun apply(x: Int, y: Int) = -x
    }
}

fun main() {
    val ops = listOf(
        Operation.Add(5),
        Operation.Multiply(3),
        Operation.Negate
    )
    
    var result = 10
    for (op in ops) {
        result = op.apply(result, 0)
        println(result)
    }
    // 15, 45, -45
}
```

## Best Practices

```kotlin
// Good: One file per sealed hierarchy
// Result.kt
sealed class Result<out T> { ... }

// Bad: Spreading subclasses across files
// file1.kt
sealed class Result<out T> { ... }
class Success<T>(val data: T) : Result<T>()  // Not allowed

// Good: Use for exhaustive when
fun handle(result: Result) = when (result) {
    is Result.Success -> result.data
    Result.Error -> null
    Result.Loading -> null
}

// Good: Combine with sealed interface for multiple inheritance
sealed interface Error {
    val message: String
}

sealed class Result<out T> : Error {
    // ...
}
```