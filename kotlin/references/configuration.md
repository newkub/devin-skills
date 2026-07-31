# Kotlin Configuration Reference

## build.gradle.kts

### Essential Plugins

| Plugin | Description |
|--------|-------------|
| `kotlin("jvm")` | Kotlin JVM compilation |
| `kotlin("js")` | Kotlin/JS compilation |
| `kotlin("multiplatform")` | Kotlin Multiplatform |
| `kotlin("android")` | Kotlin Android |

### Dependencies

| Configuration | Description |
|--------------|-------------|
| `implementation` | Runtime dependencies |
| `api` | API dependencies exposed to consumers |
| `compileOnly` | Compile-time only dependencies |
| `runtimeOnly` | Runtime only dependencies |
| `testImplementation` | Test dependencies |

### Kotlin Options

| Option | Description |
|--------|-------------|
| `jvmTarget` | JVM target version (e.g., "17") |
| `sourceCompatibility` | Java source compatibility |
| `targetCompatibility` | Java target compatibility |
| `freeCompilerArgs` | Additional compiler arguments |

## Compiler Options

### Common Compiler Args

| Argument | Description |
|----------|-------------|
| `-Xjsr305=strict` | Enable strict JSR-305 nullability |
| `-opt-in=kotlin.RequiresOptIn` | Enable opt-in annotations |
| `-progressive` | Enable progressive mode |

## Related Resources

| Name | URL | Description |
|------|-----|-------------|
| Gradle Kotlin DSL | https://docs.gradle.org/current/userguide/kotlin_dsl.html | Gradle Kotlin DSL documentation |
| Kotlin Gradle Plugin | https://kotlinlang.org/docs/gradle-configure-project.html | Kotlin Gradle plugin guide |
