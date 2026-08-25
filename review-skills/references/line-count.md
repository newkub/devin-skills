# Line Count And File Structure

ตรวจสอบ line count และ file structure ของ skill package

## Line Count Rules

- `SKILL.md` ต้องไม่เกิน 250 บรรทัด
- ทุกไฟล์ใน skill package ต้องไม่เกิน 250 บรรทัด (รวม `references/`)
- ถ้า `SKILL.md` เกิน 250 บรรทัดมาก → flag เป็น Critical
- ถ้าไฟล์อื่นเกิน 250 บรรทัด → flag เป็น Medium
- ถ้าเกิน 250 บรรทัดเล็กน้อย (251-260) → flag เป็น Low

## Placeholder And Mock Check

- ตรวจว่าไม่มี `TODO` ในเนื้อหา (ยกเว้น `// TODO` ใน code ที่จำเป็น)
- ตรวจว่าไม่มี `MOCK` ในเนื้อหา (ยกเว้น `// MOCK` ใน `mock/` directory)
- ตรวจว่าไม่มี placeholder text เช่น `lorem ipsum`, `placeholder`, `xxx`
- ถ้าพบ TODO/MOCK/placeholder ที่ไม่จำเป็น → flag เป็น High

## References Directory

- ถ้า skill มี `related` หรือ dependencies → ต้องมี `references/` directory
- ถ้ามี `references/` ต้องมี `references/index.md` ที่ map ไฟล์แต่ละตัว
- ถ้า skill มี dependencies แต่ไม่มี `references/` → flag เป็น Medium
- ถ้ามี `references/` แต่ขาด `index.md` → flag เป็ Medium

## File Structure

- แต่ละ skill package ต้องมี `SKILL.md` ที่ root ของ directory
- ไฟล์ใน `references/` ใช้ `kebab-case.md`
- ถ้าขาด `SKILL.md` → flag เป็น Critical

## Scoring

- Critical: ขาด `SKILL.md`, เกิน 250 บรรทัดมาก
- High: มี TODO/MOCK/placeholder ที่ไม่จำเป็น
- Medium: ไฟล์เกิน 250 บรรทัด, ขาด `references/` หรือ `index.md`
- Low: เกิน 250 บรรทัดเล็กน้อย
