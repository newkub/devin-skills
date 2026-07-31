# Extension Functions

## Concept Overview

Extension Functions ช่วยให้สามารถเพิ่ม function ให้ class ที่มีอยู่แล้วโดยไม่ต้อง modify class นั้น หรือใช้ inheritance - perfect สำหรับการเพิ่ม utility functions

## Declaration

```kotlin
// fun ClassName.extensionName(params) { this refers to receiver }

fun String.addExclamation(): String {
    return this + "!"
}

"Hello".addExclamation()  // "Hello!"
```

## Basic Examples

```kotlin
// String extensions
fun String.repeat(times: Int): String {
    return (1..times).joinToString("") { this }
}

"Ha".repeat(3)  // "HaHaHa"

// Int extensions
fun Int.isEven(): Boolean = this % 2 == 0

println(4.isEven())  // true

// List extensions
fun <T> List<T>.secondOrNull(): T? {
    return if (size >= 2) this[1] else null
}

listOf(1, 2, 3).secondOrNull()  // 2
```

## Extension Properties

```kotlin
// Read-only extension property
val String.lastChar: Char
    get() = this[length - 1]

"Hello".lastChar  // 'o'

// Mutable extension property
var StringBuilder.lastChar: Char
    get() = get(length - 1)
    set(value) {
        setCharAt(length - 1, value)
    }

val sb = StringBuilder("Hello")
sb.lastChar = '!'
println(sb)  // "Hell!"
```

## Nullable Receivers

```kotlin
// Extension on nullable type
fun String?.orEmpty(): String {
    return this ?: ""
}

val str: String? = null
str.orEmpty()  // ""

// More useful example
fun String?.isNullOrBlank(): Boolean {
    return this == null || this.isBlank()
}
```

## Generics with Extensions

```kotlin
// Generic extension function
fun <T> List<T>.firstOrError(): T {
    return firstOrNull() ?: throw NoSuchElementException("List is empty")
}

listOf(1, 2, 3).firstOrError()  // 1

// Type constraint
fun <T : Comparable<T>> List<T>.sortedAsc(): List<T> {
    return this.sorted()
}

// Generic with extension
fun <K, V> Map<K, V>.getOrThrow(key: K): V {
    return get(key) ?: throw NoSuchElementException("Key $key not found")
}
```

## Scope and Visibility

```kotlin
// Top-level extension (visible throughout package)
fun String.shout() = "${this.uppercase()}!"

// Member extension
class MyClass {
    fun String.extend() = "${this} extended"
    
    fun test() {
        "hello".extend()  // Can call on String inside MyClass
    }
}

// Extensions are resolved statically
open class Base
class Derived : Base()

fun Base.foo() = "base"
fun Derived.foo() = "derived"

fun main() {
    val derived: Base = Derived()
    derived.foo()  // "base" - resolved by static type, not runtime type
}
```

## Common Use Cases

### String Utilities

```kotlin
fun String.isValidEmail(): Boolean {
    return this.matches(Regex("^[\\w.-]+@[\\w.-]+\\.\\w+$"))
}

fun String.capitalizeWords(): String {
    return split(" ").joinToString(" ") { 
        it.lowercase().replaceFirstChar { c -> c.uppercase() }
    }
}
```

### Collection Operations

```kotlin
fun <T> Collection<T>.joinToString(
    separator: String = ", ",
    transform: (T) -> String = { it.toString() }
): String {
    return this.joinToString(separator, transform)
}

listOf(1, 2, 3).joinToString { "Item: $it" }
// "Item: 1, Item: 2, Item: 3"
```

### Type Conversions

```kotlin
fun String.toIntOrDefault(default: Int = 0): Int {
    return this.toIntOrNull() ?: default
}

fun Any?.toJson(): String {
    return this?.toString() ?: "null"
}
```

## DSL Builder Pattern

```kotlin
class HtmlBuilder {
    fun build(): String = elements.joinToString("\n")
}

fun html(block: HtmlBuilder.() -> Unit): String {
    val builder = HtmlBuilder()
    builder.block()
    return builder.build()
}

fun main() {
    val html = html {
        // this is HtmlBuilder, can call its extension functions
    }
}
```

## Companion Object Extensions

```kotlin
class MyClass private constructor(val value: Int) {
    companion object
}

fun MyClass.Companion.create(value: Int): MyClass {
    return MyClass(value)
}

// Called as
MyClass.create(42)
```

## Override Extension?

```kotlin
open class Base
class Derived : Base()

fun Base.foo() = "base"
fun Derived.foo() = "derived"

val d: Derived = Derived()
d.foo()  // "derived" - member wins

val b: Base = Derived()
b.foo()  // "base" - extension is resolved statically
```

## Best Practices

```kotlin
// Good: Name clearly
fun String.addQuotes() = "\"${this}\""

// Bad: Unclear name
fun String.x() = "\"${this}\""  // What does this do?

// Good: Use for utilities
fun String.trimAndNormalize() = this.trim().normalize()

// Bad: Don't overuse
// Extensions are syntactic sugar, don't abuse

// Good: Nullable receiver when needed
fun String?.orEmpty() = this ?: ""

// Good: Generic for flexibility
fun <T : Number> T.toDouble() = this.toDouble()
```