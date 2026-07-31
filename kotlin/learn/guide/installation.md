# Installation - Kotlin

## Prerequisites

### Java Development Kit (JDK)

Kotlin requires JDK 8 or higher. Install from https://adoptium.net/

```bash
# Verify Java installation
java -version
javac -version
```

## Installation Methods

### Via SDKMAN (Recommended for Linux/macOS)

```bash
# Install SDKMAN
curl -s "https://get.sdkman.io" | bash

# Install Kotlin
sdk install kotlin

# Verify installation
kotlin -version
```

### Via Homebrew (macOS)

```bash
brew install kotlin
kotlin -version
```

### Via Chocolatey (Windows)

```powershell
choco install kotlin
kotlin -version
```

### Manual Installation

1. Download from https://github.com/JetBrains/kotlin/releases
2. Extract to preferred location
3. Add `bin` directory to PATH

## Kotlin CLI Tools

### kotlinc (Compiler)

```bash
# Compile Kotlin file
kotlinc MyFile.kt -include-runtime -d MyApp.jar

# Run script
kotlinc -script script.kts

# Compile multiple files
kotlinc *.kt -d output.jar
```

### kotlin (Launcher)

```bash
# Run compiled JAR
kotlin MyApp.jar

# Run script file
kotlin script.kts
```

## Gradle Setup

### Install Gradle

```bash
# Via SDKMAN
sdk install gradle

# Via Homebrew
brew install gradle

# Verify
gradle --version
```

### Create Kotlin Project

```bash
# Create project with Gradle wrapper
mkdir my-project && cd my-project
gradle init --type kotlin-application

# Directory structure
my-project/
├── build.gradle.kts
├── settings.gradle.kts
├── gradle/
│   └── wrapper/
└── src/
    ├── main/
    │   ├── kotlin/
    │   └── resources/
    └── test/
        ├── kotlin/
        └── resources/
```

### build.gradle.kts

```kotlin
plugins {
    kotlin("jvm") version "1.9.22"
    application
}

group = "com.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib"))
    testImplementation(kotlin("test"))
}

application {
    mainClass.set("MainKt")
}

tasks.test {
    useJUnit()
}
```

## IDE Setup

### IntelliJ IDEA

IntelliJ IDEA comes with Kotlin support built-in.

1. File → New Project → Kotlin
2. Select JVM, Android, or Multiplatform
3. Choose Kotlin version

### VS Code

1. Install Kotlin Language extension
2. Install Code Kotlin extension
3. Optionally install Kotlin Debugger extension

### Android Studio

Kotlin is the primary language for Android development.

1. File → New → New Project
2. Select Kotlin as language

## Verify Installation

```bash
# Check Kotlin version
kotlin -version

# Compile a simple file
echo 'fun main() = println("Hello, Kotlin!")' > hello.kt
kotlinc hello.kt -include-runtime -d hello.jar
kotlin hello.jar
```

## Update Kotlin

```bash
# Via SDKMAN
sdk install kotlin 1.9.22

# Via Gradle (update version in build.gradle.kts)
# plugins { kotlin("jvm") version "1.9.22" }
```