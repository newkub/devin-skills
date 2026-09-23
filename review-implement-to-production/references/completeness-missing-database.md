# Missing Database Detection Criteria

## UI/API Without Database

- ตรวจหา API endpoints ที่ไม่มี database table รองรับ
- ตรวจหา UI forms ที่บันทึกข้อมูลแต่ไม่มี table
- เปรียบเทียบ API handlers กับ schema tables
- ระบุ: endpoint ที่ใช้ in-memory store แทน database

## Missing Schema

- ตรวจหา: table ที่อ้างถึงใน code แต่ไม่มีใน schema
- ตรวจหา: column ที่อ้างถึงใน query แต่ไม่มีใน schema
- ตรวจหา: relation ที่อ้างถึงแต่ไม่มี foreign key
- ตรวจหา: index ที่จำเป็นแต่ไม่มีใน schema

## Missing Migrations

- ตรวจหา: schema เปลี่ยนแต่ไม่มี migration
- ตรวจหา: migration ที่สร้างแต่ยังไม่ run
- ตรวจหา: migration ที่ run แล้วแต่ schema ไม่ตรง

## Missing Data Integrity

- ตรวจหา: missing foreign key constraints
- ตรวจหา: missing NOT NULL บน required fields
- ตรวจหา: missing unique constraints
- ตรวจหา: missing default values

## Missing Seed Data

- ตรวจหา: tables ที่ต้องการ seed data แต่ไม่มี
- ตรวจหา: reference data (categories, statuses) ที่ missing
- ตรวจหา: seed script ที่ไม่ตรงกับ schema ปัจจุบัน

## Detection Tools

- `/scan-codebase` สำหรับค้นหา schema, migrations, queries
- เปรียบเทียบ schema กับ API handlers
- เปรียบเทียบ migrations กับ schema ปัจจุบัน

## Severity

- Critical: ฟีเจอร์หลักที่ UI/API มีแล้วแต่ไม่มี database table
- High: ฟีเจอร์สำคัญที่ schema ไม่สมบูรณ์ (ขาด column, ขาด constraint, ขาด migration)
- Medium: ฟีเจอร์รองที่ schema ยังไม่มี หรือมีแต่ไม่ครบ
- Low: index หรือ seed data ที่ไม่กระทบ production
