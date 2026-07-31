# Coroutines

## Concept Overview

Coroutines เป็น lightweight threads ที่ช่วยให้เขียน asynchronous code ได้ง่ายและ readable มากกว่า traditional callback หรือ thread-based approach

## Key Concepts

```
┌─────────────────────────────────────────────────────────────┐
│                   Coroutines vs Threads                      │
├─────────────────────────────────────────────────────────────┤
│  Thread                                                      │
│  - Heavy, OS-managed                                        │
│  - Context switching cost                                   │
│  - Limited number (~thousands)                              │
│                                                             │
│  Coroutine                                                  │
│  - Lightweight, managed by Kotlin                           │
│  - Cooperative scheduling                                   │
│  - Millions can run simultaneously                           │
└─────────────────────────────────────────────────────────────┘
```

## Suspend Functions

```kotlin
// suspend function can pause execution without blocking
suspend fun fetchUser(id: Int): User {
    // Can suspend here - waiting for I/O
    return api.getUser(id)
}

// Called from coroutine or another suspend function
suspend fun loadData() {
    val user = fetchUser(1)  // Suspended if needed
    println(user.name)
}
```

## Coroutine Builders

```kotlin
import kotlinx.coroutines.*

// launch - fire and forget
fun main() {
    CoroutineScope(Dispatchers.Main).launch {
        // This runs on Main (UI) thread
    }
}

// async - returns result
suspend fun loadTwo() {
    val deferred1 = async { fetchData1() }
    val deferred2 = async { fetchData2() }
    val result = awaitAll(deferred1, deferred2)
}

// runBlocking - blocks current thread (mainly for testing)
fun main() = runBlocking {
    val result = suspendFunction()
    println(result)
}
```

## Dispatchers

```kotlin
// Main - UI thread (Android/iOS)
CoroutineScope(Dispatchers.Main).launch {
    updateUI()  // Safe for UI
}

// IO - for network/disk operations
CoroutineScope(Dispatchers.IO).launch {
    val data = api.fetchUsers()  // Non-blocking I/O
}

// Default - for CPU-intensive work
CoroutineScope(Dispatchers.Default).launch {
    processLargeList()  // CPU-bound
}

// Unconfined - starts in caller thread, suspends in whatever thread
CoroutineScope(Dispatchers.Unconfined).launch {
    // Starts in caller thread
    delay(100)
    // Continues in thread where suspend resumed
}
```

## Structured Concurrency

```kotlin
// Scope-based concurrency
class ViewModel {
    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())
    
    fun loadData() {
        scope.launch {
            try {
                val data = fetchData()  // If this fails
                updateUI(data)
            } catch (e: Exception) {
                showError(e)  // Exception is caught here
            }
        }
    }
    
    fun cleanup() {
        scope.cancel()  // Cancel all child coroutines
    }
}

// ViewModelScope (Android)
class MyViewModel : ViewModel() {
    fun loadData() {
        viewModelScope.launch {
            val data = fetchData()
            updateUI(data)
        }
        // viewModelScope is cancelled automatically when ViewModel is cleared
    }
}
```

## Flow

```kotlin
// Flow is cold asynchronous stream
fun userUpdates(): Flow<User> = flow {
    while (true) {
        emit(fetchLatestUser())
        delay(1000)
    }
}

// Collecting flow
CoroutineScope(Dispatchers.Main).launch {
    userUpdates()
        .catch { e -> emitError(e) }  // Handle errors
        .buffer()                      // Buffer emissions
        .collect { user -> 
            updateUI(user)
        }
}
```

## Channel

```kotlin
// Channel is hot stream (like BlockingQueue)
val channel = Channel<Int>()

// Sender
CoroutineScope(Dispatchers.IO).launch {
    for (i in 1..5) {
        channel.send(i)
    }
    channel.close()
}

// Receiver
CoroutineScope(Dispatchers.Main).launch {
    for (value in channel) {
        println(value)
    }
}

// Fan-out (multiple receivers)
fun produce() = Channel<Int>() // Shared channel

// Multiple coroutines receive from same channel
launch { for (msg in channel) { println("Receiver 1: $msg") } }
launch { for (msg in channel) { println("Receiver 2: $msg") } }
```

## Exception Handling

```kotlin
// try-catch in coroutine
scope.launch {
    try {
        val result = riskyOperation()
    } catch (e: Exception) {
        handleError(e)
    }
}

// CoroutineExceptionHandler
val handler = CoroutineExceptionHandler { _, exception ->
    println("Caught: $exception")
}

CoroutineScope(Dispatchers.Main + handler).launch {
    // Exception caught by handler
    throw RuntimeException("Error!")
}

// SupervisorJob - child failures don't cancel siblings
val supervisor = SupervisorJob()
CoroutineScope(Dispatchers.Main + supervisor).launch {
    launch { throw RuntimeException() }  // Fails
    launch { println("Still running") }   // Continues
}
```

## Best Practices

```kotlin
// Good: Use appropriate dispatcher
CoroutineScope(Dispatchers.IO).launch {
    val users = api.getUsers()  // Network call
    withContext(Dispatchers.Main) {
        adapter.submitList(users)  // UI update
    }
}

// Good: Structured concurrency
class MyViewModel : ViewModel() {
    fun loadData() = viewModelScope.launch {
        val data = repository.getData()
        _state.value = data
    }
}

// Good: Cancellation
val job = scope.launch {
    try {
        while (isActive) {  // Check for cancellation
            processNext()
        }
    } finally {
        cleanup()  // Always runs
    }
}

job.cancelAndJoin()  // Cancel and wait

// Bad: Blocking in coroutine
launch {
    Thread.sleep(1000)  // Blocks thread!
}
// Good: Use delay instead
launch {
    delay(1000)  // Suspends properly
}
```