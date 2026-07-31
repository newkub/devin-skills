---
name: database-design
description: "คู่มือการออกแบบ database รวมถึง relational vs NoSQL, schema design, indexing, query..."
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ให้ผู้ใช้เข้าใจและสามารถออกแบบ database ได้อย่างมีประสิทธิภาพ


## Scope

ใช้สำหรับออกแบบ database schema, เลือกระหว่าง relational และ NoSQL, optimize queries และ indexing, design distributed databases, และเข้าใจ ACID และ consistency models


## Execute

### 1. Read Guide Files

อ่าน `guide/` เพื่อเข้าใจ concepts และ best practices

- `quick-start.md` - เริ่มต้นเบื้องต้น
- `key-concept.md` - แนวคิดสำคัญ (index)
- `schema-design.md` - การออกแบบ schema (index)
- `best-practices.md` - best practices ทั่วไป (index)
- `troubleshooting.md` - การแก้ปัญหา (index)
- `query-optimization.md` - การ optimize queries (index)
- `how-it-works.md` - วิธีการทำงาน (index)
- `indexing.md` - การใช้ indexing
- `features.md` - ฟีเจอร์ต่างๆ
- `configuration.md` - การตั้งค่า
- `installation.md` - การติดตั้ง

### 2. Study Key Concepts

ศึกษา key concepts ใน `guide/`

- `relational-vs-nosql.md` - เปรียบเทียบ relational และ NoSQL
- `acid-properties.md` - คุณสมบัติ ACID
- `cap-theorem.md` - CAP Theorem
- `normalization.md` - normalization (1NF, 2NF, 3NF)
- `denormalization.md` - denormalization
- `indexing-types.md` - ประเภท indexes
- `foreign-keys.md` - foreign keys
- `constraints.md` - constraints
- `relationships.md` - relationships

### 3. Study Best Practices

ศึกษา best practices ใน `guide/`

- `schema-best-practices.md` - schema best practices
- `indexing-best-practices.md` - indexing best practices
- `query-optimization-best-practices.md` - query optimization best practices
- `transaction-best-practices.md` - transaction best practices
- `security-best-practices.md` - security best practices
- `performance-best-practices.md` - performance best practices
- `backup-best-practices.md` - backup best practices
- `documentation-best-practices.md` - documentation best practices
- `monitoring-best-practices.md` - monitoring best practices

### 4. Study Schema Design

ศึกษา schema design ใน `guide/`

- `data-types.md` - data types
- `naming-conventions.md` - naming conventions
- `schema-evolution.md` - schema evolution

### 5. Study Query Optimization

ศึกษา query optimization ใน `guide/`

- `explain-analyze.md` - การวิเคราะห์ query plans
- `select-optimization.md` - การใช้ SELECT และ LIMIT
- `where-optimization.md` - การใช้ indexable conditions
- `join-optimization.md` - การเลือก join types
- `subquery-optimization.md` - การใช้ CTEs และ JOIN
- `aggregation-optimization.md` - การใช้ indexes และ HAVING
- `pagination-optimization.md` - การใช้ keyset pagination
- `batch-operations.md` - การใช้ bulk operations
- `materialized-views.md` - การใช้ materialized views
- `partitioning.md` - การ partition tables
- `connection-pooling.md` - การใช้ connection pools
- `caching.md` - การ cache query results
- `query-monitoring.md` - การ monitor queries

### 6. Study How It Works

ศึกษา how database systems work ใน `guide/`

- `query-processing.md` - Parser, Optimizer, Executor
- `storage-mechanisms.md` - Page-Based Storage, B-Tree
- `write-ahead-logging.md` - WAL mechanism
- `mvcc.md` - Multi-Version Concurrency Control
- `index-structures.md` - B-Tree Index, Hash Index
- `query-execution-joins.md` - Nested Loop, Hash, Merge Join
- `transaction-management.md` - Two-Phase Commit, Savepoints
- `replication-mechanisms.md` - Master-Slave, Master-Master
- `sharding.md` - Horizontal Sharding, Vertical Sharding

### 7. Study Troubleshooting

ศึกษา troubleshooting ใน `guide/`

- `performance-troubleshooting.md` - performance troubleshooting
- `data-integrity-troubleshooting.md` - data integrity troubleshooting
- `replication-troubleshooting.md` - replication troubleshooting
- `storage-troubleshooting.md` - storage troubleshooting
- `memory-troubleshooting.md` - memory troubleshooting
- `network-troubleshooting.md` - network troubleshooting
- `debugging-tips.md` - debugging tips
- `common-pitfalls.md` - common pitfalls

### 8. Study References

ศึกษา `references/` สำหรับ documentation และ resources

- `website.md` - เว็บไซต์หลัก
- `sitemap.md` - แผนผังเนื้อหา

### 9. Apply Knowledge

ปฏิบัติตาม workflows/ สำหรับการทำงานเฉพาะทาง (ถ้ามี)

### 10. Practice

ใช้ภาษาไทยในการอธิบาย
ให้ code examples ที่ชัดเจนและใช้งานได้จริง
อ้างอิง sources ที่เชื่อถือได้
อัปเดต content ให้ทันสมัยตาม version ล่าสุด


## Rules

### Structure And Consistency

- ทุก `SKILL.md` ต้องมี frontmatter: `title`, `description`, `auto_execution_mode: 3`
- ทุก `SKILL.md` ต้องมี sections: `## Goal`, `## Scope`, `## Execute`, `## โครงสร้าง Directory`, `## หมวดหมู่ไฟล์`, `## Rules`, `## Expected Outcome`
- `## โครงสร้าง Directory` ต้องอยู่ก่อน `## หมวดหมู่ไฟล์`
- Goal สอดคล้องกับ skill name, Execute สอดคล้องกับ Goal และ Rules
- Expected Outcome สอดคล้องกับ Goal
- ใช้คำศัพท์สม่ำเสมอ

### Content And Style

- หัวข้อภาษาอังกฤษ Title Case, รายการภาษาไทย
- ใช้ bullet points (-) ชิดซ้ายใน Rules
- ไฟล์ไม่เกิน 250 บรรทัด
- ใช้ backticks สำหรับ `tools`, `commands`, `file paths`, `/workflow-name`
- เขียนเป็นหลักการ how-to
- ใน Rules สามารถใช้ table, code block ได้
- terminal commands, architecture ใส่ใน code block
- examples ต้องสั้นกระชับ

### File Organization

- `guide/` - เก็บทุกไฟล guide, key concepts, principles, และ troubleshooting
- เขียน key concepts และ principles เป็นภาษาไทย แต่ละ concept/principle อยู่ในไฟล์แยกกัน
- ใช้ตารางสรุปข้อมูลที่เปรียบเทียบได้
- ใช้ `codeblock` สำหรับ code examples, configuration, หรือ commands
- ใช้ `ansi markdown diagrams` สำหรับ flow, architecture, หรือ how-it-works
- ใช้ชื่อสื่อความหมายโดยตรง ไม่ใช้ prefix ชื่อ skill
- ใช้ `kebab-case` เสมอ ชื่อไฟล์ต้องสอดคล้องกับเนื้อหา
- แต่ละไฟล์ต้องไม่เกิน 250 บรรทัด ถ้าเกินให้ refactor แยกไฟล์
- ทำตาม Execute ตามลำดับเสมอ
- ใช้ backticks สำหรับ technical terms, file names, commands, หรือ code references


## Expected Outcome

- เข้าใจ database types และ when to use
- สามารถออกแบบ schema ที่ดีได้
- สามารถ optimize queries และ indexing ได้
- สามารถ design distributed databases ได้
- Devin Skills ที่มีโครงสร้างสม่ำเสมอตามมาตรฐาน
- Folder structure ที่เป็นระบบและ deterministic
- SKILL.md index ที่ครบถ้วนและอ่านง่าย
- File naming ที่สอดคล้องกันทั่วทั้ง skill
- Content ที่มีคุณภาพและถูกต้องตามมาตรฐาน
- References ที่ถูกต้องและอ้างอิงไปยังไฟล์ที่มีอยู่จริง
- Skills ที่ maintainable และ easy to navigate
