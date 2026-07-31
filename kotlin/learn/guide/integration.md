# Integration

## With Build Tools

### Gradle (Kotlin DSL)

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "1.9.22"
    id("application")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib"))
}
```

### Maven

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>1.9.22</version>
    <executions>
        <execution>
            <goals>
                <goal>compile</goal>
                <goal>test-compile</goal>
            </goals>
        </execution>
    </executions>
    <configuration>
        <args>
            <arg>-Xjsr305=strict</arg>
        </args>
    </configuration>
</plugin>
```

## With Frameworks

### Spring Boot

```kotlin
// build.gradle.kts
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
}
```

```kotlin
// src/main/kotlin/com/example/DemoApplication.kt
@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}

@RestController
class UserController {
    @GetMapping("/users/{id}")
    fun getUser(@PathVariable id: Long): User {
        return userService.findById(id)
    }
}
```

### Ktor

```kotlin
// build.gradle.kts
dependencies {
    implementation("io.ktor:ktor-server-core")
    implementation("io.ktor:ktor-server-netty")
}

fun main() {
    embeddedServer(Netty, port = 8080) {
        routing {
            get("/") {
                call.respondText("Hello, Kotlin!")
            }
        }
    }.start()
}
```

### JUnit 5

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

```kotlin
// src/test/kotlin/MyTest.kt
class MyTest {
    @Test
    fun `test addition`() {
        assertEquals(4, 2 + 2)
    }
}
```

## With Testing Libraries

### MockK

```kotlin
// build.gradle.kts
dependencies {
    testImplementation("io.mockk:mockk:1.13.8")
}
```

```kotlin
// Mocking
val mockUserService = mockk<UserService> {
    every { findById(1) } returns User(1, "Alice")
}

verify { mockUserService.findById(1) }
```

### Kotest

```kotlin
// build.gradle.kts
dependencies {
    testImplementation("io.kotest:kotest-runner-junit5:5.8.0")
}
```

```kotlin
class UserTest : FunSpec() {
    init {
        test("should create user") {
            val user = User(1, "Alice")
            user.name shouldBe "Alice"
        }
    }
}
```

## With Linting

### ktlint

```kotlin
// build.gradle.kts
plugins {
    id("org.jlleitschuh.gradle.ktlint") version "11.6.0"
}

ktlint {
    version.set("1.0.1")
}
```

## With Serialization

### Kotlinx Serialization

```kotlin
// build.gradle.kts
plugins {
    kotlin("plugin.serialization") version "1.9.22"
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json")
}
```

```kotlin
import kotlinx.serialization.Serializable

@Serializable
data class User(val name: String, val age: Int)

val json = Json.encodeToString(User("Alice", 30))
val user = Json.decodeFromString<User>(json)
```

### Jackson

```kotlin
// build.gradle.kts
dependencies {
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
}
```

```kotlin
val mapper = ObjectMapper().registerModule(KotlinModule())
val user = mapper.readValue<User>(jsonString)
```

## With Dependency Injection

### Koin

```kotlin
// build.gradle.kts
dependencies {
    implementation("io.insert-koin:koin-core:3.5.0")
}

val appModule = module {
    single { UserRepository() }
    single { UserService(get()) }
}

fun main() {
    startKoin { modules(appModule) }
}
```

### Hilt

```kotlin
// build.gradle.kts (Android)
plugins {
    id("com.google.dagger.hilt.android")
    kotlin("kapt")
}

dependencies {
    implementation("com.google.dagger:hilt-android")
    kapt("com.google.dagger:hilt-compiler")
}
```

```kotlin
@HiltViewModel
class UserViewModel @Inject constructor(
    private val userService: UserService
) : ViewModel()
```

## With Logging

### Kotlin Logging

```kotlin
// build.gradle.kts
dependencies {
    implementation("io.github.microutils:kotlin-logging:3.0.5")
}
```

```kotlin
import mu.KotlinLogging

private val logger = KotlinLogging.logger {}

fun main() {
    logger.info { "Application started" }
    logger.error(e) { "Error occurred" }
}
```