---
name: follow-tool-hk
description: ตั้งค่าและใช้งาน hk สำหรับ Git hooks แทน Lefthook/pre-commit
---

## Goal

ตั้งค่า hk เป็น Git hook manager แทน Lefthook ด้วย Pkl config ที type-safe และเร็ว

## Scope

ใช้ hk สำหรับ pre-commit, pre-push, pre-merge-commit และคำสั่ง `check`/`fix`

## Execute

### 1. Install hk

> Goal: มี hk CLI พร้อมใช้

1. แนะนำติดตั้งผ่าน mise: `mise use -g hk` หรือ `mise use hk` ใน project
2. ทางเลือก: `cargo install hk`, `brew install hk`, `mise use hk`
3. ถ้า project ไม่มี mise ให้ทำ `/follow-tool-mise` ก่อน
4. ยืนยันด้วย `hk --version`

### 2. Install Git Hooks

> Goal: git เรียก hk อัตโนมัติ

1. แนะนำ per-repo install: `hk install` หรือ `mise x -- hk install`
2. ทางเลือก global install: `hk install --global` (ต้อง Git 2.54+)
3. ยืนยันด้วย `git config --get hook.hk-pre-commit.command`
4. ถ้าใช้ mise ตั้ง `HK_MISE=1` ใน `mise.toml` หรือ `mise = true` ใน `hk.pkl`

### 3. Create mise.toml

> Goal: จัดการ tools ที hk ใช้

1. รัน `mise use bun gitleaks hk` เพื่อเพิ่ม tools ใน project
2. กำหนด `HK_MISE = "1"` ใน `[env]`
3. ใช้ version ที match `packageManager` เช่น `bun = "1.3.14"`
4. ไม่ commit secrets หรือ user-specific paths

### 4. Create hk.pkl

> Goal: ตั้งค่า hooks สำหรับ project

1. รัน `hk init` เพื่อสร้าง `hk.pkl` ต้นแบบ
2. แก้ไข `hk.pkl` โดยใช้ `amends` และ `import Builtins.pkl` ตาม version ล่าสุด
3. กำหนด `mise = true` ถ้าใช้ mise tools
4. กำหนด hooks หลัก: `pre-commit`, `pre-push`, `pre-merge-commit`, `check`, `fix`
5. ใช้ `hk.local.pkl` สำหรับ local overrides โดยไม่ commit

### 5. Configure Steps

> Goal: กำหนด linters/tests ให้ hk รัน

1. ใช้ `Builtins.<name>` สำหรับเครื่องมือที่รองรับ เช่น `Builtins.gitleaks`
2. สร้าง custom step ด้วย `glob`, `exclude`, `check`, `fix`
3. ใช้ `fix = true` ใน `pre-commit` เพื่อแก้ไขไฟล์อัตโนมัติ
4. ใช้ `stash = "git"` ใน `pre-commit` เพื่อ stash unstaged changes
5. ถ้า working tree ใหญ่หรือ Windows long path ให้ใช้ `stash = "patch-file"` หรือ `stash = "none"`
6. ใช้ `stomp = true` สำหรับ typecheck/test/scan ที่ไม่ต้องการ file lock
7. ใช้ `batch = true` สำหรับเครื่องมือที่รองรับ batch

### 6. Run and Validate

> Goal: ตรวจสอบว่า hooks ทำงาน

1. รัน `hk run pre-commit` เพื่อทดสอบ
2. รัน `hk run pre-push`
3. รัน `hk run pre-merge-commit`
4. รัน `hk check --all` สำหรับ CI
5. รัน `hk fix` เพื่อแก้ไขไฟล์
6. ทำ `/run-verify` เพื่อตรวจ lint/typecheck/scan หลังตั้งค่า

### 7. Migrate from Lefthook

> Goal: ย้ายจาก lefthook มา hk

1. ลบ `lefthook.yml` และ `lefthook-local.yml` ออกจาก repo
2. เอา `bunx lefthook install` ออกจาก `package.json` `prepare`
3. เปลี่ยน `prepare` เป็น `mise x -- hk install`
4. อัปเดต `.devin/rules/always-on/follow-lefthook.md` เป็น `hk.md`
5. ลบ ast-grep rule `rules/always-on/follow-lefthook.yml` ถ้ามี

## Rules

### 1. Configuration Structure

- ใช้ `hk.pkl` ใน root หรือ `.config/hk.pkl`
- ใช้ `hk.local.pkl` สำหรับ local overrides (ไม่ commit)
- ใช้ `amends` กับ release package URL เสมอ
- ใช้ `import Builtins.pkl` เพื่อใช้ builtin linters
- ใช้ version tag ล่าสุด เช่น `v1.54.0`

### 2. mise Integration

- ตั้ง `mise = true` ใน `hk.pkl` เมื่อ tools มาจาก mise
- ตั้ง `HK_MISE = "1"` ใน `mise.toml` `[env]`
- ใช้ `mise x -- hk install` ใน `package.json` `prepare`
- ระบุ tools ใน `mise.toml` เช่น `bun`, `gitleaks`, `hk`

### 3. Hook Behavior

- `pre-commit` ควร `fix = true`
- `pre-push` รัน check-only (no fix)
- `pre-merge-commit` รัน typecheck อย่างเดียว
- ใช้ hook names ที่ถูกต้อง: `pre-commit`, `pre-push`, `pre-merge-commit`
- ห้ามใช้ `pre-merge` (ไม่ใช่ valid Git hook name)
- ไม่ bypass hooks ด้วย `HK=0 git commit` โดยไม่จำเป็น

### 4. Step Standards

- ระบุ `glob` สำหรับ linters ที่ทำงานกับไฟล์
- ใช้ `exclude` เป็น `List(...)`
- ใช้ `check` สำหรับ read-only, `fix` สำหรับ modify
- ใช้ `stomp = true` สำหรับ workspace-wide checks
- ใช้ `batch = true` สำหรับเครื่องมือที่รองรับ
- ใช้ `depends` สำหรับลำดับการทำงานระหว่าง steps
- ใช้ `exclusive = true` สำหรับ steps ที่ต้องรันคนเดียว

### 5. Example mise.toml

```toml
[tools]
bun = "1.3.14"
gitleaks = "8.30.1"
hk = "1.54.0"

[env]
HK_MISE = "1"

[hooks]
postinstall = "hk install"
```

### 6. Example hk.pkl

```pkl
amends "package://github.com/jdx/hk/releases/download/v1.54.0/hk@1.54.0#/Config.pkl"
import "package://github.com/jdx/hk/releases/download/v1.54.0/hk@1.54.0#/Builtins.pkl"

mise = true

local linters = new Mapping<String, Step> {
  ["biome"] {
    glob = List("*.{ts,tsx,js,jsx,vue,json,jsonc,md}")
    exclude = List("**/.agents/**", "**/.devin/**")
    check = "bunx biome check --no-errors-on-unmatched {{files}}"
    fix = "bunx biome check --write --no-errors-on-unmatched {{files}}"
    batch = true
  }
  ["gitleaks"] {
    check = "gitleaks protect --no-banner --redact --config .gitleaks.toml --staged"
  }
}

local checks = new Mapping<String, Step> {
  ["scan"] {
    check = "bun run scan"
    stomp = true
  }
  ["typecheck"] {
    check = "bun run typecheck"
    stomp = true
  }
  ["test"] {
    check = "bun run test:run"
    stomp = true
  }
}

hooks {
  ["pre-commit"] {
    fix = true
    steps {
      ...linters
    }
  }
  ["pre-push"] {
    steps {
      ...checks
    }
  }
  ["pre-merge-commit"] {
    steps {
      ["typecheck"] = checks["typecheck"]
    }
  }
  ["check"] {
    steps {
      ...linters
      ...checks
    }
  }
  ["fix"] {
    fix = true
    steps {
      ...linters
    }
  }
}
```

### 7. Common Commands

- `hk run pre-commit` - ทดสอบ pre-commit
- `hk run pre-push` - ทดสอบ pre-push
- `hk check --all` - ตรวจทั้ง repo
- `hk fix` - แก้ไขไฟล์
- `hk config dump` - ดู effective config
- `hk builtins` - ดูรายการ builtin linters

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- hk ติดตั้งและทำงานผ่าน mise
- `mise.toml` กำหนด tools และ `HK_MISE=1`
- `hk.pkl` กำหนด pre-commit, pre-push, pre-merge-commit
- `hk run` ผ่านทุก hook
- `hk check --all` พร้อมใช้ใน CI
- Lefthook config ถูกลบหรือแทนที่