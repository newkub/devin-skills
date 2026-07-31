# Optimize Performance - Kotlin

## Overview

วิธีการปรับปรุงประสิทธิภาพโค้ด Kotlin ให้ทำงานเร็วและใช้หน่วยความจำน้อยลง

## Performance Profiling

### Profiling Tools

| Tool | Platform | Description |
|------|----------|-------------|
| IntelliJ Profiler | JVM | CPU, memory, thread profiling |
| Android Profiler | Android | CPU, memory, network profiling |
| VisualVM | JVM | Java monitoring and profiling |
| JProfiler | JVM | Commercial Java profiler |
| Async Profiler | JVM | Low-overhead profiling |

### Using IntelliJ Profiler

1. Run → Profile
2. Select profiling type (CPU, Memory)
3. Run your application
4. Analyze the results

### Android Profiler

1. Run app
2. View → Tool Windows → Profiler
3. Select CPU, Memory, or Network
4. Record and analyze

## Memory Optimization

### Object Allocation

#### Avoid Unnecessary Allocations

```kotlin
// Bad: Creates new string each iteration
for (i in 0..1000) {
    val text = "Item $i"  // New string each time
}

// Good: Use StringBuilder
val sb = StringBuilder()
for (i in 0..1000) {
    sb.append("Item $i\n")
}
val text = sb.toString()
```

#### Reuse Objects

```kotlin
// Bad: Creates new formatter each time
fun formatDate(date: Date): String {
    val formatter = SimpleDateFormat("yyyy-MM-dd")
    return formatter.format(date)
}

// Good: Reuse formatter
private val formatter = SimpleDateFormat("yyyy-MM-dd")
fun formatDate(date: Date): String = formatter.format(date)
```

### Collection Optimization

#### Choose Right Collection Type

```kotlin
// ArrayList: Fast random access, slow insert/remove
val list = ArrayList<Int>()

// LinkedList: Fast insert/remove, slow random access
val linkedList = LinkedList<Int>()

// HashSet: Fast lookup, no order
val set = HashSet<Int>()

// HashMap: Fast key lookup
val map = HashMap<String, Int>()
```

#### Pre-size Collections

```kotlin
// Bad: Resizes multiple times
val list = ArrayList<Int>()
for (i in 0..10000) {
    list.add(i)
}

// Good: Pre-size
val list = ArrayList<Int>(10001)
for (i in 0..10000) {
    list.add(i)
}
```

#### Use Sequence for Large Collections

```kotlin
// Bad: Creates intermediate lists
val result = list
    .map { it * 2 }
    .filter { it > 0 }
    .take(100)

// Good: Lazy evaluation
val result = list
    .asSequence()
    .map { it * 2 }
    .filter { it > 0 }
    .take(100)
    .toList()
```

### String Optimization

#### Use String Builder

```kotlin
// Bad: Creates many intermediate strings
var result = ""
for (i in 0..1000) {
    result += "Item $i\n"
}

// Good: Use StringBuilder
val result = StringBuilder()
for (i in 0..1000) {
    result.append("Item $i\n")
}
```

#### String Pool

```kotlin
// Bad: Creates new string each time
fun checkStatus(status: String): Boolean {
    return status == "ACTIVE"
}

// Good: Use string pool
private const val ACTIVE = "ACTIVE"
fun checkStatus(status: String): Boolean {
    return status == ACTIVE
}
```

## CPU Optimization

### Algorithm Optimization

#### Use Efficient Algorithms

```kotlin
// Bad: O(n^2)
fun findDuplicates(list: List<Int>): List<Int> {
    val duplicates = mutableListOf<Int>()
    for (i in list.indices) {
        for (j in i + 1 until list.size) {
            if (list[i] == list[j]) {
                duplicates.add(list[i])
            }
        }
    }
    return duplicates
}

// Good: O(n)
fun findDuplicates(list: List<Int>): List<Int> {
    val seen = HashSet<Int>()
    val duplicates = mutableListOf<Int>()
    for (item in list) {
        if (!seen.add(item)) {
            duplicates.add(item)
        }
    }
    return duplicates
}
```

### Inline Functions

#### Use Inline for Lambda Overhead

```kotlin
// Bad: Lambda allocation overhead
inline fun <T> measureTime(block: () -> T): T {
    val start = System.nanoTime()
    val result = block()
    val end = System.nanoTime()
    println("Time: ${end - start} ns")
    return result
}

// Good: Inline eliminates lambda overhead
inline fun <T> measureTime(block: () -> T): T {
    val start = System.nanoTime()
    val result = block()
    val end = System.nanoTime()
    println("Time: ${end - start} ns")
    return result
}
```

### Avoid Boxing

#### Use Primitive Types

```kotlin
// Bad: Boxing overhead
val list = listOf(1, 2, 3)  // List<Int> boxes integers

// Good: Use primitive arrays
val array = intArrayOf(1, 2, 3)
```

#### Use Primitive Collections

```kotlin
// Use specialized collections for primitives
dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-collections-immutable:0.3.5")
}
```

## Coroutine Optimization

### Use Appropriate Dispatchers

```kotlin
// CPU-bound: Use Default
suspend fun compute(): Int = withContext(Dispatchers.Default) {
    heavyComputation()
}

// I/O-bound: Use IO
suspend fun fetch(): String = withContext(Dispatchers.IO) {
    httpClient.get(url)
}

// UI updates: Use Main
suspend fun updateUI() = withContext(Dispatchers.Main) {
    textView.text = "Updated"
}
```

### Avoid Blocking in Coroutines

```kotlin
// Bad: Blocks thread
suspend fun bad() {
    Thread.sleep(1000)  // Blocks thread
}

// Good: Non-blocking
suspend fun good() {
    delay(1000)  // Suspends without blocking
}
```

### Use Structured Concurrency

```kotlin
// Good: Automatic cancellation
scope.launch {
    val result1 = async { fetch1() }
    val result2 = async { fetch2() }
    process(result1.await(), result2.await())
}
```

### Flow Optimization

```kotlin
// Use buffer for backpressure
flow {
    for (i in 1..1000) {
        emit(i)
    }
}.buffer(100)  // Buffer 100 items

// Use conflate to skip intermediate values
flow {
    for (i in 1..1000) {
        emit(i)
    }
}.conflate()  // Only latest value
```

## Android-Specific Optimization

### View Optimization

#### Use View Binding

```kotlin
// Bad: findViewById every time
fun updateText() {
    val textView = findViewById<TextView>(R.id.text)
    textView.text = "Hello"
}

// Good: Cache view reference
private lateinit var textView: TextView
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    textView = findViewById(R.id.text)
}

fun updateText() {
    textView.text = "Hello"
}
```

#### Use RecyclerView

```kotlin
// Good: RecyclerView recycles views
val adapter = MyAdapter(items)
recyclerView.adapter = adapter
recyclerView.layoutManager = LinearLayoutManager(this)
```

### Memory Leaks

#### Avoid Memory Leaks

```kotlin
// Bad: Static reference to context
object MyClass {
    lateinit var context: Context  // Memory leak!
}

// Good: Use application context
object MyClass {
    lateinit var context: Context
        private set

    fun init(app: Application) {
        context = app.applicationContext
    }
}
```

#### Use WeakReference

```kotlin
class MyHandler {
    private val weakRef = WeakReference<MyActivity>()

    fun setActivity(activity: MyActivity) {
        weakRef.set(activity)
    }

    fun doSomething() {
        weakRef.get()?.let { activity ->
            // Use activity
        }
    }
}
```

### Bitmap Optimization

```kotlin
// Load appropriate size
val options = BitmapFactory.Options().apply {
    inJustDecodeBounds = true
    BitmapFactory.decodeFile(path, options)
    inSampleSize = calculateInSampleSize(options, reqWidth, reqHeight)
    inJustDecodeBounds = false
}
val bitmap = BitmapFactory.decodeFile(path, options)
```

## Build Optimization

### Gradle Optimization

```kotlin
// build.gradle.kts
// Enable build cache
buildCache {
    local { enabled = true }
}

// Enable configuration cache
configurationCache {
    enabled = true
}

// Enable parallel execution
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs += "-Xopt-in=kotlin.RequiresOptIn"
    }
}
```

### R8/ProGuard Optimization

```kotlin
// build.gradle.kts
android {
    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
}
```

## Database Optimization

### Exposed Optimization

```kotlin
// Use batch inserts
transaction {
    (1..1000).chunked(100).forEach { chunk ->
        Users.batchInsert(chunk) { (id) ->
            this[Users.id] = id
            this[Users.name] = "User $id"
        }
    }
}

// Use indexes
object Users : Table() {
    val id = integer("id").autoIncrement()
    val name = varchar("name", 50)
    val email = varchar("email", 100)

    override val primaryKey = PrimaryKey(id)
    init {
        index("idx_email", email, unique = true)
    }
}
```

### Connection Pooling

```kotlin
// Use HikariCP
val dataSource = HikariDataSource(HikariConfig().apply {
    jdbcUrl = "jdbc:h2:mem:test"
    maximumPoolSize = 10
    connectionTimeout = 30000
})
```

## Network Optimization

### HTTP Client Optimization

```kotlin
// Use connection pooling
val client = HttpClient(CIO) {
    engine {
        maxConnectionsCount = 100
        endpoint {
            maxConnectionsPerEndpoint = 10
        }
    }
}

// Enable caching
install(HttpCache)
```

### Caching Strategy

```kotlin
// Use in-memory cache
val cache = ConcurrentHashMap<String, String>()

suspend fun getData(key: String): String {
    return cache.getOrPut(key) {
        fetchFromNetwork(key)
    }
}
```

## Measurement and Benchmarks

### JMH Benchmarks

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm")
    id("me.champeau.jmh") version "0.7.2"
}

dependencies {
    jmh("org.openjdk.jmh:jmh-core:1.36")
    jmh("org.openjdk.jmh:jmh-generator-annprocess:1.36")
}
```

```kotlin
@BenchmarkMode(Mode.AverageTime)
@OutputTimeUnit(TimeUnit.MILLISECONDS)
@State(Scope.Benchmark)
class MyBenchmark {

    @Benchmark
    fun testMethod(): Int {
        return heavyComputation()
    }
}
```

### Kotlin Benchmark

```kotlin
import kotlin.system.measureNanoTime

fun benchmark() {
    val time = measureNanoTime {
        // Code to benchmark
        heavyComputation()
    }
    println("Time: $time ns")
}
```

## Performance Checklist

### Memory

- [ ] Reuse objects when possible
- [ ] Pre-size collections
- [ ] Use sequences for large collections
- [ ] Avoid unnecessary string concatenation
- [ ] Use primitive types instead of boxed types
- [ ] Check for memory leaks

### CPU

- [ ] Use efficient algorithms
- [ ] Inline functions for lambdas
- [ ] Avoid boxing/unboxing
- [ ] Use appropriate data structures
- [ ] Profile hot paths

### Coroutines

- [ ] Use appropriate dispatchers
- [ ] Avoid blocking operations
- [ ] Use structured concurrency
- [ ] Cancel coroutines when done
- [ ] Use Flow operators efficiently

### Android

- [ ] Use View Binding
- [ ] Use RecyclerView
- [ ] Optimize bitmaps
- [ ] Avoid memory leaks
- [ ] Use WorkManager for background tasks

## Common Performance Issues

### Memory Leaks

- Static references to activities
- Non-static inner classes
- Unclosed resources
- Unregistered listeners

### Slow UI

- Main thread blocking
- Heavy layout hierarchies
- Overdraw
- Unnecessary view updates

### Slow Network

- No connection pooling
- Synchronous calls
- No caching
- Large payloads

## Best Practices

- Profile before optimizing
- Focus on hot paths
- Measure improvements
- Consider readability vs performance
- Document performance decisions
- Keep code maintainable

## Next Steps

- Debug issues: See `workflows/debug-code.md`
- Troubleshoot: See `guide/troubleshooting.md`
