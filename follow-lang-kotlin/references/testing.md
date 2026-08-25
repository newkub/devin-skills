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
