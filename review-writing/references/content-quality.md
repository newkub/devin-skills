# Content Quality Checklist

ใช้สำหรับตรวจและปรับปรุงคุณภาพเนื้อหา (content) ทุกประเภท: markdown, documentation, workflow files, code comments, error messages, UI text

## 1. Simplify And Remove Redundancy

- ทำ `/simplify` เพื่อลดความซับซ้อนโดยไม่สูญเสีย context
- ลบข้อมูลที่ซ้ำซ้อนระหว่าง Execute และ Rules — ใช้ references แทนการเขียนซ้ำ
- ทำ `/dont-over-engineer` เพื่อกำหนดขอบเขตการแก้ไขให้ minimal

## 2. Make Content Explicit

- ใช้ active voice, ระบุ subject/object ชัดเจน, หลีกเลี่ยงคำกำกวม (should, could, might)
- ให้ตัวอย่าง concrete แทน abstract, ระบุ exceptions และ edge cases
- อธิบาย "why" ไม่ใช่แค่ "what"
- error messages บอกสิ่งที่ผิด ทำไม และแก้ยังไง

## 3. Content Dimensions

- Readability: explanations ชัดเจน, formatting เหมาะสม, หลีกเลี่ยง jargon
- Completeness: รวม use cases, examples, edge cases
- Correctness: ตรวจสอบ structure, flow, assumptions
- Accessibility: screen reader friendly, alt text
- Maintainability: organized structure, consistent patterns
- Relevance: address audience needs
- Actionability: actionable steps, clear instructions
- Consistency: cross-reference consistency, ใช้คำศัพท์เดียวกัน
- Tone And Voice: tone สม่ำเสมอ
- Terminology: ใช้คำศัพท์เดียวกันทั่วทั้งเอกสาร
- Link Quality: links ไม่ broken, anchor ถูกต้อง
- Searchability: headings/keywords ช่วย search
- Freshness: เนื้อหาไม่ล้าสมัย — ตรวจสอบวันที่และ version
- Visual Content: code blocks มี syntax highlighting, diagrams ชัดเจน, screenshots มี alt text

## 4. Format And Structure

- spacing, indentation, headings สม่ำเสมอ — หัวข้อ Title Case ภาษาอังกฤษ รายการภาษาไทย
- ลบ subsections ที่ไม่จำเป็นให้เป็น bullet points
- Grouping และ hierarchy ชัดเจน logical — numbering ต่อเนื่องถูกต้อง

## 5. Non-Redundancy

- ไม่ซ้ำซ้อนระหว่าง Execute และ Rules — ใช้ references แทนการเขียนซ้ำ
- Single source of truth — รวบรวมรายละเอียดที่เหมือนกันไว้ที่เดียว
- ความยาวเหมาะสมกับเนื้อหา
