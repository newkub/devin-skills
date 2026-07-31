# CLI Commands

CLI commands สำหรับ mise

## Installation

```bash
# curl (Linux/macOS)
curl https://mise.run | sh

# Homebrew
brew install mise

# Windows (Scoop)
scoop install mise
```

## Core Commands

| Command | Description |
|---------|-------------|
| `mise use <tool>@<version>` | กำหนด tool version สำหรับ project |
| `mise install <tool>@<version>` | ติดตั้ง tool version |
| `mise list` | แสดง installed tools |
| `mise list <tool>` | แสดง versions ของ tool |
| `mise current` | แสดง current tool versions |
| `mise upgrade <tool>` | upgrade tool ไป version ใหม่ |

## Plugin Commands

| Command | Description |
|---------|-------------|
| `mise plugins` | แสดง installed plugins |
| `mise plugins install <name>` | ติดตั้ง plugin |
| `mise plugins update` | update plugins |

## Config Commands

| Command | Description |
|---------|-------------|
| `mise settings` | แสดง settings |
| `mise settings set <key> <value>` | ตั้งค่า |
| `mise env` | แสดง environment variables |
| `mise exec -- <command>` | รัน command กับ mise environment |

## Options

| Option | Description |
|--------|-------------|
| `--version` | แสดง version |
| `--help` | แสดง help |
| `-v` | verbose output |
| `--json` | JSON output |
