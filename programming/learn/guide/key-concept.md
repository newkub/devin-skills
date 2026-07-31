# Key Concept

## What is Programming?

Programming เป็นกระบวนการสร้างซอฟต์แวร์โดยใช้ภาษาโปรแกรมเพื่อสั่งให้คอมพิวเตอร์ทำงานตามต้องการ ครอบคลุมตั้งแต่การเขียนโค้ดพื้นฐานไปจนถึงการออกแบบระบบที่ซับซ้อน

## Programming Paradigms

### Main Paradigms

| Paradigm | Description | Languages |
|----------|-------------|-----------|
| **Imperative** | สั่งทีละขั้นตอน | C, Assembly |
| **Procedural** | จัดกลุ่มโค้ดเป็น functions | C, Pascal |
| **Object-Oriented** | จัดกลุ่ม data + behavior | Java, C++, C# |
| **Functional** | โค้ดเป็น pure functions | Haskell, Lisp, Scala |
| **Logic** | กำหนด rules และ facts | Prolog |
| **Event-Driven** | ตอบสนองต่อ events | JavaScript, Python |

### Paradigm Comparison

| Aspect | OOP | Functional | Procedural |
|--------|-----|------------|------------|
| State | Mutable | Immutable | Mutable |
| Focus | Objects | Functions | Procedures |
| Control | Inheritance | Recursion | Loops |
| Side Effects | Common | Minimal | Common |

## Core Principles

### SOLID Principles

| Principle | Description | Example |
|-----------|-------------|---------|
| **S**ingle Responsibility | คลาสมีหน้าที่เดียว | UserService ดูแลเฉพาะ User |
| **O**pen/Closed | เปิด extend, ปิด modify | ใช้ interface |
| **L**iskov Substitution | Subclass ใช้แทน base ได้ | ทุก subclass ทำงานได้ |
| **I**nterface Segregation | แยก interfaces ให้เล็ก | หลาย small interfaces |
| **D**ependency Inversion | พึ่ง abstraction | ใช้ DI |

### Other Principles

| Principle | Description |
|-----------|-------------|
| **DRY** | Don't Repeat Yourself - ไม่เขียนโค้ดซ้ำ |
| **KISS** | Keep It Simple, Stupid - ให้โค้ดเรียบง่าย |
| **YAGNI** | You Aren't Gonna Need It - เขียนเมื่อต้องการจริง |
| **GRASP** | General Responsibility Assignment Software Patterns |

## Programming Concepts

### Variables and Types

| Concept | Description |
|---------|-------------|
| **Static Typing** | กำหนด type ตอน compile (TypeScript, Java) |
| **Dynamic Typing** | กำหนด type ตอน runtime (JavaScript, Python) |
| **Type Inference** | compiler อนุมาน type เอง |
| **Duck Typing** | "ถ้าเดินได้เหมือนเป็ด ก็เป็นเป็ด" |

### Control Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Control Flow Structures                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Sequence ──────> Statements execute in order                │
│       │                                                         │
│       ├─ Selection ──> if/else, switch, ternary              │
│       │                                                        │
│       ├─ Iteration ──> for, while, do-while, forEach         │
│       │                                                        │
│       └─ Jump ──────> break, continue, return, goto           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Functions

| Concept | Description |
|---------|-------------|
| **Pure Functions** | ไม่มี side effects, same input = same output |
| **First-class Functions** | functions เป็นค่า (pass, return, assign) |
| **Higher-order Functions** | functions รับ/return functions อื่น |
| **Closures** | function จำ context ที่ถูกสร้าง |

### Data Structures

| Type | Use Case | Complexity |
|------|----------|------------|
| **Array** | Sequential access | O(1) access |
| **List** | Frequent insert/delete | O(1) insert |
| **Hash Map** | Key-value lookup | O(1) average |
| **Tree** | Hierarchical data | O(log n) |
| **Graph** | Network relationships | Varies |

## Programming Techniques

### Problem Solving

| Technique | Description |
|-----------|-------------|
| **Decomposition** | แบ่งปัญหาใหญ่เป็นส่วนเล็ก |
| **Pattern Recognition** | หา patterns ที่ซ้ำ |
| **Abstraction** | ซ่อนรายละเอียดที่ไม่จำเป็น |
| **Algorithm Design** | เลือก/ออกแบบวิธีแก้ปัญหา |

### Code Organization

| Pattern | Description |
|---------|-------------|
| **Modular** | แบ่งโค้ดเป็น modules |
| **Layered** | แยก layers (UI, Business, Data) |
| **Microservices** | แบ่งเป็น services เล็กๆ |
| **Monolithic** | ทุกอย่างรวมกัน |

## Summary

| Concept | Key Takeaway |
|---------|--------------|
| **Paradigms** | เลือก paradigm ที่เหมาะกับงาน |
| **SOLID** | แนวทางออกแบบที่ดี |
| **Functions** | สร้าง pure functions เมื่อเป็นไปได้ |
| **Data Structures** | เลือกใช้ให้เหมาะสม |