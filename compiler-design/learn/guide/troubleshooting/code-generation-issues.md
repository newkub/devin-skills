# Code Generation Issues

## Problem: Incorrect Code Generation

**Symptoms**:
- Generated code ไม่ทำงานถูกต้อง
- Runtime errors

**Causes**:
1. IR to code mapping ผิด
2. Register allocation ผิด
3. Calling convention ไม่ถูกต้อง

**Solutions**:

```c
// ✅ Good: Verify generated code
void verify_codegen(IRNode* ir, const char* assembly) {
    // Parse generated assembly
    // Verify it matches IR semantics
    // Run tests on generated code
}

// ❌ Bad: No verification
void generate_code(IRNode* ir) {
    // Generate code without verification
}
```

## Problem: Register Spilling

**Symptoms**:
- Too many memory accesses
- Performance degradation

**Causes**:
1. Register allocation algorithm ไม่ดี
2. Live ranges ยาวเกินไป
3. ไม่มี enough registers

**Solutions**:

```c
// ✅ Good: Efficient register allocation
void allocate_registers(IRNode* ir) {
    // Use graph coloring
    // Minimize spills
    // Reuse registers aggressively
}

// ❌ Bad: Naive allocation
void allocate_registers(IRNode* ir) {
    // Allocate new register for every variable
    // Causes excessive spilling
}
```
