# How It Works

หลักการทำงานและ architecture ของ Lefthook

## Architecture

```
Git Event
    ↓
Lefthook Trigger
    ↓
Read lefthook.yml
    ↓
Execute Commands
    ↓
Check Results
    ↓
Allow/Block Git Operation
```

## Execution Flow

### 1. Git Event Trigger
เมื่อ Git event เกิดขึ้น (เช่น commit):
- Git เรียก Lefthook
- Lefthook อ่าน configuration
- Lefthook execute commands

### 2. Configuration Loading
Lefthook อ่าน `lefthook.yml`:
- Parse configuration
- Load remote configs
- Merge configurations

### 3. Command Execution
Lefthook execute commands:
- Execute ตามลำดับ (ถ้าไม่ parallel)
- Execute พร้อมกัน (ถ้า parallel)
- Capture output

### 4. Result Checking
Lefthook check results:
- Check exit codes
- Check output
- Determine success/failure

### 5. Git Operation
Lefthook ตัดสิน:
- Allow operation ถ้า success
- Block operation ถ้า failure

## Parallel Execution

### Sequential
```yaml
pre-commit:
  commands:
    lint:
      run: bun run lint
    test:
      run: bun test
```
รัน lint ก่อน test

### Parallel
```yaml
pre-commit:
  parallel: true
  commands:
    lint:
      run: bun run lint
    test:
      run: bun test
```
รัน lint และ test พร้อมกัน

## File Filtering

### Files Pattern
```yaml
pre-commit:
  commands:
    lint-js:
      run: bun run lint
      files: git diff --name-only --cached
      glob: "*.js"
```
รันเฉพาะไฟล์ JS ที่มีการเปลี่ยนแปลง

### GLOB Pattern
```yaml
pre-commit:
  commands:
    lint-ts:
      run: bun run lint
      glob: "*.ts"
```
รันเฉพาะไฟล์ TS

## Remote Configs

### Extend from Remote
```yaml
extends:
  - https://raw.githubusercontent.com/my-org/lefthook-config/main/config.yml
```

### Override Local
```yaml
extends:
  - https://raw.githubusercontent.com/my-org/lefthook-config/main/config.yml

pre-commit:
  commands:
    local-command:
      run: bun run local
```

## Example Flow

```bash
# 1. User commits
git commit -m "feat: add feature"

# 2. Git triggers pre-commit
# 3. Lefthook reads lefthook.yml
# 4. Lefthook executes commands
# 5. Commands pass/fail
# 6. Git allows/blocks commit
```
