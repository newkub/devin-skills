#!/usr/bin/env pwsh
# fix-skill-names.ps1
# ตรวจสอบและแก้ไข name ใน frontmatter ให้ตรงกับ directory name

param(
    [string]$SkillsDir = "$env:APPDATA\devin\skills",
    [switch]$WhatIf
)

function Get-FrontmatterHashtable {
    param([string]$Content)
    if ($Content -notmatch '(?s)^---\r?\n(.*?)\r?\n---\r?\n') {
        return $null
    }
    $fm = @{}
    foreach ($line in $matches[1] -split '\r?\n') {
        if ($line -match '^(\w+):\s*(.*)$') {
            $key = $matches[1].Trim()
            $val = $matches[2].Trim()
            if ($key -eq 'related') {
                $fm[$key] = @()
            } else {
                $fm[$key] = $val
            }
        } elseif ($line -match '^\s*-\s*(.+)$' -and $fm.ContainsKey('related')) {
            $fm['related'] += $matches[1].Trim()
        }
    }
    return $fm
}

$fixed = @()

foreach ($skillDir in Get-ChildItem -Path $SkillsDir -Directory) {
    $skillFile = Join-Path $skillDir.FullName "SKILL.md"
    if (-not (Test-Path $skillFile)) { continue }

    $content = Get-Content $skillFile -Raw
    $fm = Get-FrontmatterHashtable $content
    if ($null -eq $fm) { continue }

    if ($fm.ContainsKey('name')) {
        $name = $fm['name']
        if ($name -ne $skillDir.Name) {
            if (-not $WhatIf) {
                $newContent = $content -replace "^(name:\s*)$([regex]::Escape($name))\s*\r?\n", "name: $($skillDir.Name)`n"
                Set-Content -Path $skillFile -Value $newContent -NoNewline
            }
            $fixed += @{ Skill = $skillDir.Name; Old = $name; New = $skillDir.Name }
        }
    }
}

if ($fixed.Count -eq 0) {
    Write-Host "OK: all skill names match directory" -ForegroundColor Green
    exit 0
}

$fixed | ForEach-Object {
    Write-Host ("[Fixed] {0}: name '{1}' -> '{2}'" -f $_.Skill, $_.Old, $_.New) -ForegroundColor Cyan
}

if ($WhatIf) {
    Write-Host "(WhatIf: no changes written)" -ForegroundColor Yellow
}
