---
description: Implement intermediate representation (IR) สำหรับ compiler
---

## Goal

Implement IR สำหรับ optimization และ code generation

## Scope

ใช้สำหรับสร้าง IR ใหม่ หรือปรับปรุง IR ที่มีอยู่

## Execute

### 1. เลือก IR Type

เลือก IR type:

- **Three-Address Code (TAC)**: Simple, easy to optimize
- **SSA (Static Single Assignment)**: Enables powerful optimizations
- **LLVM IR**: Industry-standard, portable

### 2. ออกแบบ IR Structure

สร้าง structure สำหรับ IR instructions:

```c
typedef enum {
    IR_CONST,
    IR_ADD,
    IR_SUB,
    IR_MUL,
    IR_DIV,
    IR_LOAD,
    IR_STORE,
    // ... เพิ่ม instruction types อื่นๆ
} IRInstructionType;

typedef struct IRInstruction {
    IRInstructionType type;
    char* result;
    char* op1;
    char* op2;
} IRInstruction;
```

### 3. Implement IR Generator

สร้าง IR generator:

```c
IRInstruction* generate_ir(ASTNode* ast) {
    // 1. Traverse AST
    // 2. Generate IR instructions
    // 3. Return IR
}
```

### 4. Implement Optimizer

สร้าง optimization passes:

```c
void optimize_ir(IRInstruction* ir) {
    // 1. Constant folding
    // 2. Dead code elimination
    // 3. Loop optimizations
    // ... เพิ่ม optimizations อื่นๆ
}
```

### 5. Test IR

ทดสอบ IR generation และ optimization:

```c
void test_ir() {
    ASTNode* ast = parse("1 + 2 * 3");
    IRInstruction* ir = generate_ir(ast);
    optimize_ir(ir);
    // Verify IR
}
```

## Rules

- ใช้ภาษาไทยในการอธิบาย
- ให้ code examples ที่ชัดเจนและใช้งานได้จริง
- อ้างอิง sources ที่เชื่อถือได้

## Expected Outcome

- IR ที่ represent code ได้อย่างถูกต้อง
- Optimization passes ที่ทำงานได้
- Test coverage ที่เพียงพอ
