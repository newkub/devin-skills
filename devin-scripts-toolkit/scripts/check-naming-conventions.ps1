#!/usr/bin/env pwsh
# check-naming-conventions.ps1
# ตรวจสอบ naming conventions สำหรับ project files

param([string]$ProjectDir = ".")

$issues = @()

# ตรวจ skill ถ้าเป็น skills repo
$skillsDir = Join-Path $ProjectDir "skills"
if (-not (Test-Path $skillsDir)) {
    $skillsDir = $ProjectDir
}

foreach ($dir in Get-ChildItem -Path $skillsDir -Directory -ErrorAction SilentlyContinue) {
    $skillFile = Join-Path $dir.FullName "SKILL.md"
    if (-not (Test-Path $skillFile)) { continue }

    $content = Get-Content $skillFile -Raw
    if ($content -match '(?s)^---\r?\n(.*?)\r?\n---\r?\n') {
        $fm = $matches[1]
        if ($fm -match '^name:\s*(.+)$') {
            $name = $matches[1].Trim()
            if ($name -ne $dir.Name) {
                $issues += "skill '$($dir.Name)' name '$name' does not match directory"
            }
        }
    }
}

# ตรวจ file names
$badFiles = @()
$allFiles = Get-ChildItem -Path $ProjectDir -Recurse -File -ErrorAction SilentlyContinue
foreach ($file in $allFiles) {
    $name = $file.Name
    # ตรวจ spaces
    if ($name -match ' ') {
        $issues += "file has spaces: $($file.FullName)"
    }
    # ตรวจ uppercase นอก PascalCase
    if ($name -cmatch '^[a-z]+[A-Z]') {
        # likely camelCase, warn if not in src/components
    }
}

if ($issues.Count -eq 0) {
    Write-Host 'OK: naming conventions look good' -ForegroundColor Green
    exit 0
}

foreach ($issue in $issues) {
    Write-Host ("[Naming] " + $issue) -ForegroundColor Yellow
}
exit 1
