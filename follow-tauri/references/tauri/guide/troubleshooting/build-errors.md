---
title: Build Errors
description: การแก้ปัญหา build errors ที่พบบ่อย
---

## Error: "error: linker `link.exe` not found"

**Cause**: Visual Studio Build Tools ไม่ได้ติดตั้งบน Windows

**Solution**:
```bash
# ติดตั้ง Visual Studio Build Tools
# Download: https://visualstudio.microsoft.com/downloads/
# เลือก "Desktop development with C++"
```

## Error: "error: failed to run custom build command"

**Cause**: OpenSSL หรือ system dependencies ขาด

**Solution**:
```bash
# Windows
vcpkg install openssl:x64-windows-static

# macOS
brew install openssl

# Linux
sudo apt-get install libssl-dev pkg-config
```
