#!/usr/bin/env pwsh
# check-techstack.ps1
# ตรวจสอบ tech stack: package.json, Cargo.toml, dependencies, duplicates, engines

param([string]$ProjectDir = ".")

$issues = @()

$packageJson = Join-Path $ProjectDir "package.json"
$cargoToml = Join-Path $ProjectDir "Cargo.toml"

if (Test-Path $packageJson) {
    $pkg = Get-Content $packageJson -Raw | ConvertFrom-Json -AsHashtable
    if ($null -eq $pkg) { $pkg = @{} }

    # dependencies duplicate in devDependencies
    $deps = $pkg['dependencies']
    $devDeps = $pkg['devDependencies']
    if ($deps -and $devDeps) {
        foreach ($d in $deps.Keys) {
            if ($devDeps.ContainsKey($d)) {
                $issues += "package: '$d' appears in both dependencies and devDependencies"
            }
        }
    }

    # engines (info ถ้าไม่มี ไม่ fail)
    if (-not $pkg['engines']) {
        Write-Host "[Techstack] package.json missing engines field (optional)" -ForegroundColor Cyan
    }

    # scripts
    if (-not $pkg['scripts']) {
        $issues += "package.json missing scripts"
    } else {
        $scripts = $pkg['scripts']
        if (-not $scripts.ContainsKey('build')) {
            $issues += "package.json missing script: build"
        }
    }
}

if (Test-Path $cargoToml) {
    $content = Get-Content $cargoToml -Raw
    # workspace root ไม่ต้องมี [package]
    if ($content -notmatch '\[workspace\]') {
        if ($content -notmatch '\[package\]') {
            $issues += "Cargo.toml missing [package] section"
        }
        if ($content -notmatch '^name\s*=') {
            $issues += "Cargo.toml missing name"
        }
        if ($content -notmatch '^version\s*=') {
            $issues += "Cargo.toml missing version"
        }
    } else {
        # workspace root ควรมี members
        if ($content -notmatch 'members\s*=') {
            $issues += "Cargo.toml [workspace] missing members"
        }
    }
}

if (-not (Test-Path $packageJson) -and -not (Test-Path $cargoToml)) {
    $issues += "No package.json or Cargo.toml found"
}

if ($issues.Count -eq 0) {
    Write-Host 'OK: techstack looks good' -ForegroundColor Green
    exit 0
}

foreach ($issue in $issues) {
    Write-Host ("[Techstack] " + $issue) -ForegroundColor Yellow
}
exit 1
