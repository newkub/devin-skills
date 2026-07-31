# Null Safety

## Concept Overview

Null Safety เป็นระบบที่ช่วยป้องกัน NullPointerException (NPE) ตั้งแต่ compile-time โดย Kotlin บังคับให้ต้องจัดการกับค่า null อย่างชัดเจน

## Type System

```text
┌─────────────────────────────────────────────────────────────┐
│                    Kotlin Type System                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   String     →  Cannot hold null                            │
│   String?    →  Can hold null                               │
│                                                             │
│   val a: String = "hello"   // OK                          │
│   val a: String = null      // Compile error               │
│                                                             │
│   val b: String? = "hello"  // OK                          │
│   val b: String? = null     // OK                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Safe Call Operator (?.)

```kotlin
// Safe call returns null if receiver is null
val name: String? = null
val length = name?.length  // length is Int? (nullable)

// Chaining safe calls
val city = user?.address?.city?.name

// With let
user?.let { u ->
    processUser(u)
}
```

## Elvis Operator (?:)

```kotlin
// Provide default value when null
val name: String? = null
val length = name?.length ?: 0  // 0 if name is null

// With throw
val name = nullableName ?: throw IllegalArgumentException("Name required")

// Chaining
val city = user?.address?.city?.name ?: "Unknown"
```

## Not-Null Assertion (!!)

```kotlin
// Force unwrap (throws NPE if null)
val name: String? = null
val length = name!!.length  // Throws NPE

// Use sparingly - only when you're certain value is not null
// Better to use safe alternatives
```

## Safe Cast (as?)

```kotlin
// Returns null if cast fails
val str: Any = "hello"
val name = str as? String  // "hello"
val num = str as? Int     // null

// With Elvis
val name = str as? String ?: "not a string"
```

## Let with Safe Call

```kotlin
fun processEmail(email: String?) {
    email?.let { e ->
        println("Processing: $e")
        // e is non-null inside this block
    }
    // email is still nullable here
}

// With let and Elvis
val result = email?.trim()?.lowercase() ?: "invalid"
```

## Null Checks with when

```kotlin
fun describe(obj: Any?): String = when (obj) {
    null -> "null"
    is String -> "String of length ${obj.length}"
    is Int -> "Int: $obj"
    else -> "Something else"
}
```

## Platform Types

```kotlin
// Java methods can return null
// Kotlin represents these as platform types

// From Java code
fun getName(): String = javaMethod()  // Platform type (T!)

// Can be treated as nullable or non-null
fun main() {
    val name: String? = getName()  // Explicit nullable
    val name2: String = getName()   // Explicit non-null
}
```

## Best Practices

```kotlin
// Good: Design for non-null by default
class User(val name: String)  // name cannot be null

// Good: Nullable when needed
class User(val name: String?, val nickname: String?)

// Good: Provide defaults
val displayName = user.nickname ?: user.name ?: "Anonymous"

// Bad: Avoid !! unless absolutely necessary
val length = name!!.length  // Risk of NPE

// Good: Use safe calls throughout
val city = user?.address?.city?.name ?: "Unknown"
```