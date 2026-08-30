---
name: follow-tool-aube
description: แนวทางการใช้งาน Aube package manager สำหรับ Node.js projects
related:
  - follow-tool-agent-browser
  - follow-tool-ast-grep
  - follow-tool-auto-it
  - follow-tool-usage
  - follow-best-practice
  - setup-cicd
---

## Goal

ใช้ Aube เป็น Node.js package manager หลักสำหรับโปรเจกต์ที่ต้องการความเร็วสูง ความปลอดภัย และประสิทธิภาพสูงสุด

## Scope

ใช้ `follow-tool-aube` สำหรับ tasks และ workflows เฉพาะที่กำหนด

## Execute

### 1. Installation

> Goal: ติดตั้ง Aube และตรวจสอบ version

1. ติดตั้ง Aube ด้วย `mise use aube` หรือดูวิธีอื่นๆ ที่ https://aube.en.dev/installation
2. ตรวจสอบ version ด้วย `aube --version`
3. Aube จะ auto-install dependencies เมื่อ run scripts โดยอัตโนมัติ

### 2. First Run

> Goal: รันครั้งแรกโดยใช้ lockfiles ที่มีอยู่

1. Aube จะอ่านและเขียน lockfiles ที่มีอยู่แล้ว (yarn.lock, pnpm-lock.yaml, package-lock.json)
2. ไม่ต้อง migrate lockfiles ทีละคน - Aube รองรับทั้งหมด
3. Run scripts ปกติ - Aube จะ auto-install เมื่อ dependencies เปลี่ยน

### 3. Daily Commands

> Goal: ใช้คำสั่ง `aubr` และ `aubx` ได้ถูกต้องตาม use case

ใช้ `aubr` สำหรับ run scripts ที่ต้องการ dependencies:

```bash
aubr test      # run test script, auto-installs first
aubr build     # run build script, auto-installs first
aubr dev       # run dev script, auto-installs first
```

ใช้ `aubx` สำหรับ one-off tools ที่ไม่ต้องการ dependencies:

```bash
aubx vitest    # run vitest without installing
aubx tsc       # run tsc without installing
```

### 4. Dependency Management

> Goal: จัดการ dependencies ด้วย Aube

```bash
aube add react          # add dependency
aube add -D vitest      # add dev dependency
aube remove react       # remove dependency
aube update             # update dependencies within package.json ranges
```

### 5. Security Configuration

> Goal: เพิ่ม ลบ และอัปเดต dependencies ด้วย Aube

Aube มี security defaults ที่เหมาะสมที่สุด:
- Trust downgrades fail at resolve
- New releases มี 24h cooling window
- Block known-malicious packages
- Prompt on near-zero-download installs
- Lifecycle scripts wait for approval
- Exotic transitive deps blocked

เปิดใช้ paranoid mode สำหรับ security สูงสุด:

```bash
paranoid: true
```

### 6. CI Integration

> Goal: ใช้ Aube ใน CI โดยไม่ต้อง install step แยก

```yaml
- run: aubr test
```

Aube จะ auto-install และ cache dependencies อัตโนมัติ

### 7. Workspace Support

> Goal: Aube รองรับ workspaces และ monorepo
- Global content-addressable store สำหรับ share package files
- ลด disk usage โดยไม่ copy dependencies ทั้งหมดในแต่ละ project
- node_modules layout ที่ efficient

### 8. Lockfile Compatibility

> Goal: Aube รองรับ lockfiles หลายประเภท
- yarn.lock
- pnpm-lock.yaml
- package-lock.json

อ่านและเขียน lockfiles ใน place โดยไม่ต้อง migrate

## Rules

### 1. Command Selection

เลือก command ตาม use case:
- aubr: สำหรับ run scripts ที่ต้องการ dependencies (test, build, dev)
- aubx: สำหรับ one-off tools ที่ไม่ต้อง dependencies (vitest, tsc)
- aube add: สำหรับ add dependencies
- aube remove: สำหรับ remove dependencies
- aube update: สำหรับ update dependencies

### 2. Auto-Install Behavior

- Aube auto-installs เมื่อ run scripts ด้วย `aubr`
- Skip install เมื่อ dependencies fresh บน repeat runs
- ใช้ `aubx` สำหรับ tools ที่ไม่ต้องการ install

### 3. Security Best Practices

- เปิดใช้ `paranoid: true` สำหรับ production
- Review lifecycle scripts ก่อน approve
- Block exotic transitive dependencies
- Trust downgrades fail at resolve

### 4. Lockfile Strategy

- ใช้ lockfiles ที่มีอยู่แล้ว (yarn.lock, pnpm-lock.yaml, package-lock.json)
- ไม่ต้อง migrate lockfiles ทีละคน
- Aube จะ read/write lockfiles ใน place

### 5. Disk Optimization

- Global content-addressable store ลด disk usage
- Share package files ระหว่าง projects
- node_modules layout ที่ efficient

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- Aube ติดตั้งและทำงานได้
- Auto-install dependencies เมื่อ run scripts
- Security defaults ที่เหมาะสมที่สุด
- ลด disk usage ด้วย global store
- รองรับ lockfiles หลายประเภท
