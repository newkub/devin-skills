# Troubleshooting - Kotlin

## Common Issues

### Compilation Errors

#### Kotlin Compiler Not Found

**Symptom**: `kotlinc: command not found`

**Solutions**:
- Verify Kotlin installation: `kotlin -version`
- Add Kotlin bin directory to PATH
- Reinstall via SDKMAN: `sdk install kotlin`
- For Windows, ensure Chocolatey installation completed

#### JDK Version Incompatible

**Symptom**: `Unsupported class file major version`

**Solutions**:
- Check Java version: `java -version` (requires JDK 8+)
- Update JDK via SDKMAN: `sdk install java 17.0.9-tem`
- Set JAVA_HOME environment variable
- Update Gradle JVM target in build.gradle.kts:
  ```kotlin
  tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
      kotlinOptions.jvmTarget = "17"
  }
  ```

#### Gradle Build Failures

**Symptom**: Build fails with dependency resolution errors

**Solutions**:
- Clean Gradle cache: `./gradlew clean --refresh-dependencies`
- Check internet connection for Maven Central access
- Verify repository configuration in build.gradle.kts
- Use offline mode if needed: `./gradlew build --offline`

### Runtime Errors

#### NullPointerException

**Symptom**: Runtime NPE despite null safety

**Solutions**:
- Check for platform types (Java interop)
- Use `@Nullable` and `@NotNull` annotations on Java code
- Avoid `!!` operator, use safe calls `?.` instead
- Initialize lateinit variables before access
- Use `requireNotNull()` for validation

#### Coroutines Cancellation

**Symptom**: `CancellationException` or jobs not completing

**Solutions**:
- Handle cancellation properly in suspend functions
- Use `try-finally` for cleanup
- Check `isActive` in long-running coroutines
- Use `SupervisorJob` for independent children
- Avoid blocking in coroutines (use `withContext(Dispatchers.IO)`)

#### Memory Leaks

**Symptom**: Gradual memory increase over time

**Solutions**:
- Cancel coroutine jobs when no longer needed
- Use `WeakReference` for long-lived references
- Clear collections in lifecycle callbacks
- Profile with Android Profiler or VisualVM
- Check for static references to activities/views

### IDE Issues

#### IntelliJ IDEA Kotlin Plugin Issues

**Symptom**: Syntax highlighting not working, errors not showing

**Solutions**:
- Update Kotlin plugin: File → Settings → Plugins → Kotlin
- Invalidate caches: File → Invalidate Caches / Restart
- Reimport Gradle project
- Check Kotlin version compatibility with IDE
- Update IntelliJ IDEA to latest version

#### VS Code Kotlin Extension Issues

**Symptom**: No IntelliSense, errors not detected

**Solutions**:
- Install Kotlin Language Server
- Update Code Kotlin extension
- Check workspace settings for Kotlin
- Ensure Java extension is installed
- Reload VS Code window

### Android-Specific Issues

#### R Class Not Found

**Symptom**: `Unresolved reference: R`

**Solutions**:
- Clean and rebuild project: Build → Clean Project → Rebuild Project
- Sync Gradle files
- Check package name in AndroidManifest.xml
- Ensure resource files are in correct directories
- Delete `.idea` folder and reimport project

#### DEX Limit Exceeded

**Symptom**: `Cannot fit requested classes in a single dex file`

**Solutions**:
- Enable multidex in build.gradle.kts:
  ```kotlin
  defaultConfig {
      multiDexEnabled = true
  }
  ```
- Add multidex dependency:
  ```kotlin
  implementation("androidx.multidex:multidex:2.0.1")
  ```
- ProGuard/R8 to reduce code size
- Remove unused dependencies

## Performance Issues

### Slow Compilation

**Symptom**: Build times increasing significantly

**Solutions**:
- Enable Gradle build cache:
  ```kotlin
  buildCache {
      local { enabled = true }
  }
  ```
- Use Gradle daemon (enabled by default)
- Increase Gradle memory: `org.gradle.jvmargs=-Xmx4g`
- Enable Kotlin incremental compilation (default)
- Parallel execution: `./gradlew build --parallel`
- Avoid dynamic dependencies

### Slow Runtime

**Symptom**: Application performs poorly

**Solutions**:
- Profile with Android Profiler or JProfiler
- Optimize coroutine dispatchers
- Use appropriate collections (ArrayDeque vs ArrayList)
- Avoid object allocations in hot paths
- Use inline functions for lambdas
- Enable R8/ProGuard optimization

## Debugging Tips

### Enable Debug Logging

```kotlin
// Gradle
./gradlew build --debug --stacktrace

// Kotlin
println("Debug: $variable")
```

### Use Kotlin Inspector

```kotlin
// In IntelliJ, use "Evaluate Expression"
// Right-click → Evaluate Expression
```

### Coroutine Debugging

```kotlin
// Add coroutine debug agent
-Dkotlinx.coroutines.debug

// Check coroutine state
println(coroutineContext[Job])
```

## Getting Help

### Official Resources

- Kotlin Documentation: https://kotlinlang.org/docs
- Kotlin Slack: https://surveys.jetbrains.com/s3/kotlin-slack-signup
- Stack Overflow: https://stackoverflow.com/questions/tagged/kotlin
- GitHub Issues: https://github.com/JetBrains/kotlin/issues

### Search Tips

- Include Kotlin version in search
- Specify platform (JVM, Android, Multiplatform)
- Include error message in quotes
- Check for similar issues on GitHub

## Version-Specific Issues

### Kotlin 2.0 Migration

**Common Issues**:
- K2 compiler differences
- Plugin compatibility
- Gradle version requirements

**Solutions**:
- Update Gradle to 8.3+
- Update Kotlin Gradle Plugin to 2.0+
- Check plugin compatibility matrix
- Test with K2 compiler: `kotlin.compiler.executionStrategy=in-process`
