#!/usr/bin/env pwsh
# check-quality.ps1
# รัน lint, typecheck, build ถ้ามีใน package.json

param(
    [string]$ProjectDir = ".",
    [switch]$SkipBuild
)

$packageJson = Join-Path $ProjectDir "package.json"
$issues = @()

if (-not (Test-Path $packageJson)) {
    Write-Host 'OK: no package.json, skip quality checks' -ForegroundColor Cyan
    exit 0
}

$pkg = Get-Content $packageJson -Raw | ConvertFrom-Json -AsHashtable
$scripts = $pkg['scripts']
if (-not $scripts) {
    Write-Host 'OK: no scripts in package.json' -ForegroundColor Cyan
    exit 0
}

$commands = @()
if ($scripts.ContainsKey('lint')) { $commands += 'bun run lint' }
if ($scripts.ContainsKey('typecheck')) { $commands += 'bun run typecheck' }
if (-not $SkipBuild -and $scripts.ContainsKey('build')) { $commands += 'bun run build' }

if ($commands.Count -eq 0) {
    Write-Host 'OK: no lint/typecheck/build scripts found' -ForegroundColor Cyan
    exit 0
}

$fail = $false
foreach ($cmd in $commands) {
    Write-Host "--- Running: $cmd ---" -ForegroundColor Blue
    try {
        $output = & cmd /c $cmd 2>&1
        $exitCode = $LASTEXITCODE
        if ($exitCode -ne 0) {
            $issues += "$cmd failed (exit $exitCode)"
            $fail = $true
        } else {
            Write-Host "OK: $cmd" -ForegroundColor Green
        }
    } catch {
        $issues += "$cmd error: $_"
        $fail = $true
    }
}

if ($fail) {
    foreach ($issue in $issues) {
        Write-Host ("[Quality] " + $issue) -ForegroundColor Red
    }
    exit 1
}

Write-Host 'OK: all quality checks passed' -ForegroundColor Green
exit 0
