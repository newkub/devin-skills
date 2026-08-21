## Project Structure

โครงสร้างแนะนำยึดตาม Clean Architecture เพื่อแยกความรับผิดชอบเป็น `Data`, `Domain`, `Presentation` และมี `core` เป็นของใช้ร่วมกัน

### (Clean Architecture)

```plaintext
src/main/kotlin/com/mycompany/app/
├── core/                  # Core utilities
│   └── error/             # Failure classes, Exceptions
├── data/
│   ├── datasource/        # Remote/Local data sources
│   ├── model/             # DTOs (Data Transfer Objects)
│   └── repository/        # Implementation of domain repositories
├── domain/
│   ├── model/             # Business models (Entities)
│   ├── repository/        # Repository interfaces (contracts)
│   └── usecase/           # Business logic
├── presentation/
│   ├── di/                # Koin modules
│   ├── screen/            # Composable screens
│   └── viewmodel/         # ViewModels
└── Main.kt                # Application entry point
```

## Core Principles

- แยก Layer ชัดเจน (Presentation / Domain / Data)
- Domain ต้องไม่ผูกกับ Framework/UI
- Data แปลง DTO -> Domain เสมอ (Single Source of Truth ฝั่ง Domain)
- Error handling แบบ explicit ด้วย `Either<Failure, Success>`
- Side effects อยู่ใน Data layer (IO/network/storage)

## Folder Rules

### `data/` (Data Layer)

จัดการ I/O ทั้งหมด: API/Local storage และ mapping

### Data Layer: การจัดการข้อมูล

#### `data/model` (DTOs)

ใช้ `kotlinx.serialization` สำหรับการแปลง JSON และสร้าง Mapper ไปยัง Domain Model

```kotlin
// src/data/model/UserDto.kt
import kotlinx.serialization.Serializable

@Serializable
data class UserDto(
    val id: String,
    val username: String,
    val email: String
) {
    fun toDomain(): User = User(id = id, name = username, email = email)
}
```

#### `data/repository`

Implement Repository โดยใช้ `Either` จาก Arrow เพื่อจัดการ `Failure`

```kotlin
// src/data/repository/UserRepositoryImpl.kt
import arrow.core.Either

class UserRepositoryImpl(private val remoteDataSource: UserRemoteDataSource) : UserRepository {
    override suspend fun getUser(id: String): Either<Failure, User> = Either.catch {
        remoteDataSource.fetchUser(id).toDomain()
    }.mapLeft { throwable ->
        ServerFailure(throwable.message ?: "An unknown error occurred")
    }
}
```

### `domain/` (Domain Layer)

นิยาม Entities, Contracts (Repository interface), UseCases

#### Domain Layer: ตรรกะทางธุรกิจ

#### `domain/repository`

กำหนด Interface โดยใช้ `Either` เพื่อบังคับให้มีการจัดการ Error

```kotlin
// src/domain/repository/UserRepository.kt
import arrow.core.Either

interface UserRepository {
    suspend fun getUser(id: String): Either<Failure, User>
}
```

#### `domain/usecase`

สร้าง Use Case ที่มีหน้าที่เดียวและชัดเจน

```kotlin
// src/domain/usecase/GetUserUseCase.kt
class GetUserUseCase(private val repository: UserRepository) {
    suspend operator fun invoke(id: String): Either<Failure, User> = repository.getUser(id)
}
```

### `presentation/` (Presentation Layer)

UI/State/DI สำหรับหน้าจอ (Compose + ViewModel)

#### Presentation Layer: UI และ State

#### `presentation/di` (Dependency Injection)

ตั้งค่า Koin Modules เพื่อจัดการ Dependencies ทั้งหมด

```kotlin
// src/presentation/di/AppModule.kt
import org.koin.dsl.module

val appModule = module {
    // Data
    single<UserRemoteDataSource> { UserRemoteDataSourceImpl(get()) }
    single<UserRepository> { UserRepositoryImpl(get()) }

    // Domain
    factory { GetUserUseCase(get()) }

    // Presentation
    factory { UserViewModel(get()) }
}
```

#### `presentation/viewmodel`

ViewModel จะจัดการ State และเรียกใช้ Use Case

```kotlin
// src/presentation/viewmodel/UserViewModel.kt
data class UserScreenState(
    val isLoading: Boolean = false,
    val user: User? = null,
    val error: String? = null
)

class UserViewModel(private val getUserUseCase: GetUserUseCase) : ViewModel() {
    private val _uiState = MutableStateFlow(UserScreenState())
    val uiState: StateFlow<UserScreenState> = _uiState.asStateFlow()

    fun fetchUser(id: String) {
        viewModelScope.launch {
            _uiState.value = UserScreenState(isLoading = true)
            getUserUseCase(id).fold(
                ifLeft = { failure ->
                    _uiState.value = UserScreenState(error = failure.message)
                },
                ifRight = { user ->
                    _uiState.value = UserScreenState(user = user)
                }
            )
        }
    }
}
```

#### `presentation/screen`

UI จะแสดงผลตาม `UserScreenState`

```kotlin
// src/presentation/screen/UserProfileScreen.kt
@Composable
fun UserProfileScreen(viewModel: UserViewModel = koinInject()) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.fetchUser("1")
    }

    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        when {
            uiState.isLoading -> CircularProgressIndicator()
            uiState.error != null -> Text("Error: ${uiState.error}")
            uiState.user != null -> Text("Hello, ${uiState.user!!.name}")
        }
    }
}
```

## Error Handling

ใช้ `Either<L, R>` เพื่อจัดการกับผลลัพธ์ที่อาจเป็น `Failure` (L) หรือ `Success` (R)

```kotlin
// src/core/error/Failure.kt
sealed class Failure(val message: String)

class ServerFailure(message: String) : Failure(message)
class CacheFailure(message: String) : Failure(message)
```

## Testing

เขียน Unit Test สำหรับ Use Case โดยใช้ `MockK`

```kotlin
// src/test/kotlin/com/mycompany/app/domain/usecase/GetUserUseCaseTest.kt
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.test.runTest
import org.junit.Test

class GetUserUseCaseTest {
    private val repository: UserRepository = mockk()
    private val useCase = GetUserUseCase(repository)

    @Test
    fun `invoke should return user from repository`() = runTest {
        // Arrange
        val user = User("1", "Test", "test@example.com")
        coEvery { repository.getUser("1") } returns Either.Right(user)

        // Act
        val result = useCase("1")

        // Assert
        assertEquals(Either.Right(user), result)
    }
}
```
