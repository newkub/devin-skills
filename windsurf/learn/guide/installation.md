# Installation Guide

## Purpose

วิธีการติดตั้ง Windsurf (Devin Desktop IDE) สำหรับ Windows, macOS, และ Linux

## Installation

### Windows

1. Download Windsurf จาก https://devin.ai/desktop
2. Run installer (.exe)
3. Follow installation wizard
4. Launch Windsurf from Start Menu

### macOS

1. Download Windsurf จาก https://devin.ai/desktop
2. Open .dmg file
3. Drag Windsurf to Applications folder
4. Launch from Applications

### Linux

1. Download Windsurf จาก https://devin.ai/desktop
2. Extract .tar.gz or .AppImage
3. For AppImage: `chmod +x Windsurf.AppImage` แล้ว run
4. For tar.gz: Extract และ run binary

## Import Settings

หลังจากติดตั้ง คุณสามารถ import settings จาก:
- VS Code
- Cursor

เลือก option ระหว่าง onboarding flow

## System Requirements

- **Windows**: Windows 10 หรือใหม่กว่า
- **macOS**: macOS 10.15 หรือใหม่กว่า
- **Linux**: ส่วนใหญ่รองรับ (Ubuntu, Fedora, Debian, etc.)

## Troubleshooting

### macOS: "Windsurf is damaged"

ถ้าเจอ popup นี้บน macOS:
```bash
xattr -cr /Applications/Windsurf.app
```

### Windows: Update errors

ถ้าเจอ error เกี่ยวกับ updates:
1. Check Windows Defender settings
2. Ensure network connection stable
3. Try reinstalling

## Summary

| Platform | Download | Installation |
|----------|----------|---------------|
| **Windows** | .exe installer | Run installer |
| **macOS** | .dmg file | Drag to Applications |
| **Linux** | .AppImage / .tar.gz | chmod +x or extract |
