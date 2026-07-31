# Computer Architecture - Installation

วิธีการติดตั้งและเตรียมความพร้อมสำหรับการเรียนรู้ Computer Architecture

## Prerequisites

ไม่ต้องการการติดตั้ง software ใดๆ เนื่องจาก Computer Architecture เป็น concept ทางทฤษฎี แต่สามารถใช้ tools เพื่อการเรียนรู้และทดลองได้

## Optional Tools

### 1. Simulators

```bash
# RISC-V Spike (ISA Simulator)
bun add -D riscv-isa-sim

# Gem5 (Architecture Simulator)
# Download from https://www.gem5.org/
```

### 2. Assemblers

```bash
# RISC-V GNU Toolchain
# Download from https://github.com/riscv/riscv-gnu-toolchain

# NASM (x86 Assembly)
# Windows: winget install NASM
# macOS: brew install nasm
# Linux: sudo apt install nasm
```

### 3. Emulators

```bash
# QEMU (System Emulator)
# Windows: winget install qemu.qemu
# macOS: brew install qemu
# Linux: sudo apt install qemu-system-x86
```

## Learning Environment Setup

### 1. Online Resources

เข้าถึง resources ออนไลน์โดยตรง:
- [Stanford CS149](https://web.stanford.edu/class/cs149/)
- [MIT 6.004](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/)
- [RISC-V Documentation](https://riscv.org/technical/documentation/)

### 2. Textbook References

ซื้อหรือเข้าถึง textbooks:
- Computer Organization and Design (Patterson & Hennessy)
- Computer Architecture: A Quantitative Approach (Hennessy & Patterson)

## Verification

ตรวจสอบว่ามีความพร้อมในการเรียนรู้:

```bash
# Check if you have basic programming knowledge
# - Understanding of binary/hexadecimal
# - Basic programming concepts
# - Mathematical foundations (logic, arithmetic)
```

## Next Steps

หลังจากติดตั้งเสร็จ:
1. เริ่มจาก quick-start.md
2. ศึกษา key-concept.md
3. ทำความเข้าใจ how-it-works.md
4. ศึกษา features.md
