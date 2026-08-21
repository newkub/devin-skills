# Quick Start

## เริ่มต้น Runtime Optimization อย่างรวดเร็ว

### Step 1: สร้าง Project Structure

```bash
mkdir runtime-opt-demo
cd runtime-opt-demo
mkdir src include benchmark build
```

### Step 2: สร้าง Simple Benchmark

**include/benchmark.h**:
```	ypescript\n// TypeScript/Bun example\n```

**src/benchmark.c**:
```	ypescript\n// TypeScript/Bun example\n```

### Step 3: สร้าง Optimization Examples

**src/examples.c**:
```	ypescript\n// TypeScript/Bun example\n```

### Step 4: สร้าง Main Program

**src/main.c**:
```	ypescript\n// TypeScript/Bun example\n```

### Step 5: Build และ Run

```bash
# Build
gcc -o runtime-opt-demo src/main.c src/benchmark.c src/examples.c -Iinclude -O2

# Run
./runtime-opt-demo
```

**Expected Output**:
```
Benchmark Results:
==================
Naive Sum           : 5.234567 ns
Optimized Sum      : 3.123456 ns
Pooled Sum          : 2.890123 ns
```

### Step 6: เพิ่ม JIT Compilation

**src/jit_example.c**:
```	ypescript\n// TypeScript/Bun example\n```

### Step 7: เพิ่ม Memory Pooling

**src/pool_example.c**:
```	ypescript\n// TypeScript/Bun example\n```

### Next Steps

1. อ่าน `key-concept.md` สำหรับ concepts เพิ่มเติม
2. ดู `how-it-works.md` สำหรับ pipeline อย่างละเอียด
3. ศึกษา `architecture.md` สำหรับ design patterns
4. ทำตาม `best-practices.md` สำหรับ production-ready code
5. ดู `performance.md` สำหรับ advanced optimization techniques
