# Semantic Analysis Issues

## Problem: Type Errors

**Symptoms**:
- Type mismatches ไม่ถูก detect
- False positive type errors

**Causes**:
1. Type inference ผิด
2. ไม่ handle implicit conversions
3. Type environment ไม่ถูกต้อง

**Solutions**:

```c
// ✅ Good: Comprehensive type checking
Type* check_binary_op(ASTNode* node) {
    Type* left = check_type(node->left);
    Type* right = check_type(node->right);
    
    if (!types_compatible(left, right)) {
        report_error(node->location, 
            "Type mismatch: %s vs %s", 
            type_name(left), type_name(right));
    }
    
    return promote_type(left, right);
}

// ❌ Bad: No type checking
Type* check_binary_op(ASTNode* node) {
    return get_int_type();  // Always returns int!
}
```

## Problem: Undefined Variables

**Symptoms**:
- Variables ที่ไม่ถูก declare ถูกใช้
- Scope violations

**Causes**:
1. Symbol table ไม่ถูกต้อง
2. Scope management ผิด
3. ไม่ check variable declarations

**Solutions**:

```c
// ✅ Good: Check variable existence
Symbol* lookup_var(SymbolTable* table, const char* name) {
    Symbol* sym = find_symbol(table, name);
    if (!sym) {
        report_error("Undefined variable: %s", name);
    }
    return sym;
}

// ❌ Bad: No checking
Symbol* lookup_var(SymbolTable* table, const char* name) {
    return find_symbol(table, name);  // Returns NULL silently
}
```
