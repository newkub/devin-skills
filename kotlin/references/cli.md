# Kotlin CLI Reference

## kotlinc - Kotlin Compiler

The Kotlin compiler (`kotlinc`) compiles Kotlin source files to JVM bytecode.

### Basic Usage

| Command | Description |
|---------|-------------|
| `kotlinc <file> -include-runtime -d <output.jar>` | Compile to JAR with runtime |
| `kotlinc <file> -d <output.jar>` | Compile without runtime (requires runtime on classpath) |
| `kotlinc -script <script.kts>` | Run Kotlin script |
| `kotlinc -version` | Show version |

### Compile Options

| Option | Description |
|--------|-------------|
| `-d <dir|jar>` | Output directory or JAR file |
| `-include-runtime` | Include Kotlin runtime in JAR |
| `-classpath <cp>` | Classpath for compilation |
| `-cp <cp>` | Classpath alias |
| `-source roots <dirs>` | Source directories |
| `-Xmetadata` | Include Kotlin metadata |

### Kotlin Options

| Option | Description |
|--------|-------------|
| `-Xno-call-assertions` | Disable call assertions |
| `-Xno-param-assertions` | Disable parameter assertions |
| `-Xno-exception-assertions` | Disable exception assertions |
| `-Xjsr305=strict` | Enable strict JSR-305 null checking |

### Example Commands

```bash
# Compile single file
kotlinc MyFile.kt -include-runtime -d MyApp.jar

# Compile multiple files
kotlinc file1.kt file2.kt -d output.jar

# Compile with custom classpath
kotlinc -cp "/path/to/libs/*" Main.kt -d app.jar

# Run script
kotlinc -script script.kts
```

## kotlin - Kotlin Launcher

The `kotlin` command runs Kotlin compiled JAR files or scripts.

### Basic Usage

| Command | Description |
|---------|-------------|
| `kotlin <jar>` | Run JAR file |
| `kotlin <script.kts>` | Run script file |
| `kotlin -version` | Show version |

### Options

| Option | Description |
|--------|-------------|
| `-classpath <cp>` | Classpath |
| `-D<name>=<value>` | System property |
| `-X<opt>` | Extended option |

## kotlinc-java - Kotlin to Java Converter

```bash
# Convert Kotlin to Java
kotlinc-java MyFile.kt -d output/
```

## Gradle Tasks

### Kotlin JVM

```bash
# Compile Kotlin
./gradlew compileKotlin

# Compile test Kotlin
./gradlew compileTestKotlin

# Run tests
./gradlew test

# Build JAR
./gradlew jar

# Build application
./gradlew build
```

### Kotlin Multiplatform

```bash
# Compile all targets
./gradlew compileKotlinJvm
./gradlew compileKotlinJs
./gradlew compileKotlinMetadata

# Native targets
./gradlew compileKotlinLinuxX64
./gradlew compileKotlinMingwX64
```

## Common Gradle Properties

```properties
# gradle.properties
kotlin.code.style=official
kotlin.jvm.target=17
kotlin.incremental=true
```

## Interactive REPL

```bash
# Start Kotlin REPL
kotlin

# Or use Kotlin script
kotlinc -script

# REPL commands
:help
:quit
:load <file>
```

## Compiler Error Codes

| Code | Meaning |
|------|---------|
| 1 | Compilation error |
| 2 | Runtime error |
| 3 | Execution interrupted |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `JAVA_HOME` | JDK location |
| `KOTLIN_HOME` | Kotlin installation |
| `KOTLIN_CACHE_DIR` | Cache directory |