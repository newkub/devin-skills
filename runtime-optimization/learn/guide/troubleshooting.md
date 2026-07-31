# Troubleshooting

## การแก้ปัญหาที่พบบ่อยใน Runtime Optimization

### JIT Compilation Issues

### Problem: JIT Compilation Crashes

**Symptoms**:
- Segmentation fault ใน JIT-compiled code
- Random crashes
- Incorrect results

**Causes**:
1. Incorrect code generation
2. Memory protection issues
3. Stack corruption

**Solutions**:

```	ypescript\n// TypeScript/Bun example\n```

### Problem: Slow JIT Compilation

**Symptoms**:
- Long compilation times
- Startup delays
- Poor responsiveness

**Causes**:
1. Too aggressive optimization
2. Large functions
3. Inefficient code generation

**Solutions**:

```	ypescript\n// TypeScript/Bun example\n```

### Memory Management Issues

### Problem: Memory Leaks

**Symptoms**:
- Memory usage  increases over time
- Out of memory errors
- Performance degradation

**Causes**:
1. Objects not reclaimed by GC
2. Incorrect reference counting
3. Memory not freed

**Solutions**:

```	ypescript\n// TypeScript/Bun example\n```

### Problem: GC Pauses Too Long

**Symptoms**:
- Application freezes
- Poor responsiveness
- Janky UI

**Causes**:
1. Too many live objects
2. Inefficient GC algorithm
3. Large heap size

**Solutions**:

```	ypescript\n// TypeScript/Bun example\n```

### Optimization Issues

### Problem: Optimization Bugs

**Symptoms**:
- Incorrect results after optimization
- Crashes in optimized code
- Wrong behavior

**Causes**:
1. Incorrect optimization assumptions
2. Side effects not handled
3. Incorrect dependency analysis

**Solutions**:

```	ypescript\n// TypeScript/Bun example\n```

### Problem: Performance Degradation

**Symptoms**:
- Optimized code slower than unoptimized
- Compilation time too long
- Memory overhead too high

**Causes**:
1. Over-optimization
2. Poor optimization choices
3. Inefficient algorithms

**Solutions**:

```	ypescript\n// TypeScript/Bun example\n```

### Profiling Issues

### Problem: Inaccurate Profiling

**Symptoms**:
- Profiling data doesn't match reality
- Hot paths not identified
- Misleading metrics

**Causes**:
1. Sampling rate too low
2. Instrumentation overhead
3. Incorrect profiling setup

**Solutions**:

```	ypescript\n// TypeScript/Bun example\n```

### Debugging Tips

### 1. Enable Debug Output

```	ypescript\n// TypeScript/Bun example\n```

### 2. Use Debuggers

```bash
# GDB
gdb ./application
(gdb) break jit_compile
(gdb) run
(gdb) print *code

# LLDB
lldb ./application
(lldb) breakpoint set --name jit_compile
(lldb) run
(lldb) frame variable code
```

### 3. Memory Debugging

```bash
# Valgrind
valgrind --leak-check=full ./application

# AddressSanitizer
ASAN_OPTIONS=detect_leaks=1 ./application
```

### Common Pitfalls

### 1. Memory Protection

```	ypescript\n// TypeScript/Bun example\n```

### 2. Stack Overflow

```	ypescript\n// TypeScript/Bun example\n```

### 3. Race Conditions

```	ypescript\n// TypeScript/Bun example\n```

