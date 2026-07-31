# Debugging Tips

## Print Debugging

```kotlin
// Quick and dirty
println("Debug: variable = $variable")

// Better with context
println("[MyClass] [process] variable = $variable")
```

## Use Assertions

```kotlin
fun process(value: Int) {
    require(value > 0) { "Value must be positive: $value" }
    check(state == State.READY) { "Invalid state: $state" }
    assert(result != null) { "Result should not be null" }
}
```

## Use TODO with Comments

```kotlin
// TODO: Fix this issue
// FIXME: This is a workaround
// HACK: Temporary solution
```
