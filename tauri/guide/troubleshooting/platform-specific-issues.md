---
title: Platform-Specific Issues
description: การแก้ปัญหาที่เฉพาะ platform
---

## Windows: "Antivirus blocking"

**Solution**:
- Add exception to antivirus
- Sign the application
- Use trusted installer

## macOS: "App can't be opened"

**Solution**:
```bash
# Remove quarantine attribute
xattr -cr /path/to/MyApp.app

# Or allow in System Preferences > Security & Privacy
```

## Linux: "Missing dependencies"

**Solution**:
```bash
# Check missing libraries
ldd ./my-app

# Install missing dependencies
sudo apt-get install libwebkit2gtk-4.0-37
```
