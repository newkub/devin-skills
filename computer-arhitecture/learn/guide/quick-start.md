# Computer Architecture - Quick Start

เริ่มต้นเรียนรู้ Computer Architecture อย่างรวดเร็ว

## สิ่งที่ควรรู้ก่อนเริ่ม

### Prerequisites

- **Math**: เข้าใจ binary, hexadecimal, พื้นฐาน logic
- **Programming**: เข้าใจพื้นฐาน programming concepts
- **Curiosity**: อยากรู้ว่า computer ทำงานอย่างไร

## เริ่มต้นใน 5 นาที

### 1. เข้าใจ CPU Structure (2 นาที)

CPU ประกอบด้วย 3 ส่วนหลัก:
- **Control Unit**: ควบคุมการทำงาน
- **ALU**: คำนวณและ logical operations
- **Registers**: เก็บข้อมูลชั่วคราว

### 2. เข้าใจ Instruction Cycle (2 นาที)

CPU ทำงานวนลูป:
```
Fetch → Decode → Execute → Store
```

เหมือนการอ่านคำสั่ง → แปลความหมาย → ทำตามคำสั่ง → เก็บผลลัพธ์

### 3. เข้าใจ Memory Hierarchy (1 นาที)

Memory มีหลายระดับตามความเร็ว:
- **Registers**: เร็วที่สุด (1 cycle)
- **Cache**: เร็วมาก (1-40 cycles)
- **RAM**: ปานกลาง (100-300 cycles)
- **Storage**: ช้าที่สุด (ms scale)

## Learning Path

### Step 1: Read key-concept.md (30 นาที)

อ่าน concepts พื้นฐาน:
- CPU Fundamentals
- Memory Hierarchy
- ISA (Instruction Set Architecture)
- Pipelining
- Parallelism
- Performance Metrics

### Step 2: Read how-it-works.md (30 นาที)

เข้าใจการทำงาน:
- Instruction Processing
- Cache Operation
- Virtual Memory
- Bus Architecture
- I/O Systems
- Flynn's Taxonomy

### Step 3: Read features.md (15 นาที)

ทำความเข้าใจ features:
- CPU Features
- ISA Features
- Parallelism Features
- Performance Features

## Common Questions

### Q: ทำไมต้องเรียน Computer Architecture?

A: เพื่อ:
- เข้าใจว่า code ทำงานอย่างไรบน hardware
- Optimize performance ได้ดีขึ้น
- Debug low-level issues
- เข้าใจ compiler optimizations

### Q: ต้องมีพื้นฐานอะไรบ้าง?

A:
- Math พื้นฐาน (binary, hex, logic)
- Programming concepts
- ความอยากรู้

### Q: ใช้เวลาเรียนนานแค่ไหน?

A:
- Quick overview: 2-3 ชั่วโมง
- Deep understanding: 1-2 สัปดาห์
- Mastery: เดือนขึ้นไป

## Next Steps

หลังจาก quick-start:
1. อ่าน best-practices.md
2. ดู references/website.md
3. ลองใช้ simulators หากต้องการ
4. อ่าน textbooks หากต้องการลึกซึ้ง

## สรุป

Computer Architecture เป็นพื้นฐานสำคัญ:
- เข้าใจการทำงานของ computer
- ช่วย optimize code
- เป็นพื้นฐานสำหรับ system programming
