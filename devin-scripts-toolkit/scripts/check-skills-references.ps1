#!/usr/bin/env pwsh
# check-skills-references.ps1
# ตรวจสอบ related references ว่ามี skill ตัวจริงหรือไม่

param(
    [string]$SkillsDir = "$env:APPDATA\devin\skills"
)

function Get-FrontmatterHashtable {
    param([string]$Content)
    if ($Content -notmatch '(?s)^---\r?\n(.*?)\r?\n---\r?\n') { return $null }
    $fm = @{}
    $inRelated = $false
    foreach ($line in $matches[1] -split '\r?\n') {
        if ($line -match '^(\w+):\s*(.*)$') {
            $key = $matches[1].Trim()
            $val = $matches[2].Trim()
            if ($key -eq 'related') {
                $fm[$key] = @()
                $inRelated = $true
            } else {
                $fm[$key] = $val
                $inRelated = $false
            }
        } elseif ($inRelated -and $line -match '^\s*-\s*(.+)$') {
            $fm['related'] += $matches[1].Trim()
        }
    }
    return $fm
}

$issues = [System.Collections.ArrayList]::new()
$existing = (Get-ChildItem -Path $SkillsDir -Directory).Name

foreach ($skillDir in Get-ChildItem -Path $SkillsDir -Directory) {
    $skillFile = Join-Path $skillDir.FullName "SKILL.md"
    if (-not (Test-Path $skillFile)) { continue }

    $content = Get-Content $skillFile -Raw -Encoding UTF8
    $fm = Get-FrontmatterHashtable $content
    if ($null -eq $fm) { continue }

    $related = $fm['related']
    if ($null -eq $related) { continue }

    foreach ($rel in $related) {
        if ($rel -notin $existing) {
            [void]$issues.Add((New-Object psobject -Property @{
                Skill = $skillDir.Name
                Related = $rel
                Issue = "missing related skill: '$rel' not found"
                Severity = "High"
            }))
        }
    }
}

if ($issues.Count -eq 0) {
    Write-Host "OK: all related skills exist" -ForegroundColor Green
    exit 0
}

foreach ($issue in $issues) {
    Write-Host ("[High] {0}: {1}" -f $issue.Skill, $issue.Issue) -ForegroundColor Magenta
}

exit 1
