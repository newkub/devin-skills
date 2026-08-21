# Maintainability

## หลักการการบำรุงรักษา

### 1. ใช้ Reusable Workflows

Share logic ระหว่าง repositories

```yaml
jobs:
  build:
    uses: org/repo/.github/workflows/build.yml@main
```

### 2. ตั้งชื่อ Steps อย่างชัดเจน

ใช้ชื่อที่อธิบายว่า step ทำอะไร

```yaml
- name: Install Dependencies
  run: bun install
```

### 3. แยก Workflows

แยก workflows ตามความรับผิดชอบ (CI, CD, Release)

### 4. ใช้ Environment Variables

ใช้ env สำหรับค่าที่ใช้หลายที่

```yaml
env:
  NODE_ENV: test
```

### 5. Document Workflows

เพิ่ม comments สำหรับ logic ที่ซับซ้อน
