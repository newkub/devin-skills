### 11. List User Behavior Analysis

แสดง user behavior patterns:

1. รัน `Get-ChildItem -Recurse -Directory -Filter ".git" -ErrorAction SilentlyContinue` เพื่อแสดง git repositories
2. รัน `Get-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\RecentDocs" -ErrorAction SilentlyContinue` เพื่อแสดง recent files
3. รัน `Get-ChildItem $env:USERPROFILE\Documents -Recurse -Filter "*.json" -ErrorAction SilentlyContinue | Select-Object -First 20` เพื่อแสดง recent config files

```powershell
# List git repositories
Get-ChildItem -Recurse -Directory -Filter ".git" -ErrorAction SilentlyContinue | Select-Object Parent

# List recent files
Get-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\RecentDocs" -ErrorAction SilentlyContinue

# List recent config files
Get-ChildItem $env:USERPROFILE\Documents -Recurse -Filter "*.json" -ErrorAction SilentlyContinue | Select-Object -First 20 Name, LastWriteTime
```

### 12. List Development Environment

แสดง development environment:

1. รัน `code --version 2>$null` เพื่อแสดง VS Code version
2. รัน `code --list-extensions 2>$null` เพื่อแสดง VS Code extensions
3. ตรวจสอบ `$env:USERPROFILE\.vscode\extensions` เพื่อแสดง extensions path
4. ตรวจสอบ `$env:USERPROFILE\.vscode\settings.json` เพื่อแสดง settings path

```powershell
# List VS Code version
code --version 2>$null

# List VS Code extensions
code --list-extensions 2>$null

# List VS Code paths
Write-Output "Extensions: $env:USERPROFILE\.vscode\extensions"
Write-Output "Settings: $env:USERPROFILE\.vscode\settings.json"

# Check if VS Code paths exist
Test-Path "$env:USERPROFILE\.vscode\extensions"
Test-Path "$env:USERPROFILE\.vscode\settings.json"
```

### 13. Generate Report

รวบรวมข้อมูลทั้งหมดและรายงานในรูปแบบตารางตาม `/report-markdown-table`:

1. รวบรวมข้อมูลจากทุก steps
2. จัดรูปแบบตารางตาม `/report-markdown-table`
3. ใช้ numbered columns, headers ชัดเจน, alignment ที่เหมาะสม
4. ใช้ symbols (✅, ❌, ⚠️) สำหรับ status
