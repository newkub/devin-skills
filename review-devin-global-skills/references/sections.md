# Section Order Validation

ตรวจสอบ sections ของ `SKILL.md` ตามมาตรฐาน `follow-create-devin-global-skills`

## Required Section Order

ลำดับ sections ที่ถูกต้อง:

1. `## Goal` — อธิบายวัตถุประสงค์ของ skill
2. `## Scope` — กำหนดขอบเขตการใช้งาน
3. `## Execute` — ขั้นตอนการทำงาน
4. `## Rules` — กฎและข้อกำหนด
5. `## Expected Outcome` — ผลลัพธ์ที่คาดหวัง

- ถ้าขาด section จำเป็น → flag เป็น Critical
- ถ้าลำดับผิด → flag เป็น High

## Execute Section Rules

- `## Execute` ต้องมีไม่เกิน 10 steps
- ถ้าเกิน 10 steps → flag เป็น Medium
- แต่ละ step ใช้ format `### N. Step Name` โดย N เป็นเลขลำดับ
- แต่ละ step ต้องมี `> Goal:` อธิบายเป้าหมายของ step
- แต่ละ step ต้องมี numbered list (`1.`, `2.`, ...) ของ actions
- ถ้าขาด `> Goal:` → flag เป็น High
- ถ้าใช้ bullet list แทน numbered list → flag เป็น Medium

## Heading Format

- Heading ภาษาอังกฤษใช้ Title Case (เช่น `## Expected Outcome`)
- Heading ภาษาไทยใช้ตามปกติ
- ถ้า heading ภาษาอังกฤษไม่ Title Case → flag เป็น Low

## Scoring

- Critical: ขาด sections จำเป็น (`## Goal`, `## Scope`, `## Execute`)
- High: ลำดับผิด, ขาด `> Goal:` ใน step
- Medium: `## Execute` เกิน 10 steps, ใช้ bullet list แทน numbered list
- Low: heading ภาษาอังกฤษไม่ Title Case
