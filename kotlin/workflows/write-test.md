# Write Test - Kotlin

## Overview

วิธีการเขียน unit tests และ integration tests ใน Kotlin

## Test Frameworks

### Kotlin Test (Built-in)

Kotlin comes with a built-in test framework that works with JUnit.

### Setup

```kotlin
// build.gradle.kts
dependencies {
    testImplementation(kotlin("test"))
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")
}

tasks.test {
    useJUnitPlatform()
}
```

## Basic Tests

### Simple Test

```kotlin
import kotlin.test.*

class CalculatorTest {
    @Test
    fun testAddition() {
        val result = 2 + 2
        assertEquals(4, result)
    }

    @Test
    fun testString() {
        val text = "Hello"
        assertTrue(text.startsWith("H"))
        assertFalse(text.isEmpty())
    }
}
```

### Test Structure

```
src/
├── main/
│   └── kotlin/
│       └── Calculator.kt
└── test/
    └── kotlin/
        └── CalculatorTest.kt
```

## Assertions

### Common Assertions

| Assertion | Description | Example |
|-----------|-------------|---------|
| `assertEquals` | Assert equality | `assertEquals(1, 1)` |
| `assertNotEquals` | Assert inequality | `assertNotEquals(1, 2)` |
| `assertTrue` | Assert true | `assertTrue(condition)` |
| `assertFalse` | Assert false | `assertFalse(condition)` |
| `assertNull` | Assert null | `assertNull(value)` |
| `assertNotNull` | Assert not null | `assertNotNull(value)` |
| `assertSame` | Assert same reference | `assertSame(a, b)` |
| `assertNotSame` | Assert different reference | `assertNotSame(a, b)` |
| `assertContains` | Assert contains element | `assertContains(list, item)` |
| `assertFailsWith` | Assert exception thrown | `assertFailsWith<Exception> { }` |

### Example

```kotlin
class StringUtilsTest {
    @Test
    fun testReverse() {
        val result = reverse("hello")
        assertEquals("olleh", result)
    }

    @Test
    fun testEmptyString() {
        val result = reverse("")
        assertEquals("", result)
    }

    @Test
    fun testNullInput() {
        assertFailsWith<IllegalArgumentException> {
            reverse(null)
        }
    }
}
```

## Test Lifecycle

### Setup and Teardown

```kotlin
class DatabaseTest {
    private lateinit var db: Database

    @BeforeTest
    fun setup() {
        db = Database(":memory:")
        db.init()
    }

    @AfterTest
    fun teardown() {
        db.close()
    }

    @Test
    fun testInsert() {
        db.insert(User(1, "Alice"))
        val user = db.findById(1)
        assertNotNull(user)
        assertEquals("Alice", user?.name)
    }
}
```

### Class-Level Setup

```kotlin
class ServiceTest {
    companion object {
        private lateinit var server: TestServer

        @BeforeAll
        fun startServer() {
            server = TestServer()
            server.start()
        }

        @AfterAll
        fun stopServer() {
            server.stop()
        }
    }

    @Test
    fun testRequest() {
        val response = server.request("/api/test")
        assertEquals(200, response.status)
    }
}
```

## Parameterized Tests

### Kotlin Test Parameterization

```kotlin
class MathTest {
    @Test
    fun testSquare() {
        val cases = listOf(
            0 to 0,
            1 to 1,
            2 to 4,
            3 to 9,
            -2 to 4
        )

        cases.forEach { (input, expected) ->
            val result = square(input)
            assertEquals(expected, result, "square($input) should be $expected")
        }
    }
}
```

### Kotest Parameterization

```kotlin
import io.kotest.core.spec.style.StringSpec
import io.kotest.datatest.withData
import io.kotest.matchers.shouldBe

class MathTest : StringSpec({
    "square should return correct value" {
        withData(
            nameFn = { (n, _) -> "n=$n" },
            0 to 0,
            1 to 1,
            2 to 4,
            3 to 9
        ) { (input, expected) ->
            square(input) shouldBe expected
        }
    }
})
```

## Mocking with MockK

### Setup

```kotlin
// build.gradle.kts
dependencies {
    testImplementation("io.mockk:mockk:1.13.8")
}
```

### Basic Mocking

```kotlin
import io.mockk.*

class UserServiceTest {
    @Test
    fun testGetUser() {
        // Create mock
        val repository = mockk<UserRepository>()

        // Define behavior
        every { repository.findById(1) } returns User(1, "Alice")

        // Use mock
        val service = UserService(repository)
        val user = service.getUser(1)

        // Verify
        assertEquals("Alice", user.name)
        verify { repository.findById(1) }
    }

    @Test
    fun testSaveUser() {
        val repository = mockk<UserRepository>(relaxed = true)
        val service = UserService(repository)

        service.saveUser(User(1, "Bob"))

        verify { repository.save(any()) }
    }
}
```

### Argument Matching

```kotlin
@Test
fun testArgumentMatching() {
    val repository = mockk<UserRepository>()

    every { repository.findById(any()) } returns User(0, "Default")
    every { repository.findById(1) } returns User(1, "Alice")
    every { repository.findById(match { it > 10 }) } returns User(10, "High")

    val user1 = repository.findById(1)
    val user5 = repository.findById(5)
    val user15 = repository.findById(15)

    assertEquals("Alice", user1.name)
    assertEquals("Default", user5.name)
    assertEquals("High", user15.name)
}
```

### Capturing Arguments

```kotlin
@Test
fun testCaptureArgument() {
    val repository = mockk<UserRepository>()
    val service = UserService(repository)

    val slot = slot<User>()
    every { repository.save(capture(slot)) } just Runs

    service.saveUser(User(1, "Alice"))

    assertEquals("Alice", slot.captured.name)
}
```

## Testing Coroutines

### Test Coroutines

```kotlin
import kotlinx.coroutines.test.runTest

class CoroutineServiceTest {
    @Test
    fun testAsyncOperation() = runTest {
        val service = CoroutineService()
        val result = service.fetchData()
        assertEquals("data", result)
    }
}
```

### Mocking Coroutines

```kotlin
@Test
fun testCoroutineMock() = runTest {
    val repository = mockk<CoroutineRepository>()
    coEvery { repository.fetchData() } returns "data"

    val service = CoroutineService(repository)
    val result = service.getData()

    assertEquals("data", result)
    coVerify { repository.fetchData() }
}
```

## Testing with Ktor

### Ktor Test Support

```kotlin
// build.gradle.kts
dependencies {
    testImplementation("io.ktor:ktor-server-test-host:2.3.6")
    testImplementation("io.ktor:ktor-client-mock:2.3.6")
}
```

### Test Ktor Routes

```kotlin
import io.ktor.server.testing.*
import io.ktor.http.*
import kotlin.test.*

class RouteTest {
    @Test
    fun testRootRoute() {
        withTestApplication({ configureRouting() }) {
            handleRequest(HttpMethod.Get, "/").apply {
                assertEquals(HttpStatusCode.OK, response.status())
                assertEquals("Hello", response.content)
            }
        }
    }

    @Test
    fun testApiRoute() {
        withTestApplication({ configureRouting() }) {
            handleRequest(HttpMethod.Get, "/api/users").apply {
                assertEquals(HttpStatusCode.OK, response.status())
                val users = Json.decodeFromString<List<User>>(response.content!!)
                assertTrue(users.isNotEmpty())
            }
        }
    }
}
```

## Testing Android

### Android Test Setup

```kotlin
// build.gradle.kts
dependencies {
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
}
```

### Unit Test

```kotlin
class ViewModelTest {
    @Test
    fun testViewModel() {
        val viewModel = MyViewModel()
        viewModel.updateData("test")
        assertEquals("test", viewModel.data.value)
    }
}
```

### Instrumented Test

```kotlin
@RunWith(AndroidJUnit4::class)
class MainActivityTest {
    @get:Rule
    val activityRule = ActivityScenarioRule(MainActivity::class.java)

    @Test
    fun testButtonClick() {
        onView(withId(R.id.button)).perform(click())
        onView(withId(R.id.textView)).check(matches(withText("Clicked")))
    }
}
```

## Running Tests

### Run All Tests

```bash
./gradlew test
```

### Run Specific Test

```bash
./gradlew test --tests CalculatorTest
./gradlew test --tests CalculatorTest.testAddition
```

### Run with Coverage

```bash
./gradlew test jacocoTestReport
```

## Test Best Practices

### Naming Conventions

```kotlin
// Good
fun testAddition_returnsCorrectSum()
fun testEmptyString_returnsEmpty()
fun testNullInput_throwsException()

// Avoid
fun test1()
fun testMath()
fun test()
```

### Arrange-Act-Assert

```kotlin
@Test
fun testCalculateTotal() {
    // Arrange
    val cart = Cart()
    cart.addItem(Item("Book", 10.0))
    cart.addItem(Item("Pen", 5.0))

    // Act
    val total = cart.calculateTotal()

    // Assert
    assertEquals(15.0, total)
}
```

### Test Independence

- Each test should be independent
- Don't rely on test execution order
- Clean up resources in @AfterTest
- Use fresh instances for each test

### Test Coverage

- Aim for >80% code coverage
- Test edge cases and error conditions
- Test public APIs, not implementation details
- Use tools like JaCoCo for coverage reports

## Common Issues

### Test Not Found

- Ensure test file is in `src/test/kotlin`
- Check test class name ends with `Test`
- Verify test function has `@Test` annotation

### Mock Not Working

- Check MockK version compatibility
- Use `relaxed = true` for simple mocks
- Verify mock setup with `verify`

### Coroutine Test Fails

- Use `runTest` for coroutine tests
- Use `coEvery` and `coVerify` for coroutine mocks
- Ensure test dispatcher is configured

## Next Steps

- Debug tests: See `workflows/debug-code.md`
- Write integration tests
- Set up CI/CD for automated testing
