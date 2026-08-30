#!/usr/bin/env pwsh
# devin-skills-audit.ps1
# รวมการตรวจสอบ skills ทั้งหมด

param(
    [string]$SkillsDir = "$env:APPDATA\devin\skills"
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$fail = $false

$checks = @(
    @{ Name = "frontmatter"; Script = "check-skills-frontmatter.ps1" },
    @{ Name = "references"; Script = "check-skills-references.ps1" },
    @{ Name = "mentions"; Script = "check-skills-mentions.ps1" },
    @{ Name = "line-count"; Script = "check-skills-line-count.ps1" }
)

foreach ($check in $checks) {
    $script = Join-Path $scriptDir $check.Script
    Write-Host "`n--- Running: $($check.Name) ---" -ForegroundColor Blue
    if (Test-Path $script) {
        & $script -SkillsDir $SkillsDir
        if ($LASTEXITCODE -ne 0) { $fail = $true }
    } else {
        Write-Host "Script not found: $script" -ForegroundColor Red
        $fail = $true
    }
}

Write-Host "`n--- Audit complete ---" -ForegroundColor Blue
if ($fail) {
    Write-Host "Some checks failed." -ForegroundColor Red
    exit 1
} else {
    Write-Host "All checks passed." -ForegroundColor Green
    exit 0
}
