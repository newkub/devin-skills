# Setup Project - Kotlin

## Overview

วิธีการตั้งค่าโปรเจกต์ Kotlin ใหม่สำหรับแต่ละ platform

## Kotlin JVM Project

### Using Gradle (Recommended)

```bash
# Create directory
mkdir my-kotlin-project
cd my-kotlin-project

# Initialize Gradle project
gradle init --type kotlin-application

# Or use Gradle wrapper
gradle wrapper --gradle-version 8.5
```

### build.gradle.kts

```kotlin
plugins {
    kotlin("jvm") version "2.0.0"
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
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")
}

application {
    mainClass.set("MainKt")
}

tasks.test {
    useJUnitPlatform()
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions.jvmTarget = "17"
}
```

### Project Structure

```
my-kotlin-project/
├── build.gradle.kts
├── settings.gradle.kts
├── gradlew
├── gradlew.bat
├── gradle/
│   └── wrapper/
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
└── src/
    ├── main/
    │   ├── kotlin/
    │   │   └── Main.kt
    │   └── resources/
    └── test/
        ├── kotlin/
        │   └── MainTest.kt
        └── resources/
```

### Main.kt

```kotlin
fun main() {
    println("Hello, Kotlin!")
}
```

## Android Project

### Using Android Studio

1. Open Android Studio
2. File → New → New Project
3. Select "Empty Activity"
4. Choose "Kotlin" as language
5. Configure project settings
6. Click "Finish"

### build.gradle.kts (Module)

```kotlin
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.example.myapp"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.myapp"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
}
```

## Kotlin Multiplatform Project

### Using Gradle

```bash
mkdir my-kmp-project
cd my-kmp-project
gradle init --type kotlin-multiplatform-library
```

### build.gradle.kts

```kotlin
plugins {
    kotlin("multiplatform") version "2.0.0"
}

group = "com.example"
version = "1.0-SNAPSHOT"

kotlin {
    jvm {
        jvmToolchain(17)
        withJava()
    }
    js(IR) {
        browser()
        nodejs()
    }

    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation(kotlin("stdlib"))
            }
        }
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test"))
            }
        }
        val jvmMain by getting
        val jvmTest by getting
        val jsMain by getting
        val jsTest by getting
    }
}
```

## Ktor Server Project

### build.gradle.kts

```kotlin
plugins {
    kotlin("jvm") version "2.0.0"
    application
}

group = "com.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib"))
    implementation("io.ktor:ktor-server-core:2.3.6")
    implementation("io.ktor:ktor-server-netty:2.3.6")
    implementation("ch.qos.logback:logback-classic:1.4.11")
    testImplementation(kotlin("test"))
}

application {
    mainClass.set("ApplicationKt")
}
```

### Application.kt

```kotlin
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main() {
    embeddedServer(Netty, port = 8080) {
        routing {
            get("/") {
                call.respondText("Hello, Ktor!")
            }
        }
    }.start(wait = true)
}
```

## Verification

### Run JVM Project

```bash
./gradlew run
```

### Run Android Project

```bash
./gradlew installDebug
adb shell am start -n com.example.myapp/.MainActivity
```

### Run Multiplatform Project

```bash
# JVM
./gradlew jvmRun

# JS
./gradlew jsBrowserDevelopmentRun
```

## IDE Configuration

### IntelliJ IDEA

1. File → Open → Select project directory
2. Wait for Gradle sync
3. Configure Kotlin SDK: File → Project Structure → SDK

### VS Code

1. Install Kotlin Language extension
2. Install Code Runner extension
3. Open project folder
4. Configure settings.json:
   ```json
   {
       "kotlin.languageServer.enabled": true,
       "kotlin.compiler.jvm.target": "17"
   }
   ```

## Common Issues

### Gradle Sync Fails

- Check internet connection
- Update Gradle wrapper: `./gradlew wrapper --gradle-version 8.5`
- Clear Gradle cache: `./gradlew clean --refresh-dependencies`

### Kotlin SDK Not Found

- Install JDK: `sdk install java 17.0.9-tem`
- Set JAVA_HOME environment variable
- Configure in IDE settings

### Android Build Fails

- Update Android SDK in SDK Manager
- Check compileSdk and targetSdk versions
- Verify dependencies compatibility

## Next Steps

- Add dependencies: See `workflows/add-dependency.md`
- Write tests: See `workflows/write-test.md`
- Configure build: See `guide/configuration.md`
