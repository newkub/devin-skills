# Architecture

## Project Structure

```
src/
├── main/
│   ├── kotlin/
│   │   ├── Main.kt              # Entry point
│   │   ├── domain/              # Domain layer
│   │   │   ├── model/
│   │   │   └── repository/
│   │   ├── application/         # Application layer
│   │   │   ├── service/
│   │   │   └── dto/
│   │   └── infrastructure/      # Infrastructure layer
│   │       ├── api/
│   │       └── persistence/
│   └── resources/
│       └── application.conf
└── test/
    ├── kotlin/
    └── resources/
```

## Layer Architecture

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│   (Controllers, Views, UI)           │
├─────────────────────────────────────┤
│         Application Layer           │
│   (Services, Use Cases, DTOs)       │
├─────────────────────────────────────┤
│           Domain Layer               │
│   (Models, Repository Interfaces)    │
├─────────────────────────────────────┤
│       Infrastructure Layer          │
│   (API, Database, External Services) │
└─────────────────────────────────────┘
```

## Domain Layer

### Models

```kotlin
// src/main/kotlin/domain/model/User.kt
data class User(
    val id: Int,
    val name: String,
    val email: String,
    val createdAt: Instant
)
```

### Repository Interfaces

```kotlin
// src/main/kotlin/domain/repository/UserRepository.kt
interface UserRepository {
    fun findById(id: Int): User?
    fun findAll(): List<User>
    fun save(user: User): User
    fun delete(id: Int)
}
```

## Application Layer

### Service/Use Case

```kotlin
// src/main/kotlin/application/service/UserService.kt
class UserService(
    private val repository: UserRepository
) {
    fun getUser(id: Int): Result<User> {
        return repository.findById(id)
            ?.let { Result.success(it) }
            ?: Result.failure(UserNotFoundException(id))
    }
    
    fun createUser(dto: CreateUserDto): Result<User> {
        val user = User(
            id = generateId(),
            name = dto.name,
            email = dto.email,
            createdAt = Instant.now()
        )
        return Result.success(repository.save(user))
    }
}
```

### DTOs

```kotlin
// src/main/kotlin/application/dto/UserDto.kt
data class UserDto(
    val id: Int,
    val name: String,
    val email: String
)

data class CreateUserDto(
    val name: String,
    val email: String
)
```

## Infrastructure Layer

### Repository Implementation

```kotlin
// src/main/kotlin/infrastructure/persistence/InMemoryUserRepository.kt
class InMemoryUserRepository : UserRepository {
    private val users = mutableMapOf<Int, User>()
    
    override fun findById(id: Int) = users[id]
    override fun findAll() = users.values.toList()
    override fun save(user: User) = user.also { users[it.id] = it }
    override fun delete(id: Int) = users.remove(id)
}
```

### API Client

```kotlin
// src/main/kotlin/infrastructure/api/UserApiClient.kt
class UserApiClient(
    private val httpClient: HttpClient
) : UserRepository {
    override fun findById(id: Int): User? {
        return runBlocking {
            httpClient.get("https://api.example.com/users/$id")
                .body<User>()
        }
    }
}
```

## Dependency Injection

### Manual DI

```kotlin
// src/main/kotlin/Main.kt
fun main() {
    val repository = InMemoryUserRepository()
    val service = UserService(repository)
    val controller = UserController(service)
    
    // Start application
}
```

### With Koin

```kotlin
// src/main/kotlin/di/AppModule.kt
val appModule = module {
    single<UserRepository> { InMemoryUserRepository() }
    single { UserService(get()) }
    single { UserController(get()) }
}

fun main() {
    startKoin { modules(appModule) }
    // ...
}
```

## Multiplatform Structure

```
shared/
├── src/
│   ├── commonMain/kotlin/     # Shared code
│   │   └── com/example/
│   │       └── shared/
│   ├── jvmMain/kotlin/        # JVM-specific
│   ├── jsMain/kotlin/         # JavaScript-specific
│   └── nativeMain/kotlin/     # Native-specific
└── build.gradle.kts
```

### Common Code

```kotlin
// commonMain/kotlin/com/example/shared/Platform.kt
expect class Platform() {
    val name: String
}

fun getPlatformName(): String = Platform().name
```

### Platform-Specific

```kotlin
// jvmMain/kotlin/com/example/shared/Platform.kt
actual class Platform {
    actual val name: String = "JVM"
}

// jsMain/kotlin/com/example/shared/Platform.kt
actual class Platform {
    actual val name: String = "JavaScript"
}
```