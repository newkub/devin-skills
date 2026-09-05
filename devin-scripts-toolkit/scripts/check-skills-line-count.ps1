#!/usr/bin/env pwsh
# check-skills-line-count.ps1
# ตรวจสอบว่า SKILL.md ไม่เกิน 250 บรรทัด

param(
    [string]$SkillsDir = "$env:APPDATA\devin\skills",
    [int]$MaxLines = 250
)

$issues = [System.Collections.ArrayList]::new()

foreach ($skillDir in Get-ChildItem -Path $SkillsDir -Directory) {
    $skillFile = Join-Path $skillDir.FullName "SKILL.md"
    if (-not (Test-Path $skillFile)) { continue }

    $lines = (Get-Content $skillFile -Encoding UTF8).Count
    if ($lines -gt $MaxLines) {
        [void]$issues.Add([pscustomobject]@{
            Skill = $skillDir.Name
            Issue = "SKILL.md has $lines lines (max $MaxLines)"
            Severity = "Medium"
        })
    }
}

if ($issues.Count -eq 0) {
    Write-Host "OK: all SKILL.md files within $MaxLines lines" -ForegroundColor Green
    exit 0
}

foreach ($issue in $issues) {
    Write-Host ("[Medium] {0}: {1}" -f $issue.Skill, $issue.Issue) -ForegroundColor Yellow
}

exit 1
