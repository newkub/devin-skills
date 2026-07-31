# Configuration

## Gradle Kotlin DSL

### Project Configuration

```kotlin
// settings.gradle.kts
rootProject.name = "my-project"

pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
```

### Module Configuration

```kotlin
// build.gradle.kts (module)
plugins {
    kotlin("jvm") version "1.9.22"
}

group = "com.example"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    // Kotlin
    implementation(kotlin("stdlib"))
    implementation(kotlin("reflect"))
    
    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
    
    // Testing
    testImplementation(kotlin("test"))
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")
}

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}
```

## Kotlin Compiler Options

### Gradle DSL Options

```kotlin
tasks.withType<KotlinCompile> {
    kotlinOptions {
        jvmTarget = "17"
        languageVersion = "1.9"
        apiVersion = "1.9"
        freeCompilerArgs = listOf(
            "-Xjsr305=strict",
            "-Xjvm-default=all"
        )
    }
}
```

### Compiler Options Table

| Option | Values | Description |
|--------|--------|-------------|
| jvmTarget | 1.8, 11, 17, 21 | JVM target version |
| languageVersion | 1.8, 1.9, 2.0 | Language version |
| apiVersion | 1.8, 1.9, 2.0 | Allowed API |
| javaParameters | true/false | Generate @Param for Java 8+ |
| noReflect | true/false | Exclude kotlin-reflect |
| noStdlib | true/false | Exclude kotlin-stdlib |

### Free Compiler Arguments

| Argument | Description |
|----------|-------------|
| `-Xjsr305=strict` | Enable strict null checking for JS-310 |
| `-Xjvm-default=all` | Enable default methods in interfaces |
| `-Xmulti-platform` | Enable multiplatform support |
| `-Xexpect-actual-classes` | Expect/actual classes support |
| `-Xcontext-receivers` | Enable context receivers |

## Multiplatform Configuration

```kotlin
// build.gradle.kts
plugins {
    kotlin("multiplatform") version "1.9.22"
}

kotlin {
    jvm {
        withJava()
        testRuns["test"].executionTask.configure {
            useJUnit()
        }
    }
    js {
        browser()
        nodejs()
    }
    linuxX64()
    mingwX64()
    
    sourceSets {
        val commonMain by getting
        val jvmMain by getting { dependsOn(commonMain) }
        val jsMain by getting { dependsOn(commonMain) }
    }
}
```

## Android Configuration

```kotlin
// build.gradle.kts (Android)
plugins {
    id("com.android.application") version "8.2.0"
    kotlin("android") version "1.9.22"
}

android {
    namespace = "com.example.app"
    compileSdk = 34
    
    defaultConfig {
        applicationId = "com.example.app"
        minSdk = 24
        targetSdk = 34
    }
    
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    
    kotlinOptions {
        jvmTarget = "17"
        freeCompilerArgs += listOf("-opt-in=kotlin.RequiresOptIn")
    }
}
```

## Testing Configuration

```kotlin
tasks.test {
    useJUnitPlatform()
}

tasks.withType<KotlinCompile> {
    compilerOptions {
        freeCompilerArgs.add("-Xexplicit-inline-source-code")
    }
}
```

## Key Options Summary

| Category | Option | Recommended Value |
|----------|--------|-------------------|
| JVM | jvmTarget | "17" |
| Language | languageVersion | "1.9" |
| Null Safety | -Xjsr305 | strict |
| Interop | javaParameters | true |
| Android | freeCompilerArgs | -opt-in=... |