# Add Dependency - Kotlin

## Overview

วิธีการเพิ่ม dependencies ในโปรเจกต์ Kotlin ด้วย Gradle

## Finding Dependencies

### Search Maven Central

```bash
# Search via curl
curl "https://search.maven.org/solrsearch/select?q=ktor&rows=5&wt=json"

# Or visit https://search.maven.org
```

### Popular Libraries

| Library | Group | Artifact | Version |
|---------|-------|----------|---------|
| Ktor Server | io.ktor | ktor-server-core | 2.3.6 |
| Ktor Client | io.ktor | ktor-client-core | 2.3.6 |
| Kotlinx Coroutines | org.jetbrains.kotlinx | kotlinx-coroutines-core | 1.8.0 |
| Kotlinx Serialization | org.jetbrains.kotlinx | kotlinx-serialization-json | 1.6.2 |
| Koin (DI) | io.insert-koin | koin-core | 3.5.3 |
| MockK (Testing) | io.mockk | mockk | 1.13.8 |
| Exposed (SQL) | org.jetbrains.exposed | exposed-core | 0.46.0 |

## Adding Dependencies

### Standard Library

```kotlin
dependencies {
    // Kotlin standard library (usually included)
    implementation(kotlin("stdlib"))

    // Reflection
    implementation(kotlin("reflect"))

    // Test library
    testImplementation(kotlin("test"))
}
```

### Kotlinx Libraries

```kotlin
dependencies {
    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-jdk8:1.8.0")

    // Serialization
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.2")

    // DateTime
    implementation("org.jetbrains.kotlinx:kotlinx-datetime:0.5.0")
}
```

### Ktor Dependencies

```kotlin
dependencies {
    // Server
    implementation("io.ktor:ktor-server-core:2.3.6")
    implementation("io.ktor:ktor-server-netty:2.3.6")
    implementation("io.ktor:ktor-server-content-negotiation:2.3.6")
    implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.6")

    // Client
    implementation("io.ktor:ktor-client-core:2.3.6")
    implementation("io.ktor:ktor-client-cio:2.3.6")
    implementation("io.ktor:ktor-client-content-negotiation:2.3.6")
}
```

### Android Dependencies

```kotlin
dependencies {
    // AndroidX Core
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")

    // Material Design
    implementation("com.google.android.material:material:1.11.0")

    // Lifecycle
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0")

    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.0")

    // Testing
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
}
```

### Database Libraries

```kotlin
dependencies {
    // Exposed ORM
    implementation("org.jetbrains.exposed:exposed-core:0.46.0")
    implementation("org.jetbrains.exposed:exposed-dao:0.46.0")
    implementation("org.jetbrains.exposed:exposed-jdbc:0.46.0")

    // JDBC Driver
    implementation("com.h2database:h2:2.2.224")
    implementation("org.postgresql:postgresql:42.7.1")

    // HikariCP (Connection Pool)
    implementation("com.zaxxer:HikariCP:5.1.0")
}
```

### Testing Dependencies

```kotlin
dependencies {
    // Kotlin Test
    testImplementation(kotlin("test"))

    // JUnit 5
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")

    // MockK
    testImplementation("io.mockk:mockk:1.13.8")

    // Kotest
    testImplementation("io.kotest:kotest-runner-junit5:5.8.0")
    testImplementation("io.kotest:kotest-assertions-core:5.8.0")

    // Ktor Test
    testImplementation("io.ktor:ktor-server-test-host:2.3.6")
}
```

### Dependency Injection

```kotlin
dependencies {
    // Koin
    implementation("io.insert-koin:koin-core:3.5.3")
    implementation("io.insert-koin:koin-ktor:3.5.3")

    // For Android
    implementation("io.insert-koin:koin-android:3.5.3")
}
```

## Configuration Plugins

### Serialization Plugin

```kotlin
plugins {
    kotlin("jvm") version "2.0.0"
    kotlin("plugin.serialization") version "2.0.0"
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.2")
}
```

### KSP Plugin (Kotlin Symbol Processing)

```kotlin
plugins {
    kotlin("jvm") version "2.0.0"
    id("com.google.devtools.ksp") version "1.9.22-1.0.16"
}

dependencies {
    ksp("com.example:processor:1.0.0")
}
```

## Version Catalogs (Recommended)

### gradle/libs.versions.toml

```toml
[versions]
kotlin = "2.0.0"
ktor = "2.3.6"
coroutines = "1.8.0"
serialization = "1.6.2"

[libraries]
kotlin-stdlib = { module = "org.jetbrains.kotlin:kotlin-stdlib", version.ref = "kotlin" }
ktor-server-core = { module = "io.ktor:ktor-server-core", version.ref = "ktor" }
ktor-server-netty = { module = "io.ktor:ktor-server-netty", version.ref = "ktor" }
coroutines-core = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "coroutines" }
serialization-json = { module = "org.jetbrains.kotlinx:kotlinx-serialization-json", version.ref = "serialization" }

[plugins]
kotlin-jvm = { id = "org.jetbrains.kotlin.jvm", version.ref = "kotlin" }
kotlin-serialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
```

### build.gradle.kts

```kotlin
plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.kotlin.serialization)
}

dependencies {
    implementation(libs.kotlin.stdlib)
    implementation(libs.ktor.server.core)
    implementation(libs.ktor.server.netty)
    implementation(libs.coroutines.core)
    implementation(libs.serialization.json)
}
```

## Dependency Scopes

### JVM Scopes

| Scope | Description | Example |
|-------|-------------|---------|
| `implementation` | Required for compilation and runtime | `implementation("lib:name")` |
| `api` | Exposed to consumers | `api("lib:name")` |
| `compileOnly` | Required only for compilation | `compileOnly("lib:name")` |
| `runtimeOnly` | Required only for runtime | `runtimeOnly("lib:name")` |
| `testImplementation` | Required for test compilation | `testImplementation("lib:name")` |
| `testRuntimeOnly` | Required only for test runtime | `testRuntimeOnly("lib:name")` |

### Android Scopes

| Scope | Description | Example |
|-------|-------------|---------|
| `implementation` | Main implementation | `implementation("lib:name")` |
| `api` | Exposed to app module | `api("lib:name")` |
| `debugImplementation` | Debug builds only | `debugImplementation("lib:name")` |
| `releaseImplementation` | Release builds only | `releaseImplementation("lib:name")` |
| `androidTestImplementation` | Android tests | `androidTestImplementation("lib:name")` |

## Excluding Dependencies

```kotlin
dependencies {
    implementation("com.example:library:1.0") {
        exclude(group = "org.unwanted", module = "unwanted-lib")
    }
}
```

## Force Specific Version

```kotlin
configurations.all {
    resolutionStrategy {
        force("com.example:library:1.0.0")
    }
}
```

## Sync Dependencies

```bash
# Sync Gradle
./gradlew build --refresh-dependencies

# Or in IDE
# IntelliJ: File → Sync Project with Gradle Files
# Android Studio: File → Sync Project with Gradle Files
```

## Verification

```bash
# Check dependency tree
./gradlew dependencies

# Check specific configuration
./gradlew dependencies --configuration runtimeClasspath

# Check for updates
./gradlew dependencyUpdates
```

## Common Issues

### Version Conflicts

- Use dependency resolution strategy
- Check dependency tree: `./gradlew dependencies`
- Exclude conflicting transitive dependencies

### Not Found Errors

- Verify repository configuration
- Check artifact coordinates
- Ensure version exists

### License Issues

- Check library licenses
- Use compatible licenses
- Document dependencies

## Best Practices

- Use version catalogs for centralized version management
- Pin versions for production
- Regularly update dependencies
- Check for security vulnerabilities
- Document why specific versions are chosen
