# Common Debugging Scenarios

## Debugging Null Pointer Exception

```kotlin
fun processUser(user: User?) {
    // Breakpoint here to check user value
    val name = user?.name ?: "Unknown"  // Safe call
    println(name)
}
```

## Debugging Collection Operations

```kotlin
val result = list
    .filter { it > 0 }  // Breakpoint to check intermediate results
    .map { it * 2 }
    .take(5)

// Use .also() to inspect
val result = list
    .also { println("Original: $it") }
    .filter { it > 0 }
    .also { println("Filtered: $it") }
    .map { it * 2 }
```

## Debugging Async Code

```kotlin
fun loadData() {
    viewModelScope.launch {
        val data = repository.fetchData()  // Breakpoint
        _uiState.value = UiState.Success(data)
    }
}
```
