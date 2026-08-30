#!/usr/bin/env pwsh
# list-skills.ps1
# แสดงรายการ skills พร้อม description

param(
    [string]$SkillsDir = "$env:APPDATA\devin\skills"
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

$skills = Get-ChildItem -Path $SkillsDir -Directory | Where-Object { Test-Path (Join-Path $_.FullName "SKILL.md") }

foreach ($skill in $skills) {
    $skillFile = Join-Path $skill.FullName "SKILL.md"
    $content = Get-Content $skillFile -Raw
    $fm = Get-FrontmatterHashtable $content
    $description = ""
    if ($null -ne $fm -and $fm.ContainsKey('description')) {
        $description = $fm['description']
    }
    Write-Output ("- {0}: {1}" -f $skill.Name, $description)
}
