#!/usr/bin/env pwsh
# check-skills-frontmatter.ps1
# ตรวจสอบ frontmatter: name, description, name ตรง directory, description ไม่เกิน 100 ตัว

param(
    [string]$SkillsDir = "$env:APPDATA\devin\skills"
)

function Get-FrontmatterHashtable {
    param([string]$Content)
    if ($Content -notmatch '(?s)^---\r?\n(.*?)\r?\n---\r?\n') { return $null }
    $fm = @{}
    foreach ($line in $matches[1] -split '\r?\n') {
        if ($line -match '^(\w+):\s*(.*)$') {
            $key = $matches[1].Trim()
            $val = $matches[2].Trim()
            if ($key -eq 'related') { $fm[$key] = @() } else { $fm[$key] = $val }
        } elseif ($line -match '^\s*-\s*(.+)$' -and $fm.ContainsKey('related')) {
            $fm['related'] += $matches[1].Trim()
        }
    }
    return $fm
}

$issues = [System.Collections.ArrayList]::new()

foreach ($skillDir in Get-ChildItem -Path $SkillsDir -Directory) {
    $skillFile = Join-Path $skillDir.FullName "SKILL.md"
    if (-not (Test-Path $skillFile)) { continue }

    $content = Get-Content $skillFile -Raw
    $fm = Get-FrontmatterHashtable $content

    if ($null -eq $fm) {
        [void]$issues.Add((New-Object psobject -Property @{ Skill = $skillDir.Name; Issue = "missing frontmatter"; Severity = "Critical" }))
        continue
    }

    if (-not $fm.ContainsKey('name') -or [string]::IsNullOrWhiteSpace($fm['name'])) {
        [void]$issues.Add((New-Object psobject -Property @{ Skill = $skillDir.Name; Issue = "missing name"; Severity = "Critical" }))
    } elseif ($fm['name'] -ne $skillDir.Name) {
        [void]$issues.Add((New-Object psobject -Property @{ Skill = $skillDir.Name; Issue = "name '$($fm['name'])' does not match directory"; Severity = "Critical" }))
    }

    if (-not $fm.ContainsKey('description') -or [string]::IsNullOrWhiteSpace($fm['description'])) {
        [void]$issues.Add((New-Object psobject -Property @{ Skill = $skillDir.Name; Issue = "missing description"; Severity = "High" }))
    } elseif ($fm['description'].Length -gt 100) {
        [void]$issues.Add((New-Object psobject -Property @{ Skill = $skillDir.Name; Issue = "description too long ($($fm['description'].Length) > 100)"; Severity = "Low" }))
    }
}

if ($issues.Count -eq 0) {
    Write-Host "OK: all frontmatter valid" -ForegroundColor Green
    exit 0
}

foreach ($issue in $issues) {
    $color = switch ($issue.Severity) { "Critical" { "Red" } "High" { "Magenta" } "Low" { "Yellow" } default { "Cyan" } }
    Write-Host ("[{0}] {1}: {2}" -f $issue.Severity, $issue.Skill, $issue.Issue) -ForegroundColor $color
}

exit 1
