# Roadmap Output Format

format สำหรับ prioritized roadmap report

## Prioritized Roadmap Table

columns:

| Rank | Opportunity | Category | Score | Impact | Effort | Criticality | Action Skill | Sources |
|------|-------------|----------|-------|--------|--------|-------------|--------------|---------|

- Rank: ลำดับตาม score จากสูงไปต่ำ
- Opportunity: ชื่อสั้น
- Category: หมวดจาก `references/categorization.md`
- Score: คะแนนจาก `references/scoring.md`
- Impact: 1-5
- Effort: 1-5
- Criticality: 1-3
- Action Skill: skill ที่แนะนำ เช่น `/add-more`, `/idea-features`
- Sources: dimensional reviews ที่พบ

## Quick Wins Section

แสดงแยกจาก roadmap หลัก:

| # | Opportunity | Impact | Effort | Action Skill |
|---|-------------|--------|--------|--------------|

- เรียงตาม impact สูงไปต่ำ
- ทำก่อนเสมอ

## Dependency Chain Section

แสดง causal relationships:

| Root Cause | Downstream Gaps | Fix Order |
|------------|-----------------|-----------|

- แก้ root cause ก่อน downstream
- ถ้าแก้ root cause แล้ว downstream หาย → ลด priority

## Coverage Report

แสดง dimensions ที่รวมและข้าม:

| Dimension | Status | Findings |
|-----------|--------|----------|

- Status: ✅ included, ⚠️ skipped, ❌ missing
- ถ้าข้าม → ระบุเหตุผล

## Report Steps

1. ทำ `/report` พร้อม `/report-markdown-table`
2. แสดง Prioritized Roadmap table
3. แสดง Quick Wins section
4. แสดง Dependency Chain section
5. แสดง Coverage Report
6. ทำ `/suggest-next-action` โดยอ้าง top opportunity

## Priority Adjustment

- ปรับลำดับตาม dependency chain จาก `references/deduplication.md`
- root cause ต้องอยู่ก่อน downstream
- quick wins ทำก่อนแม้ score ต่ำกว่า
- ทำ `/prioritize` เพื่อยืนยันลำดับสุดท้าย
