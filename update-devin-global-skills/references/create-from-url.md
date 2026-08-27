# Create Skills From URL

สร้าง skill ใหม่หรือกลุ่ม subskills จาก URL หรือ domain ที่ user ให้มา โดยดึงเนื้อหา วิเคราะห์ จัดกลุ่ม และเขียน skill ตามมาตรฐาน

## Scope

รับได้ทั้ง URL หน้าเดียวหรือ domain ทั่วไป โดยสร้าง parent skill และ subskills ภายใต้ `subskills/<domain>/<subskill>/SKILL.md`

## Get Url Or Domain

1. ถ้า user ส่ง URL มา → ใช้ URL นั้น
2. ถ้า user ส่ง domain หรือ root website → ใช้ `/web_search` หาหน้าสำคัญทั้งหมด
3. ถ้าไม่มีอะไรเลย → ทำ `/ask-me` เพื่อขอ URL หรือ domain
4. ถ้าต้องการ crawl ลึก → ใช้ `/learn-from-web` หรือ `/use-scripts` ช่วยดึง links

## Fetch Content

1. ใช้ `/webfetch` ดึงเนื้อหาหน้าเดียว
2. ถ้ามีหลาย URL → ใช้ `run_subagent` ดึงขนานกัน โดยละ 10 URLs ต่อ batch
3. สรุปเนื้อหาแต่ละหน้าเป็น bullet: หัวข้อหลัก, commands, config, examples

## Group And Name

1. อ่าน `subskills/<domain>/<subskill>/SKILL.md` pattern จาก `/update-devin-global-skills`
2. จัดกลุ่ม topics ตามลักษณะงาน: `setup-*`, `update-*`, `improve-*`, `follow-*`, `use-*`, `review-*`, `write-*`
3. ตั้งชื่อ subskill เป็น `<domain>-<subskill>` เช่น `cloudflare-follow-runtime-api`
4. สร้าง parent skill `<domain>-subskills` โดยมี `related` ชี้ทุก subskill

## Create Subskills

1. สร้าง directory `subskills/<domain>/<subskill>/` สำหรับแต่ละ group
2. เขียน `SKILL.md` ในแต่ละ subskill โดยทำตาม `/update-devin-global-skills`
3. ทุก subskill ต้องมี `name`, `description` ≤100, `related`
4. ห้ามเกิน 250 บรรทัด ถ้าเกินให้ย่อหรือแยก subskill เพิ่ม

## Create Parent Skill

1. สร้าง `<domain>-subskills/SKILL.md`
2. `## Execute` ระบุให้อ่าน `subskills/<domain>/<subskill>/SKILL.md` ตาม subskill ที่ user ระบุ
3. `related` ครบทุก subskill
4. รองรับ syntax `<domain>-subskills[<subskill>, ...]` โดยอ่านจาก prompt และ `glob`

## Validate And Commit

1. ทำ `/deep-validate` เพื่อตรวจ frontmatter, sections, ความยาว
2. ทำ `/check-reference` เพื่อตรวจ `related`
3. ทำ `/git-commit` เพื่อ commit skills ใหม่
4. ทำ `/report` พร้อมรายชื่อ skills ที่สร้าง

## Rules

### Domain And Naming

- ใช้ domain เป็นชื่อ parent skill
- subskill ชื่อ `<domain>-<subskill>` เสมอ
- directory `subskills/<domain>/<subskill>/` ตรงกับชื่อ `name`
- ไม่สร้าง duplicate กับ skills ที่มีอยู่

### Content Quality

- เนื้อหาต้องมาจาก official docs หรือ primary source
- แปลง examples ให้สอดคล้องกับ project context ที่ user ระบุ
- ใช้ backticks สำหรับ commands, paths, skill names
- ไม่ใส่ TODO/MOCK/placeholder

### Crawl Discipline

- ถ้าไม่มี `/follow-tool-crw` ให้ใช้ `/web_search` + `/webfetch` แทน
- ไม่ crawl เกิน 20 URLs ต่อ batch ถ้าไม่จำเป็น
- ถ้า crawl ล้มเหลว → รายงานและหยุด

### Minimal First

- เริ่มจาก parent + 3-5 subskills ก่อน
- ขยายเพิ่มเมื่อ user ต้องการ
- ไม่สร้าง skills จนกว่า user ยืนยัน
