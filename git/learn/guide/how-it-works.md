# How Git Works

## Architecture

Git เป็น distributed version control system:
- ทุก developer มี full copy ของ repository
- ไม่มี single point of failure
- ทำงาน offline ได้
- Sync กับ remote เมื่อต้องการ

## Three States

Git มี 3 states หลัก:

### 1. Working Directory
- ไฟล์จริงบน disk
- ที่คุณแก้ไขอยู่
- ยังไม่ถูก track โดย Git

### 2. Staging Area (Index)
- ไฟล์ที่ถูก stage ด้วย `git add`
- เตรียมจะ commit
- สามารถ review ก่อน commit

### 3. Repository
- ไฟล์ที่ถูก commit แล้ว
- ถูกเก็บใน .git directory
- history ทั้งหมดอยู่ที่นี่

## Git Objects

Git เก็บข้อมูลในรูปแบบ objects:

### Blob
- เก็บ content ของไฟล์
- ไม่รวม filename
- content เดียวกัน = blob เดียวกัน

### Tree
- เก็บ directory structure
- ชี้ไปยัง blobs และ trees อื่น
- เหมือน filesystem

### Commit
- เก็บ snapshot ของ tree
- มี parent commit(s)
- มี author, timestamp, message

## DAG (Directed Acyclic Graph)

History ของ Git เป็น DAG:
- แต่ละ commit ชี้ไปยัง parent
- สามารถมีหลาย parents (merge commits)
- ไม่มี cycles
- สามารถ traverse ย้อนหลังได้

## Garbage Collection

Git มี garbage collection:
- ลบ objects ที่ไม่ถูกอ้างอิง
- รันด้วย `git gc`
- ทำอัตโนมัติบางครั้ง
- ช่วยลดขนาด repository

## Hashing

Git ใช้ SHA-1 hashing:
- ทุก object มี unique hash
- 40-character hexadecimal string
- ใช้สำหรับ integrity check
- ช่วย detect corruption
