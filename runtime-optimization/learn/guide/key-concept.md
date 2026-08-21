# Key Concept

## Runtime Optimization Fundamentals

### JIT Compilation

### 1. Just-In-Time Compilation

JIT (Just-In-Time) compilation คือการ compile code ขณะ runtime แทนที่จะ compile ก่อน runtime

**Advantages**:
- Adaptive optimization ตาม runtime behavior
- Platform portability (compile สำหรับ target platform)
- Hot code optimization (optimize ส่วนที่ถูกใช้บ่อย)

**Disadvantages**:
- Startup time ช้ากว่า AOT
- Memory overhead สำหรับ JIT compiler
- Complexity ใน implementation

**JIT Types**:

| Type | Description | Example |
|------|-------------|---------|
| **Method JIT** | Compile methods on first execution | JVM |
| **Tracing JIT** | Record execution traces, optimize hot paths | V8, LuaJIT |
| **Tiered JIT** | Multiple optimization levels | HotSpot JVM |
| **AOT + JIT** | Pre-compile with JIT fallback | .NET Core |

### Memory Management

### 2. Garbage Collection

GC คือ automatic memory management ที่ reclaim memory จาก objects ที่ไม่ถูกใช้

**GC Algorithms**:

| Algorithm | Description | Pros | Cons |
|-----------|-------------|------|------|
| **Mark-Sweep** | Mark reachable objects, sweep unreachable | Simple | Fragmentation |
| **Copying** | Copy live objects to new space | No fragmentation | Double memory |
| **Generational** | Separate young/old objects | Efficient for short-lived | Complex |
| **Reference Counting** | Count references per object | Predictable | Cycles not handled |

**GC Strategies**:

```	ypescript\n// TypeScript/Bun example\n```

### 3. Memory Pooling

Memory pooling คือการ reuse memory blocks เพื่อลบ allocation overhead

**Benefits**:
- ลด allocation/deallocation overhead
- ลด memory fragmentation
- Improve cache locality

**Implementation**:

```	ypescript\n// TypeScript/Bun example\n```

### Hot Path Optimization

### 4. Inline Caching

Inline caching คือการ cache results ของ polymorphic calls ที่ site เดียวกัน

**Example**:

```javascript
// First call: cache miss
obj.method()  // Cache: obj.method = FunctionA

// Subsequent calls: cache hit
obj.method()  // Use cached FunctionA directly
```

### 5. Hidden Class Transitions

Hidden classes คือการ track object shapes สำหรับ optimization

**Example**:

```javascript
// Object with property "x"
let obj1 = { x: 1 };  // HiddenClass A: { x }

// Object with properties "x" and "y"
let obj2 = { x: 1, y: 2 };  // HiddenClass B: { x, y }

// Transition from A to B
obj1.y = 2;  // obj1 now has HiddenClass B
```

### Profile-Guided Optimization (PGO)

### 6. PGO Overview

PGO คือการใช้ runtime profiling data เพื่อ guide optimizations

**Process**:
1. Compile with instrumentation
2. Run representative workloads
3. Collect profiling data
4. Re-compile with profile data

**Benefits**:
- Better hot path optimization
- Improved branch prediction
- Optimized register allocation

**Example**:

```bash
# Step 1: Compile with instrumentation
gcc -fprofile-generate source.c -o instrumented

# Step 2: Run workloads
./instrumented benchmark

# Step 3: Re-compile with profile data
gcc -fprofile-use source.c -o optimized
```

### Optimization Techniques

### 7. Loop Optimization

**Loop Unrolling**:
```	ypescript\n// TypeScript/Bun example\n```

**Loop Invariant Code Motion**:
```	ypescript\n// TypeScript/Bun example\n```

### 8. Branch Prediction

Branch prediction คือการ predict branch outcomes เพื่อ reduce pipeline stalls

**Techniques**:
- Static prediction (always predict not taken)
- Dynamic prediction (based on history)
- Pattern-based prediction (detect patterns)

**Example**:

```	ypescript\n// TypeScript/Bun example\n```

### 9. Vectorization

Vectorization คือการใช้ SIMD instructions สำหรับ parallel operations

**Example**:

```	ypescript\n// TypeScript/Bun example\n```
