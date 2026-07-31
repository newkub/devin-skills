# Optimization Issues

## Problem: Optimization Bugs

**Symptoms**:
- Optimized code ผิด
- Incorrect results after optimization

**Causes**:
1. Optimization pass ไม่ preserve semantics
2. Incorrect assumptions
3. Side effects ไม่ถูก handle

**Solutions**:

```c
// ✅ Good: Verify optimization correctness
bool verify_optimization(IRNode* before, IRNode* after) {
    // Execute both versions
    // Compare results
    // Ensure semantics preserved
}

// ❌ Bad: No verification
void apply_optimization(IRNode* ir) {
    // Apply optimization without verification
}
```

## Problem: Performance Degradation

**Symptoms**:
- Optimized code ช้ากว่า unoptimized
- Compilation time นานเกินไป

**Causes**:
1. Optimization passes ไม่ effective
2. Over-optimization
3. Poor algorithm choices

**Solutions**:

```c
// ✅ Good: Profile before optimizing
void optimize_with_profiling(IRNode* ir) {
    // Profile hot paths
    // Apply targeted optimizations
    // Measure impact
}

// ❌ Bad: Blind optimization
void optimize_all(IRNode* ir) {
    // Apply all optimizations indiscriminately
}
```
