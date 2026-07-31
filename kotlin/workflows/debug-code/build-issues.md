# Debugging Build Issues

## Gradle Debug

```bash
# Run Gradle with debug info
./gradlew build --debug --stacktrace

# Run with info
./gradlew build --info

# Run with scan
./gradlew build --scan
```

## Dependency Issues

```bash
# Check dependency tree
./gradlew dependencies

# Check for conflicts
./gradlew dependencyInsight --dependency library-name

# Resolve dependencies
./gradlew dependencies --refresh-dependencies
```
