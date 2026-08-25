# Directories Check

ตรวจสอบ `.devin/` directory structure

## Required Directories

- `.devin/` — root directory ต้องมีที่ project root
- `.devin/rules/` — ต้องมี subdirectories:
  - `.devin/rules/always-on/` — rules ที่ทำงานเสมอ
  - `.devin/rules/model_decision/` — rules ที่ model ตัดสินใจ
  - `.devin/rules/glob/` — rules แบบ glob pattern
- `.devin/hooks/` — hook scripts directory

## Forbidden Directories

- `.devin/workflows/` — ห้ามมี ใช้ `rules/` แทน
- `.devin/` ใน sub-workspace — ต้องมีที่ root เท่านั้น

## Scoring

- Critical: ขาด `.devin/` หรือมี `.devin/workflows/`
- High: ขาด subdirectories ใน `.devin/rules/`
- Medium: ขาด `.devin/hooks/`
