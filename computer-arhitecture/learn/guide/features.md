# Computer Architecture - Features

คุณสมบัติและความสามารถของ Computer Architecture

## CPU Features

### 1. Pipeline Design

- **5-Stage Pipeline**: IF, ID, EX, MEM, WB
- **Superscalar**: Execute multiple instructions per cycle
- **Out-of-Order Execution**: Reorder instructions for better throughput
- **Branch Prediction**: Predict branch directions to reduce stalls

### 2. Cache System

- **Multi-level Cache**: L1, L2, L3 hierarchy
- **Set Associative**: Flexible cache organization
- **Write-back vs Write-through**: Cache write policies
- **Cache Coherence**: Maintain consistency across cores

### 3. Memory Features

- **Virtual Memory**: Page-based memory management
- **TLB**: Translation Lookaside Buffer for fast address translation
- **Prefetching**: Predict and fetch data before needed
- **NUMA**: Non-Uniform Memory Access for multi-socket systems

## ISA Features

### 1. Instruction Types

- **RISC**: Simple instructions, fixed length
- **CISC**: Complex instructions, variable length
- **VLIW**: Very Long Instruction Word
- **SIMD**: Single Instruction Multiple Data

### 2. Register Sets

- **General Purpose Registers**: For arithmetic/logic operations
- **Special Purpose Registers**: PC, IR, status flags
- **Floating Point Registers**: For floating-point operations
- **Vector Registers**: For SIMD operations

## Parallelism Features

### 1. Thread-Level Parallelism

- **Multi-core**: Multiple independent cores
- **Hyper-threading**: Simultaneous multithreading
- **SMT**: Simultaneous Multithreading
- **Cooperative Multitasking**: OS-managed thread scheduling

### 2. Data-Level Parallelism

- **SIMD Instructions**: AVX, AVX2, AVX-512
- **Vector Processors**: Specialized for vector operations
- **GPU**: Massively parallel processors
- **TPU/NPU**: Specialized accelerators

### 3. Instruction-Level Parallelism

- **Superscalar**: Multiple execution units
- **Speculative Execution**: Execute before knowing dependencies
- **Register Renaming**: Eliminate false dependencies
- **Reorder Buffer**: Track in-flight instructions

## Performance Features

### 1. Performance Metrics

- **CPI**: Cycles Per Instruction
- **IPC**: Instructions Per Cycle
- **Throughput**: Instructions per second
- **Latency**: Time to complete single operation

### 2. Optimization Techniques

- **Loop Unrolling**: Reduce loop overhead
- **Software Pipelining**: Overlap loop iterations
- **Cache Blocking**: Improve cache locality
- **Branch Elimination**: Reduce branch penalties

## I/O Features

### 1. I/O Mechanisms

- **Polling**: Simple CPU-driven I/O
- **Interrupts**: Event-driven I/O
- **DMA**: Direct Memory Access
- **Bus Mastering**: Device-controlled transfers

### 2. Bus Architectures

- **System Bus**: Connects CPU, memory, I/O
- **PCIe**: High-speed serial bus
- **USB**: Universal Serial Bus
- **SATA/SAS**: Storage interfaces

## Security Features

### 1. Memory Protection

- **Virtual Memory**: Process isolation
- **Page Protection**: Read/write/execute permissions
- **ASLR**: Address Space Layout Randomization
- **NX Bit**: No-execute bit for security

### 2. Secure Execution

- **Secure Enclave**: Isolated execution environment
- **Trusted Execution**: Hardware-based security
- **Encryption**: Memory encryption
- **Secure Boot**: Verified boot process

## สรุป

Computer architecture มีคุณสมบัติหลากหลายเพื่อ:
- เพิ่ม performance ผ่าน pipeline และ parallelism
- จัดการ memory ผ่าน cache และ virtual memory
- รองรับ parallel processing หลายระดับ
- มี security features สำหรับ protection
- มี I/O mechanisms ที่หลากหลาย
