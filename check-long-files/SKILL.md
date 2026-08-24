---
name: check-long-files
description: ตรวจสอบและรายงานไฟล์ที่ยาวกว่า threshold ด้วย PowerShell script
---

## Goal

ตรวจสอบและรายงานไฟล์ที่มีจำนวนบรรทัดเกิน threshold ที่กำหนด

## Scope

ใช้สำหรับตรวจสอบไฟล์ทุกประเภทใน workspace โดยไม่แก้ไขไฟล์ต้นฉบับ

## Execute

### 1. Create Script

> Goal: สร้าง script PowerShell สำหรับตรวจสอบไฟล์ยาว

1. ตรวจสอบว่ามี `scripts/check-long-files.ps1` อยู่แล้วหรือไม่
2. ถ้าไม่มี ให้สร้าง script ด้วยเนื้อหาด้านล่าง
3. Script ควรอยู่ใน `scripts/` directory ที่ root ของ project

### 2. Run Script

> Goal: รัน script ที่สร้างไว้

1. รันคำสั่ง `pwsh -NoProfile -File scripts/check-long-files.ps1`
2. รับผลลัพธ์: รายการไฟล์ที่เกิน threshold เรียงจากมากไปน้อย

### Script Content

```powershell
$threshold = 250
$excludePatterns = @('node_modules', '.turbo', '.solid', 'dist', 'build', '.output', 'coverage', '.git', '.wrangler')

$results = Get-ChildItem -Path . -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx |
    Where-Object {
        $file = $_
        -not ($excludePatterns | Where-Object { $file.FullName -match $_ })
    } |
    ForEach-Object {
        $lines = (Get-Content $_.FullName -ErrorAction SilentlyContinue | Measure-Object -Line).Lines
        if ($lines -gt $threshold) {
            [PSCustomObject]@{
                File = $_.FullName.Replace((Get-Location).Path + '\', '')
                Lines = $lines
            }
        }
    }

if ($results) {
    $results | Sort-Object Lines -Descending | Format-Table -AutoSize
    Write-Host "`nTotal files exceeding $threshold lines: $($results.Count)"
} else {
    Write-Host "No files exceeding $threshold lines found."
}
```

### Parameters

- threshold: เปลี่ยนตัวเลข `250` ใน script เป็นค่าที่ต้องการ เช่น `200`, `300`
- excludePatterns: เพิ่ม pattern ที่ต้องการ exclude ใน array

## Rules

### 1. File Discovery

- ใช้ `Get-ChildItem -Recurse -File` สำหรับค้นหาไฟล์
- กรองด้วย `-Include *.ts,*.tsx,*.js,*.jsx` สำหรับไฟล์ source code
- Exclude patterns: `node_modules`, `.turbo`, `.solid`, `dist`, `build`, `.output`, `coverage`, `.git`, `.wrangler`

### 2. Line Counting

- ใช้ `Get-Content` สำหรับอ่านไฟล์
- ใช้ `Measure-Object -Line` สำหรับนับจำนวนบรรทัด
- ข้ามไฟล์ที่อ่านไม่ได้ด้วย `ErrorAction SilentlyContinue`

### 3. Threshold And Output

- กรองเฉพาะไฟล์ที่มากกว่า threshold ที่กำหนด (default 250)
- เรียงลำดับตามจำนวนบรรทัดจากมากไปน้อย
- แสดงชื่อไฟล์และจำนวนบรรทัดในรูปแบบตาราง
- แสดงจำนวนไฟล์ทั้งหมดที่เกิน threshold

### 4. Script Management

- Script อยู่ใน `scripts/check-long-files.ps1`
- สร้าง script ก่อนรัน ไม่ใช้ inline command
- Script สามารถแก้ไข threshold และ patterns ได้ง่าย
- ไม่แก้ไขไฟล์ใด ๆ ใน workspace นอกจาก script ที่สร้าง

## Expected Outcome

- Script ถูกสร้างใน `scripts/check-long-files.ps1`
- รายงานไฟล์ที่ยาวกว่า threshold ที่กำหนด
- แสดงชื่อไฟล์และจำนวนบรรทัด
- เรียงลำดับตามจำนวนบรรทัดจากมากไปน้อย
- แสดงจำนวนไฟล์ทั้งหมดที่เกิน threshold
