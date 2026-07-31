# Reliability

## หลักการความเชื่อถือได้

### 1. ใช้ Retry Mechanism

รัน steps ซ้ำเมื่อ fail

```yaml
- name: Test
  uses: nick-invision/retry@v2
  with:
    timeout_minutes: 10
    max_attempts: 3
    command: bun test
```

### 2. ตั้งค่า Timeouts

กำหนด timeouts สำหรับ jobs และ steps

```yaml
jobs:
  test:
    timeout-minutes: 30
```

### 3. ใช้ Matrix Strategy

Test บนหลาย platforms เพื่อความครอบคลุม

### 4. Monitor Failures

ตรวจสอบ workflow failures และแก้ไขอย่างรวดเร็ว

### 5. ใช้ Status Checks

กำหนด required status checks สำหรับ merge
