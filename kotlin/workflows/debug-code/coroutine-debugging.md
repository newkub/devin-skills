# Coroutine Debugging

## Enable Coroutine Debugging

```kotlin
// Add JVM argument
-Dkotlinx.coroutines.debug

// Or in build.gradle.kts
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions.freeCompilerArgs += "-Xopt-in=kotlinx.coroutines.ExperimentalCoroutinesApi"
}
```

## Debug Coroutines in IntelliJ

1. Enable coroutine debugging in settings
2. Set breakpoints in suspend functions
3. View coroutine state in Debug tool window
4. Check coroutine hierarchy

## Coroutine Inspector

```kotlin
import kotlinx.coroutines.debug.DebugProbes

// Dump coroutine state
DebugProbes.dumpCoroutines()

// Install coroutine probe
DebugProbes.install()
```
