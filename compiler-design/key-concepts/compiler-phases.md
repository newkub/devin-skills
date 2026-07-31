# Key Concept

## Compiler Design Fundamentals

### Compiler Phases

Compiler แบ่งออกเป็นหลาย phases ที่ทำงานต่อเนื่องกัน:

```
Source Code → Lexer → Parser → AST → Semantic Analysis → IR → Optimization → Code Generation → Machine Code
```

### 1. Lexical Analysis (Scanning)

- **หน้าที่**: แปลง source code เป็น tokens
- **Output**: Stream ของ tokens (keywords, identifiers, literals, operators)
- **Tools**: Flex, Lex, หรือ custom lexer

**ตัวอย่าง**:
```c
int x = 42;
```

**Tokens**:
- `int` (keyword)
- `x` (identifier)
- `=` (operator)
- `42` (literal)
- `;` (punctuation)

### 2. Syntax Analysis (Parsing)

- **หน้าที่**: ตรวจสอบ grammar และสร้าง AST
- **Output**: Abstract Syntax Tree (AST)
- **Tools**: Bison, ANTLR, หรือ recursive descent parser

**ตัวอย่าง AST**:
```
    =
   / \
  x   42
```

### 3. Semantic Analysis

- **หน้าที่**: ตรวจสอบ type checking, scope, และ semantic rules
- **Output**: Annotated AST พร้อม type information
- **ตัวอย่าง**: ตรวจสอบว่า `x` ถูก declare ก่อนใช้, type matching

### 4. Intermediate Representation (IR)

- **หน้าที่**: แปลง AST เป็น IR สำหรับ optimization
- **Types**: 
  - **Three-Address Code**: `t1 = a + b; t2 = t1 * c;`
  - **SSA (Static Single Assignment)**: แต่ละ variable ถูก assign ครั้งเดียว
  - **LLVM IR**: Platform-independent IR

### 5. Optimization

- **หน้าที่**: ปรับปรุง code ให้มีประสิทธิภาพมากขึ้น
- **Types**:
  - **Local Optimization**: Constant folding, dead code elimination
  - **Global Optimization**: Loop optimization, inlining
  - **Machine-Independent**: Platform-agnostic optimizations
  - **Machine-Dependent**: Register allocation, instruction scheduling

### 6. Code Generation

- **หน้าที่**: แปลง IR เป็น machine code
- **Output**: Assembly หรือ binary code
- **Considerations**: Register allocation, instruction selection, calling conventions

### Compiler Types

| Type | Description | Example |
|------|-------------|---------|
| **One-Pass** | Process source code ครั้งเดียว | Early Pascal compilers |
| **Multi-Pass** | Process หลายรอบสำหรับ optimization | Modern compilers |
| **Just-In-Time (JIT)** | Compile ขณะ runtime | Java JVM, V8 |
| **Ahead-Of-Time (AOT)** | Compile ก่อน runtime | C/C++ compilers |
| **Transpiler** | Source-to-source compilation | Babel (JS), TypeScript compiler |

### Key Design Decisions

1. **IR Design**: เลือก IR ที่ balance ระหว่าง expressiveness และ optimization potential
2. **Error Reporting**: กำหนด strategy สำหรับ error messages และ recovery
3. **Optimization Level**: เลือก optimizations ที่เหมาะสมกับ use case
4. **Target Support**: กำหนด platforms ที่จะ support
