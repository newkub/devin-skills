# Logging

## Using Kotlin Logging

```kotlin
// build.gradle.kts
dependencies {
    implementation("io.github.microutils:kotlin-logging-jvm:3.0.5")
    implementation("ch.qos.logback:logback-classic:1.4.11")
}
```

```kotlin
import io.github.oshai.kotlinlogging.KotlinLogging

private val logger = KotlinLogging.logger {}

class Service {
    fun process() {
        logger.debug { "Processing started" }
        logger.info { "Processing item: $item" }
        logger.warn { "Potential issue detected" }
        logger.error { "Error occurred", exception }
    }
}
```

## Log Levels

| Level | Description | Use Case |
|-------|-------------|----------|
| TRACE | Very detailed | Method entry/exit |
| DEBUG | Debugging | Variable values |
| INFO | Informational | General flow |
| WARN | Warnings | Potential issues |
| ERROR | Errors | Exceptions and failures |
