# Rules, Ast-Grep Rules, Devin-Project-Rules Drift Checks

## Devin Rules Drift

### Coverage Vs Dependencies

- ตรวจสอบ `.devin/rules/always-on/libs/` ครอบคลุม libraries ทั้งหมดจาก `package.json`
- ระบุ libraries ที่ไม่มี rules
- ระบุ rules ที่อ้างถึง libraries ที่ไม่ใช้แล้ว

### Architecture Rules

- ตรวจสอบ `.devin/rules/always-on/architecture/` ครอบคลุมทุก workspace
- ระบุ workspaces ที่ไม่มี architecture rules
- ตรวจสอบว่า architecture rules สอดคล้องกับ structure ปัจจุบัน

### Model Decision Rules

- ตรวจสอบ `.devin/rules/model_decision/` ครอบคลุม domain patterns ที่มี
- ระบุ domain patterns ที่ไม่มี rules
- ระบุ rules ที่อ้างถึง domains ที่ไม่มีแล้ว

### Glob Rules

- ตรวจสอบ `.devin/rules/glob/` ครอบคลุม file patterns ที่สำคัญ
- ระบุ file patterns ที่ไม่มี rules
- ตรวจสอบว่า `globs:` list สอดคล้องกับ directory structure ปัจจุบัน

## Ast-Grep Rules Drift

### Coverage Vs Devin Rules

- ตรวจสอบว่าทุก devin rule ที่แปลงได้มี ast-grep counterpart
- ระบุ devin rules ที่ขาด ast-grep counterpart
- ระบุ ast-grep rules ที่ล้าสมัย

### Sgconfig Completeness

- ตรวจสอบ `sgconfig.yml`: `ruleDirs`, `languageAliases`, `devPaths`, `testConfigs`
- ระบุ missing configuration
- ตรวจสอบว่า `devPaths` ครอบคลุม source directories ทั้งหมด

### Rule Effectiveness

- รัน `bunx ast-grep scan --inspect summary` เพื่อตรวจสอบ rules
- ระบุ rules ที่ไม่ match อะไรเลย (stale)
- ระบุ rules ที่ match มากเกินไป (too broad)

## Drift Severity

- Critical: rules ขาด critical coverage, ast-grep rules ไม่ทำงาน
- High: rules ไม่ครอบคลุม tools ใหม่, sgconfig ไม่ครบ
- Medium: rules ล้าหลังบางส่วน, minor coverage gap
- Low: cosmetic rule drift

## Recommended Update Skills

- `update-project-rules` สำหรับ update ทั้ง devin rules (libs/code-quality/architecture grouping) และ ast-grep rules พร้อมแปลงจาก devin rules
