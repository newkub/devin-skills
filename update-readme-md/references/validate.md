# Step: Validate

> Goal: ตรวจสอบคุณภาพและอัปเดต references

## Execute

1. `/review-writing`, `/update-reference` เพื่อตรวจสอบคุณภาพและอัปเดต references ไปพร้อมกัน
2. ตรวจว่า README มี sections ครบตาม Rule `Section Order And Format`
3. ตรวจว่า:
   - ไม่มี `>` description ที่ด้านบน (เฉพาะ status badge)
   - `## Get Started` ไม่มี `###` subsection
   - `## Features` 3 columns (ไม่มี Benefit, Usage)
   - ไม่มี `## API References` แยก
   - ไม่มี ANSI codeblock ด้านล่างสุด
   - `## Contributing` มีเฉพาะถ้ามี `CONTRIBUTING.md`
   - `## License` มีเฉพาะถ้ามี `LICENSE.md`
4. ถ้า validation ไม่ผ่าน → revise และ recheck (max 3 ครั้ง → stop/report)

## Checklist

- [ ] Status callout (red/green badge)
- [ ] Hero section (title + badges) — ไม่มี ANSI ใต้ badges
- [ ] UI Sketch (text codeblock ด้านบน Get Started)
- [ ] Get Started (numbered, no `###`)
- [ ] Features (3 columns)
- [ ] Usage (with ANSI drawing + inline references)
- [ ] Contributing (if CONTRIBUTING.md exists)
- [ ] License (if LICENSE.md exists)
- [ ] No bottom ANSI
- [ ] No `## API References`
- [ ] ANSI ทุกบรรทัดมีความยาวเท่ากัน (border ตรง)
