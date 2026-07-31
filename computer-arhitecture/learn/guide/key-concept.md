# Computer Architecture - Key Concepts

แนวคิดหลักและคำศัพท์สำคัญสำหรับ Computer Architecture

## 1. CPU Fundamentals

### CPU Structure

```text
┌─────────────────────────────────────────────────┐
│                    CPU                          │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌─────────────┐     ┌─────────────┐           │
│  │   Control   │     │     ALU     │           │
│  │    Unit     │     │ (Arithmetic │           │
│  │             │     │  Logic Unit)│           │
│  └──────┬──────┘     └──────┬──────┘           │
│         │                    │                  │
│         └────────┬───────────┘                  │
│                  ▼                              │
│         ┌─────────────┐                        │
│         │   Registers │                        │
│         │  ┌─┐┌─┐┌─┐┌─┐│                      │
│         │  │ ││ ││ ││ ││  General Purpose     │
│         │  └─┘└─┘└─┘└─┘│                      │
│         │  ┌───────────┐│                      │
│         │  │    PC     ││  Program Counter     │
│         │  │    IR     ││  Instruction Reg    │
│         │  │   MAR     ││  Mem Address Reg    │
│         │  │   MDR     ││  Mem Data Reg       │
│         │  └───────────┘│                      │
│         └──────────────┘                       │
│                  │                              │
│                  ▼                              │
│         ┌─────────────┐                        │
│         │    Cache    │                        │
│         │  L1 │  L2   │                        │
│         └────┴────────┘                        │
│                  │                              │
│                  ▼                              │
│         ┌─────────────┐                        │
│         │  System Bus │                        │
│         └─────────────┘                        │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Instruction Cycle (Fetch-Decode-Execute)

```text
┌─────────────────────────────────────────────────┐
│           Instruction Cycle                      │
├─────────────────────────────────────────────────┤
│                                                  │
│   Fetch ──▶ Decode ──▶ Execute ──▶ Store        │
│      │          │          │          │         │
│      ▼          ▼          ▼          ▼         │
│   PC→Memory  Extract    Compute    Write        │
│   → IR     OpCode      Result      Back         │
│                                                  │
└─────────────────────────────────────────────────┘
```

## 2. Memory Hierarchy

### Hierarchy Levels

```text
┌─────────────────────────────────────────────────┐
│              Memory Hierarchy                    │
├─────────────────────────────────────────────────┤
│                                                  │
│  Level 0: CPU Registers                          │
│  ├── Size: ~1KB (32-64 registers)                │
│  ├── Speed: 1 cycle                              │
│  └── Cost: Highest                              │
│                                                  │
│  Level 1: L1 Cache                              │
│  ├── Size: ~32-64KB per core                    │
│  ├── Speed: 1-2 cycles                           │
│  └── Location: On-chip                          │
│                                                  │
│  Level 2: L2 Cache                              │
│  ├── Size: ~256KB-2MB per core                  │
│  ├── Speed: ~10 cycles                           │
│  └── Location: On-chip or near                  │
│                                                  │
│  Level 3: L3 Cache (Shared)                     │
│  ├── Size: ~8-64MB                              │
│  ├── Speed: ~40 cycles                           │
│  └── Location: On-chip shared                   │
│                                                  │
│  Main Memory (RAM)                               │
│  ├── Size: 8-128GB                              │
│  ├── Speed: ~100-300 cycles                      │
│  └── Cost: ~$5-10/GB                            │
│                                                  │
│  Secondary Storage (SSD/HDD)                    │
│  ├── Size: TB scale                             │
│  ├── Speed: ms scale                            │
│  └── Cost: ~$0.03-0.10/GB                       │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Cache Organization

```text
┌─────────────────────────────────────────────────┐
│              Cache Structure                     │
├─────────────────────────────────────────────────┤
│                                                  │
│   Set: [Tag] [Valid] [Data Block 0] [Data 1]... │
│                                                  │
│   Direct-Mapped:                                 │
│   ┌──────┬───────┬────────────────┐             │
│   │ Tag  │ Index │    Block       │             │
│   └──────┴───────┴────────────────┘             │
│   Each index → one cache line                   │
│                                                  │
│   4-Way Set Associative:                        │
│   ┌──────┬───────┬────────────────┐             │
│   │ Tag  │ Index │    4 Blocks    │             │
│   └──────┴───────┴────────────────┘             │
│   Each index → 4 possible locations             │
│                                                  │
└─────────────────────────────────────────────────┘
```

## 3. Instruction Set Architecture

### RISC vs CISC

| Feature | RISC | CISC |
|---------|------|------|
| Instructions | Simple, fixed size | Complex, variable |
| Registers | Many (32+) | Few (8-16) |
| Pipeline | Easy | Complex |
| Example | ARM, RISC-V | x86 |
| Code Density | Lower | Higher |

### Common Instruction Types

```text
┌─────────────────────────────────────────────────┐
│            Instruction Types                     │
├─────────────────────────────────────────────────┤
│                                                  │
│  Arithmetic:                                     │
│  ├── ADD Rd, Rs, Rt     // Rd = Rs + Rt         │
│  ├── SUB Rd, Rs, Rt     // Rd = Rs - Rt         │
│  ├── MUL Rd, Rs, Rt     // Rd = Rs * Rt         │
│  └── DIV Rd, Rs, Rt     // Rd = Rs / Rt         │
│                                                  │
│  Logical:                                        │
│  ├── AND Rd, Rs, Rt     // Rd = Rs & Rt         │
│  ├── OR  Rd, Rs, Rt     // Rd = Rs | Rt         │
│  ├── XOR Rd, Rs, Rt     // Rd = Rs ^ Rt         │
│  └── NOT Rd, Rs         // Rd = ~Rs             │
│                                                  │
│  Memory:                                        │
│  ├── LOAD Rd, [Rs]      // Rd = *Rs            │
│  └── STORE [Rd], Rs     // *Rd = Rs            │
│                                                  │
│  Control:                                        │
│  ├── JMP label           // PC = label          │
│  ├── BEQ Rs, Rt, label  // if Rs==Rt, JMP     │
│  ├── CALL label         // Push PC, JMP         │
│  └── RET                // Pop PC               │
│                                                  │
└─────────────────────────────────────────────────┘
```

## 4. Pipelining

### Basic Pipeline

```text
┌─────────────────────────────────────────────────┐
│           5-Stage Pipeline                       │
├─────────────────────────────────────────────────┤
│                                                  │
│  Cycle │ Instr1 │ Instr2 │ Instr3 │ Instr4     │
│  ──────┼────────┼────────┼────────┼────────     │
│    1   │  IF    │        │        │             │
│    2   │  ID    │  IF    │        │             │
│    3   │  EX    │  ID    │  IF    │             │
│    4   │  MEM   │  EX    │  ID    │  IF         │
│    5   │  WB    │  MEM   │  EX    │  ID         │
│    6   │        │  WB    │  MEM   │  EX         │
│    7   │        │        │  WB    │  MEM       │
│    8   │        │        │        │  WB         │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Pipeline Hazards

```text
1. Structural Hazard (Hardware conflict)
   └── Solution: Separate pipelines for memory/ALU

2. Data Hazard (Dependency)
   ├── RAW (Read After Write) → Forwarding
   ├── WAR (Write After Read) → Stalls
   └── WAW (Write After Write) → Stalls

3. Control Hazard (Branches)
   ├── Branch prediction
   ├── Delay slots
   └── Flush on misprediction
```

## 5. Parallelism

### Instruction-Level Parallelism (ILP)

```text
┌─────────────────────────────────────────────────┐
│           Superscalar Execution                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  1. Fetch multiple instructions                 │
│  2. Decode multiple instructions                 │
│  3. Dispatch to execution units                 │
│  4. Execute in parallel                         │
│  5. Commit out-of-order with in-order result    │
│                                                  │
│  ┌─────────────────────────────────────────┐    │
│  │           Reorder Buffer                │    │
│  │  [Instr1] [Instr2] [Instr3] [Instr4]   │    │
│  └─────────────────────────────────────────┘    │
│                    │                            │
│                    ▼                            │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐               │
│  │ ALU │ │ ALU │ │ FPU │ │ LOAD│  Execution    │
│  │  1 │ │  2 │ │     │ │     │  Units         │
│  └─────┘ └─────┘ └─────┘ └─────┘               │
│                                                  │
└─────────────────────────────────────────────────┘
```

### SIMD (Single Instruction Multiple Data)

```text
// Traditional (SISD)
a = b + c  // One operation at a time

// SIMD (128-bit registers)
┌───────────────────┬───────────────────┐
│       32-bit      │       32-bit      │
│    ┌───┐┌───┐┌───┐┌───┐              │
│    │ 1 ││ 2 ││ 3 ││ 4 │  = 4 ops     │
│    └───┘└───┘└───┘└───┘  in 1 cycle  │
└───────────────────┴───────────────────┘

// AVX2 (256-bit) = 8 float ops per cycle
// AVX-512 (512-bit) = 16 float ops per cycle
```

### Multi-core Architecture

```text
┌─────────────────────────────────────────────────┐
│           Multi-core Processor                   │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌─────────────────────────────────────────┐    │
│  │            Shared L3 Cache              │    │
│  └──────────┬─────────────────┬────────────┘    │
│             │                 │                  │
│      ┌──────┴──────┐   ┌─────┴──────┐          │
│      │   Core 0    │   │   Core 1    │          │
│      │ ┌─────────┐ │   │ ┌─────────┐ │          │
│      │ │  L1 D   │ │   │ │  L1 D   │ │          │
│      │ ├─────────┤ │   │ ├─────────┤ │          │
│      │ │  L1 I   │ │   │ │  L1 I   │ │          │
│      │ ├─────────┤ │   │ ├─────────┤ │          │
│      │ │  L2     │ │   │ │  L2     │ │          │
│      │ └─────────┘ │   │ └─────────┘ │          │
│      │   Core 0    │   │   Core 1    │          │
│      └──────────────┘   └──────────────┘          │
│                                                  │
└─────────────────────────────────────────────────┘
```

## 6. Performance Metrics

### CPI (Cycles Per Instruction)

```text
CPU Time = Instruction Count × CPI × Clock Cycle Time

Example:
- 1 billion instructions
- CPI = 1.5
- Clock = 3GHz (0.333ns)

CPU Time = 1B × 1.5 × 0.333ns = 0.5 seconds
```

### Amdahl's Law

```text
Speedup = 1 / (1 - f + f/k)

Where:
- f = fraction of code that is parallel
- k = speedup of parallel portion

Example:
- 50% parallel (f=0.5)
- 4 cores (k=4)

Speedup = 1 / (0.5 + 0.5/4) = 1.6x
```

## สรุป

- CPU ประกอบด้วย Control Unit, ALU, และ Registers
- Memory hierarchy ช่วยลด latency
- RISC vs CISC มี trade-offs ต่างกัน
- Pipelining เพิ่ม throughput
- Parallelism มีหลายระดับ (ILP, SIMD, Multi-core)
