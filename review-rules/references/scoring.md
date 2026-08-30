# Rules Review Score Formula

## Goal

คำนวณคะแนนคุณภาพ rules และ `AGENTS.md` เพื่อวัดผลการตรวจสอบ

## Scope

ใช้หลังจบการตรวจสอบ rules และ `AGENTS.md` ทั้งหมด

## Score Components

### 1. `.devin/rules` (25 points)

- frontmatter ครบและถูกต้อง: 10 points
- ไม่มี duplicate rules: 10 points
- filename ใช้ kebab-case: 5 points

### 2. ast-grep Rules (25 points)

- `rules/` sync กับ `.devin/rules`: 10 points
- `sgconfig.yml` ชี้ directory ที่มีอยู่จริง: 10 points
- `ast-grep scan` ผ่านไม่มี error: 5 points

### 3. AGENTS.md Structure (25 points)

- sections ตามลำดับที่ถูกต้อง: 10 points
- frontmatter ครบ (`name`, `description`, `related`): 10 points
- ไม่มี section `## Workflows`: 5 points

### 4. References And Coverage (25 points)

- skill references ทั้งหมดถูกต้อง: 10 points
- ทุก workspace มี `AGENTS.md`: 10 points
- `AGENTS.md` ระดับ workspace ไม่ซ้ำ root: 5 points

## Calculation

- คะแนนเต็ม: 100 points
- หักคะแนนตามจำนวนปัญหาที่พบในแต่ละ component
- ปัญหา critical หัก 5 points, high หัก 3 points, medium หัก 1 point, low หัก 0.5 points
- คะแนนต่ำสุด: 0 points

## Severity Thresholds

- `90-100`: ผ่าน ไม่ต้องแก้ไข
- `70-89`: ผ่าน แต่มีปัญหา low/medium ให้แก้ไขตามลำดับความสำคัญ
- `50-69`: ไม่ผ่าน มีปัญหา high ให้แก้ไขก่อนส่งมอบ
- `0-49`: ไม่ผ่าน มีปัญหา critical ให้หยุดและแก้ไขทันที

## Expected Outcome

- ได้คะแนนรวมและคะแนนตาม component
- ระบุปัญหาที่ส่งผลต่อคะแนน
- แนะนำ next actions ตาม severity threshold

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % rules/AGENTS.md items in scope that were reviewed | reviewed / total × 100 |
| False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| Actionability Score | % findings with clear recommendation | actionable findings / total findings × 100 |
| Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | estimated time to fix | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | score improvement over time | (after - before) / before × 100 |
| Risk Exposure Index | high-severity findings in critical areas (rules or AGENTS.md) | count of Critical/High findings in critical scope |
| Scope Boundary Adherence | % findings inside declared scope | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % findings with proper location/reference | documented findings / total × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Rule Coverage | % ของ rule categories ที่ review ครบ | reviewed rules / total rules × 100 |
| 2 | Rule Conflict Count | จำนวน rules ที่ขัดแย้งหรือซ้ำซ้อน | count of conflicting or duplicate rules |
| 3 | Rule Enforcement Rate | % ของ rules ที่มี ast-grep/scan ตรวจสอบได้ | enforced rules / total rules × 100 |
