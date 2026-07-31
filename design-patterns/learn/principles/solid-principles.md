# SOLID Principles

## Purpose

หลักการ SOLID สำหรับการออกแบบซอฟต์แวร์ที่ maintainable และ extensible

## Scope

- Single Responsibility Principle (SRP)
- Open/Closed Principle (OCP)
- Liskov Substitution Principle (LSP)
- Interface Segregation Principle (ISP)
- Dependency Inversion Principle (DIP)

## Single Responsibility Principle (SRP)

| หลักการ | คำอธิบาย |
|---------|-------------|
| **คลาสควรมีหน้าที่เดียว** | แต่ละคลาสควรมีเหตุผลในการเปลี่ยนแปลงเพียงหนึ่งเดียว |
| **ตัวอย่าง** | User class ไม่ควรจัดการ database และ logging ด้วยกัน |
| **Pattern ที่เกี่ยวข้อง** | Facade, Strategy |

## Open/Closed Principle (OCP)

| หลักการ | คำอธิบาย |
|---------|-------------|
| **เปิดสำหรับ extend, ปิดสำหรับ modify** | คลาสควรเปิดสำหรับการขยาย แต่ปิดสำหรับการแก้ไข |
| **ตัวอย่าง** | ใช้ interface แทนการแก้ไขคลาสโดยตรง |
| **Pattern ที่เกี่ยวข้อง** | Template Method, Observer, Strategy |

## Liskov Substitution Principle (LSP)

| หลักการ | คำอธิบาย |
|---------|-------------|
| **Subclass ใช้แทน base class ได้** | Subclass ต้องสามารถใช้แทน base class ได้โดยไม่ทำลายโปรแกรม |
| **ตัวอย่าง** | Square ไม่ควร inherit จาก Rectangle เพราะ behavior ต่างกัน |
| **Pattern ที่เกี่ยวข้อง** | Strategy, State |

## Interface Segregation Principle (ISP)

| หลักการ | คำอธิบาย |
|---------|-------------|
| **แยก interfaces ให้เล็ก** | Clients ไม่ควรถูกบังคับให้ implement interfaces ที่ไม่ใช้ |
| **ตัวอย่าง** | แยก interface ขนาดใหญ่เป็น interfaces เล็กๆ |
| **Pattern ที่เกี่ยวข้อง** | Adapter, Facade |

## Dependency Inversion Principle (DIP)

| หลักการ | คำอธิบาย |
|---------|-------------|
| **พึ่ง abstractions, ไม่ใช่ concretions** | High-level modules ไม่ควรพึ่ง low-level modules |
| **ตัวอย่าง** | ใช้ interface แทน concrete classes |
| **Pattern ที่เกี่ยวข้อง** | Abstract Factory, Strategy, Dependency Injection |

## Pattern Alignment

| Pattern | SOLID Principles |
|---------|------------------|
| **Singleton** | SRP |
| **Factory Method** | OCP, DIP |
| **Abstract Factory** | OCP, DIP |
| **Builder** | SRP |
| **Adapter** | ISP |
| **Bridge** | OCP, DIP |
| **Composite** | OCP, LSP |
| **Decorator** | OCP, SRP |
| **Facade** | SRP, ISP |
| **Observer** | OCP |
| **Strategy** | OCP, DIP |
| **Command** | SRP, OCP |
| **State** | OCP, LSP |

## Next Steps

| File | Description |
|------|-------------|
| [key-concept.md](../key-concepts/key-concept.md) | Pattern classification |
| [best-practices.md](../guide/best-practices.md) | Pattern usage guidelines |
