# Computer Architecture - Configuration

การตั้งค่าและการปรับแต่งสำหรับการศึกษา Computer Architecture

## Learning Path Configuration

### 1. Beginner Path

```text
Start → key-concept.md → how-it-works.md → features.md
```

เหมาะสำหรับผู้เริ่มต้น:
- ไม่มีพื้นฐานเกี่ยวกับ hardware
- ต้องการเข้าใจพื้นฐานก่อน
- เน้น concepts พื้นฐาน

### 2. Intermediate Path

```text
Start → key-concept.md → how-it-works.md → features.md → best-practices.md
```

เหมาะสำหรับผู้ที่มีพื้นฐาน:
- เข้าใจ programming พื้นฐาน
- ต้องการ optimize performance
- สนใจ low-level optimization

### 3. Advanced Path

```text
Start → All files → references/website.md → External resources
```

เหมาะสำหรับผู้ที่มีประสบการณ์:
- เข้าใจ architecture พื้นฐานแล้ว
- ต้องการศึกษาลึกซึ้ง
- สนใจ research หรือ advanced topics

## Focus Areas Configuration

### 1. CPU Focus

เน้นศึกษา:
- CPU structure
- Instruction cycle
- Pipelining
- Parallelism

### 2. Memory Focus

เน้นศึกษา:
- Memory hierarchy
- Cache organization
- Virtual memory
- Memory optimization

### 3. System Focus

เน้นศึกษา:
- Bus architecture
- I/O systems
- Parallel processing
- System design

## Tool Configuration

### 1. Simulator Setup

หากใช้ simulators:
```bash
# Configure RISC-V Spike
spike --isa=rv64gc your_program

# Configure Gem5
./build/X86/gem5.opt configs/example/se.py your_program
```

### 2. Assembly Environment

หากใช้ assembly:
```bash
# RISC-V Assembly
riscv64-unknown-elf-as -o your_program.o your_program.s
riscv64-unknown-elf-ld -o your_program your_program.o

# x86 Assembly
nasm -f elf64 your_program.asm
ld -o your_program your_program.o
```

## สรุป

Configuration ขึ้นอยู่กับ:
- ระดับความรู้ปัจจุบัน
- เป้าหมายการเรียนรู้
- focus area ที่สนใจ
- tools ที่มีอยู่
