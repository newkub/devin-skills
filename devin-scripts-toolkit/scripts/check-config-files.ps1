#!/usr/bin/env pwsh
# check-config-files.ps1
# ตรวจสอบ config files ทีควรมีตาม project type

param([string]$ProjectDir = ".")

$issues = @()

$hasPackage = Test-Path (Join-Path $ProjectDir "package.json")
$hasCargo = Test-Path (Join-Path $ProjectDir "Cargo.toml")

# common files
$common = @('.gitignore')
foreach ($f in $common) {
    if (-not (Test-Path (Join-Path $ProjectDir $f))) {
        $issues += "missing $f"
    }
}

# web/Node project
if ($hasPackage) {
    $hasVite = (Test-Path (Join-Path $ProjectDir "vite.config.ts")) -or (Test-Path (Join-Path $ProjectDir "vite.config.js")) -or (Test-Path (Join-Path $ProjectDir "vite.config.mjs"))
    if (-not $hasVite) {
        $issues += "missing vite.config.{ts,js,mjs}"
    }

    if (-not (Test-Path (Join-Path $ProjectDir "tsconfig.json"))) {
        $issues += "missing tsconfig.json"
    }
}

# Rust project
if ($hasCargo) {
    if (-not (Test-Path (Join-Path $ProjectDir "Cargo.lock")) -and -not (Test-Path (Join-Path $ProjectDir ".\*\Cargo.lock"))) {
        $issues += "missing Cargo.lock"
    }
}

if ($issues.Count -eq 0) {
    Write-Host 'OK: config files look good' -ForegroundColor Green
    exit 0
}

foreach ($issue in $issues) {
    Write-Host ("[Config] " + $issue) -ForegroundColor Yellow
}
exit 1
