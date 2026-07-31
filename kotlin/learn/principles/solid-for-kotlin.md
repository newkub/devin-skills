# SOLID Principles for Kotlin

## Overview

SOLID principles ช่วยให้โค้ด maintainable, flexible และ easy to understand ใน Kotlin มี features หลายอย่างที่ช่วย implement principles เหล่านี้ได้ง่ายขึ้น

## Single Responsibility Principle (SRP)

### Definition
Class ควรมีแค่เหตุผลเดียวในการเปลี่ยนแปลง

### Kotlin Implementation

```kotlin
// Bad: Multiple responsibilities
class UserManager {
    fun createUser(data: UserData) { ... }
    fun saveToDatabase(user: User) { ... }
    fun sendEmail(user: User) { ... }
    fun generateReport(): String { ... }
}

// Good: Single responsibility each
class UserService(
    private val repository: UserRepository,
    private val emailService: EmailService
) {
    fun createUser(data: UserData): User {
        val user = User(data.name, data.email)
        repository.save(user)
        emailService.sendWelcome(user)
        return user
    }
}

class UserRepository {
    fun save(user: User) { ... }
    fun findById(id: Int): User? { ... }
}

class EmailService {
    fun sendWelcome(user: User) { ... }
}
```

## Open/Closed Principle (OCP)

### Definition
Class ควร open สำหรับ extension แต่ closed สำหรับ modification

### Kotlin Implementation

```kotlin
// Good: Open for extension via interface
interface SortStrategy<T> {
    fun sort(items: List<T>): List<T>
}

class AscendingSort<T : Comparable<T>> : SortStrategy<T> {
    override fun sort(items: List<T>) = items.sorted()
}

class DescendingSort<T : Comparable<T>> : SortStrategy<T> {
    override fun sort(items: List<T>) = items.sortedDescending()
}

class Sorter<T>(private val strategy: SortStrategy<T>) {
    fun sort(items: List<T>) = strategy.sort(items)
}

// Usage
val sorter = Sorter(DescendingSort<Int>())
val result = sorter.sort(listOf(3, 1, 2))
```

## Liskov Substitution Principle (LSP)

### Definition
Objects ของ superclass ควร replaceable ด้วย objects ของ subclass ได้โดยไม่เปลี่ยน correctness

### Kotlin Implementation

```kotlin
// Good: Proper inheritance
interface Readable {
    fun read(): String
}

interface Writable {
    fun write(content: String)
}

class File(val name: String) : Readable, Writable {
    override fun read() = "content from $name"
    override fun write(content: String) { /* write */ }
}

class ReadOnlyFile(name: String) : Readable {
    override fun read() = "content from $name"
}

// Functions can work with Readable
fun processReadable(readable: Readable) {
    println(readable.read())  // Works for both
}
```

## Interface Segregation Principle (ISP)

### Definition
Clients ไม่ควร被迫 implement interfaces ที่ไม่ได้ใช้

### Kotlin Implementation

```kotlin
// Bad: Fat interface
interface Machine {
    fun print()
    fun scan()
    fun fax()
}

// Good: Segregated interfaces
interface Printer {
    fun print()
}

interface Scanner {
    fun scan()
}

interface Fax {
    fun fax()
}

// Composed interface
class MultifunctionPrinter : Printer, Scanner, Fax {
    override fun print() { }
    override fun scan() { }
    override fun fax() { }
}

// Single-purpose device
class SimplePrinter : Printer {
    override fun print() { }
}
```

## Dependency Inversion Principle (DIP)

### Definition
High-level modules ไม่ควร depend on low-level modules ทั้งคู่ควร depend on abstractions

### Kotlin Implementation

```kotlin
// Bad: Direct dependency on concrete class
class OrderProcessor {
    private val database = MySQLDatabase()
    
    fun process(order: Order) {
        database.save(order)
    }
}

// Good: Depend on abstraction
interface OrderRepository {
    fun save(order: Order)
    fun findById(id: Int): Order?
}

class MySQLOrderRepository : OrderRepository {
    override fun save(order: Order) { /* MySQL specific */ }
    override fun findById(id: Int): Order? { /* MySQL specific */ }
}

class OrderProcessor(private val repository: OrderRepository) {
    fun process(order: Order) {
        repository.save(order)
    }
}

// Easy to switch implementations
val processor = OrderProcessor(InMemoryOrderRepository())
```

## Kotlin-Specific Patterns

### Use Interfaces for Abstractions

```kotlin
// Good
interface UserRepository {
    fun findById(id: Int): User?
    fun findAll(): List<User>
}

interface EmailService {
    fun send(to: String, subject: String, body: String)
}

// Good implementations
class JpaUserRepository : UserRepository {
    override fun findById(id: Int) = ...
    override fun findAll() = ...
}

class SmtpEmailService : EmailService {
    override fun send(to: String, subject: String, body: String) = ...
}
```

### Dependency Injection with Koin

```kotlin
// Define modules
val appModule = module {
    single<UserRepository> { JpaUserRepository() }
    single<EmailService> { SmtpEmailService() }
    single { UserService(get(), get()) }
}

// Use in class
class UserService(
    private val repository: UserRepository,
    private val emailService: EmailService
) {
    fun registerUser(name: String, email: String): User {
        val user = repository.save(User(name, email))
        emailService.send(email, "Welcome", "...")
        return user
    }
}
```

### Sealed Classes for Restricted Hierarchies

```kotlin
// Good: Sealed for closed set of types
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val message: String) : Result<Nothing>()
}

// Functions can safely handle all cases
fun handle(result: Result<User>) = when (result) {
    is Result.Success -> println(result.data)
    is Result.Error -> println(result.message)
}
```

## Summary Table

| Principle | Kotlin Feature | Key Point |
|-----------|---------------|-----------|
| SRP | Classes/Functions | One reason to change |
| OCP | Interfaces/Sealed | Extend without modify |
| LSP | Interfaces | Substitutable behavior |
| ISP | Small Interfaces | Client-specific |
| DIP | Interfaces/DI | Depend on abstractions |