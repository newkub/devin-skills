---
name: software-design
description: "คู่มือการออกแบบ software รวมถึง SOLID principles, DDD, clean architecture, microservices, และ..."
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ให้ผู้ใช้เข้าใจและสามารถออกแบบ software ได้อย่างมีประสิทธิภาพ


## Scope

ใช้สำหรับออกแบบ software architecture, apply SOLID principles, implement Domain-Driven Design, เลือกระหว่าง microservices และ monolith, และ design API และ systems


## Execute

### 1. Study Key Concepts

อ่าน `key-concepts/` เพื่อเข้าใจแนวคิดพื้นฐาน
- SOLID principles
- Design patterns
- Architectural patterns

### 2. Apply Principles

ปฏิบัติตาม `principles/` เพื่อ apply หลักการในการออกแบบ
- SOLID principles application
- Design principles (DRY, KISS, YAGNI)
- Architecture selection

### 3. Follow Guides

อ่าน `guide/` เพื่อเข้าใจ best practices และ implementation
- Architecture patterns (Layered, Clean, Microservices)
- Design patterns detailed
- Domain-Driven Design
- API design
- System design
- Best practices

### 4. Use Workflows

ปฏิบัติตาม `workflows/` สำหรับการทำงานเฉพาะทาง
- Apply SOLID principles
- Design architecture
- Implement DDD

### 5. Reference Documentation

ศึกษา `references/` สำหรับ external resources
- Documentation
- Tools
- Best practices


## Rules

### Structure And Consistency

- ใช้ภาษาไทยใน `key-concepts/` และ `principles/`
- ใช้ภาษาอังกฤษใน `guide/` และ `references/`
- แต่ละไฟล์ไม่เกิน 250 บรรทัด
- ใช้ backticks สำหรับ `tools`, `commands`, `file paths`, `/workflow-name`

### Content And Style

- ให้ code examples ที่ชัดเจนและใช้งานได้จริง
- อ้างอิง sources ที่เชื่อถือได้
- อัปเดต content ให้ทันสมัยตาม version ล่าสุด
- ใช้ตารางสรุปข้อมูลที่เปรียบเทียบได้
- ใช้ `codeblock` สำหรับ code examples, configuration, หรือ commands
- ใช้ `ansi markdown diagrams` สำหรับ flow, architecture, หรือ how-it-works

### File Organization

- `key-concepts/` - เขียนเป็นภาษาไทย แต่ละ concept อยู่ในไฟล์แยกกัน
- `principles/` - เขียนเป็นภาษาไทย แต่ละ principle อยู่ในไฟล์แยกกัน
- ใช้ชื่อสื่อความหมายโดยตรง ไม่ใช้ prefix ชื่อ skill
- ใช้ `kebab-case` เสมอ ชื่อไฟล์ต้องสอดคล้องกับเนื้อหา


## Expected Outcome

- เข้าใจ software design principles
- สามารถ apply SOLID principles ได้
- สามารถ implement DDD ได้
- สามารถเลือก architecture ที่เหมาะสมได้
- สามารถ design systems ที่ maintainable และ scalable ได้
