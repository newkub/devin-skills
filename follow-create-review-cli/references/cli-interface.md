# CLI Interface And Output Format

## Help Option

ตรวจว่า `--help` และ `-h` option แสดง:

- usage: วิธีเรียก CLI
- options: flags ทั้งหมดพร้อม description
- exit codes: 0 = success, 1 = invalid arguments
- examples: ตัวอย่างการใช้งาน

ถ้าขาด `--help`/`-h` → flag เป็น `High` severity

## Exit Codes

ตรวจว่า exit codes ถูกต้อง:

- `0` — success, review สำเร็จ
- `1` — invalid arguments หรือ error

ถ้า exit codes ผิด → flag เป็น `High` severity

## Output Format

ตรวจว่า output รองรับ 2 formats ผ่าน `--format` flag:

- `table` — default, แสดงผลเป็นตารางอ่านง่าย
- `JSON` — สำหรับ programmatic consumption

ถ้าขาด format option → flag เป็น `Medium` severity

## Error Messages

ตรวจว่า error messages สำหรับ invalid arguments:

- ระบุ argument ที่ผิด
- แนะนำ usage ที่ถูกต้อง
- แสดง exit code 1

ถ้า error messages ไม่ชัดเจน → flag เป็น `Medium` severity

## CLI Flags Checklist

ตรวจ flags ครบ:

- `--help` / `-h` — แสดง help
- `--format` — เลือก output format (`table` | `JSON`)
- `--output` — path สำหรับเขียนผลลัพธ์ (optional)

ถ้าขาด flag ที่จำเป็น → flag ตาม severity ที่เหมาะสม

## Evidence Format

ทุก finding ต้องมี:

- file path เช่น `tools/review-codebase/src/presentation/cli.ts`
- line number
- code snippet ที่เป็นปัญหา
