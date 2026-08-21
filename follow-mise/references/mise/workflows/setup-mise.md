---
description: ติดตั้งและตั้งค่า mise สำหรับ development
---

## Goal

ติดตั้ง mise และตั้งค่า shell integration

## Execute

### 1. ติดตั้ง mise

```bash
# Linux/macOS
curl https://mise.run | sh

# macOS (Homebrew)
brew install mise

# Windows (Scoop)
scoop install mise
```

### 2. ตั้งค่า Shell Integration

```bash
# Bash/Zsh
echo 'eval "$(mise activate bash)"' >> ~/.bashrc

# Fish
echo 'eval (mise activate fish)' >> ~/.config/fish/config.fish

# PowerShell
Invoke-Expression (&mise activate powershell)
```

### 3. ตรวจสอบ Installation

```bash
mise --version
```

### 4. ตั้งค่า Global Config

```bash
# สร้าง global config
mise settings set legacy_version_file true
```

## Expected Outcome

- mise ติดตั้งและพร้อมใช้งาน
- Shell integration ทำงานอัตโนมัติ
- สามารถใช้ `mise` commands ได้ทันที
