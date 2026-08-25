# Usage Section Coverage

กฎการตรวจสอบ Usage section ครอบคลุมทุก access methods

## Usage Section Structure

`## Usage` ต้องมี `### Usage via ...` สำหรับทุก access method ที่ project รองรับ

## Access Method Formats

### Usage via Web

- text instructions ไม่ใช่ code block
- ระบุ URL และขั้นตอนการใช้งาน
- ถ้าใช้ code block แทน text → flag เป็น `Medium`

### Usage via API

- code block พร้อม import และ function call
- ตัวอย่างต้อง runnable ได้
- ถ้าขาด import หรือ function call → flag เป็น `Medium`

### Usage via CLI

- bash code block พร้อม command
- ตัวอย่างต้องใช้ command จริงจาก source code
- ถ้าขาด bash code block → flag เป็น `Medium`

### Usage via SDK

- code block พร้อม install + import + usage
- ตัวอย่างต้องครบทั้ง 3 ส่วน
- ถ้าขาดส่วนใดส่วนหนึ่ง → flag เป็น `Medium`

### Usage via TUI / Desktop / Browser Extension

- text instructions สำหรับการใช้งาน
- ถ้าใช้ code block แทน text → flag เป็น `Low`

## Coverage Validation

1. ระบุ access methods ทั้งหมดที่ project รองรับจาก source code
2. ตรวจว่า `## Usage` มี `### Usage via ...` ครบทุก method
3. ตรวจ format ของแต่ละ method ตามกฎด้านบน
4. ถ้าขาด access method ที่ project รองรับ → flag เป็น `High`
5. บันทึก finding พร้อม file path และ line number

## Severity Mapping

| Issue | Severity |
|---|---|
| ขาด `## Usage` section | `High` |
| ขาด `### Usage via ...` สำหรับ method ที่รองรับ | `High` |
| Format ผิด (เช่น Web ใช้ code block) | `Medium` |
| SDK ขาด install/import/usage ส่วนใดส่วนหนึ่ง | `Medium` |
| TUI/Desktop/Extension ใช้ code block | `Low` |
