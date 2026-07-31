# How It Works

## วิธีการทำงานของ GitHub Actions

### Workflow Execution Flow

```
Event Trigger → Workflow Start → Jobs Run → Steps Execute → Result
```

### 1. Event Trigger

- User push code
- Pull request created
- Manual trigger
- Scheduled time

### 2. Workflow Start

GitHub อ่าน workflow file และเริ่ม process

### 3. Jobs Run

แต่ละ job รันบน runner แยกกัน สามารถกำหนด dependencies ด้วย `needs`

### 4. Steps Execute

แต่ละ step รันตามลำดับ ใน job เดียวกัน

### 5. Result

- Success: ทุก steps ผ่าน
- Failure: step ใด step หนึ่ง fail
- Cancelled: user ยกเลิก

### Example

```yaml
name: CI

on: push

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Install
        run: bun install
      - name: Test
        run: bun test
```
