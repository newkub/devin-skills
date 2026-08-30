#!/usr/bin/env pwsh
# check-skills-mentions.ps1

param(
    [string]$SkillsDir = "$env:APPDATA\devin\skills",
    [string]$FilterSkill = ""
)

function Get-FrontmatterHashtable {
    param([string]$Content)
    if ($Content -notmatch '(?s)^---\r?\n(.*?)\r?\n---\r?\n') { return $null }
    $fm = @{}
    foreach ($line in $matches[1] -split '\r?\n') {
        if ($line -match '^(\w+):\s*(.*)$') {
            $k = $matches[1].Trim(); $v = $matches[2].Trim()
            if ($k -eq 'related') { $fm[$k] = @() } else { $fm[$k] = $v }
        } elseif ($line -match '^\s*-\s*(.+)$' -and $fm.ContainsKey('related')) {
            $fm['related'] += $matches[1].Trim()
        }
    }
    return $fm
}

function Get-Body {
    param([string]$Content)
    if ($Content -match '(?s)^---\r?\n.*?\r?\n---\r?\n(.*)$') { return $matches[1] }
    return $null
}

function Remove-UrlsFromBody {
    param([string]$Body)
    # ลบ markdown links และ URLs เปลือยๆ
    $result = $Body -replace '\[.*?\]\(https?://[^\s\)]+\)', ' '
    $result = $result -replace 'https?://[^\s\)\]>]+', ' '
    return $result
}

$issues = @()

foreach ($skillDir in Get-ChildItem -Path $SkillsDir -Directory) {
    $skillFile = Join-Path $skillDir.FullName "SKILL.md"
    if (-not (Test-Path $skillFile)) { continue }

    $content = Get-Content $skillFile -Raw
    $fm = Get-FrontmatterHashtable $content
    $body = Remove-UrlsFromBody (Get-Body $content)

    if ($null -eq $fm -or $null -eq $body) {
        $issues += New-Object psobject -Property @{ Skill = $skillDir.Name; Issue = 'no frontmatter'; Severity = 'High' }
        continue
    }

    $related = $fm['related']
    if ($null -eq $related) { continue }

    foreach ($rel in $related) {
        $found = $false

        # Pattern 1: plain skill name with word boundary
        if ($body -match ('\b' + [regex]::Escape($rel) + '\b')) { $found = $true }

        # Pattern 2: /skill-name with boundary (not part of URL path)
        if (-not $found -and ($body -match ('(?<![a-zA-Z0-9-])\/' + [regex]::Escape($rel) + '(?![a-zA-Z0-9-])'))) { $found = $true }

        # Pattern 3: `/skill-name` in backticks
        if (-not $found -and ($body -match ('`\/' + [regex]::Escape($rel) + '`'))) { $found = $true }

        if (-not $found) {
            $msg = 'related ' + $rel + ' not mentioned in content'
            $issues += New-Object psobject -Property @{ Skill = $skillDir.Name; Related = $rel; Issue = $msg; Severity = 'Medium' }
        }
    }
}

if ($issues.Count -eq 0) {
    Write-Host 'OK: all related skills are mentioned in content' -ForegroundColor Green
    exit 0
}

$shown = 0
foreach ($issue in $issues) {
    if ($FilterSkill -ne '' -and $issue.Skill -ne $FilterSkill) { continue }
    $shown++
    $color = switch ($issue.Severity) { 'Critical' { 'Red' } 'High' { 'Magenta' } 'Medium' { 'Yellow' } default { 'Cyan' } }
    Write-Host ('[' + $issue.Severity + '] ' + $issue.Skill + ': ' + $issue.Issue) -ForegroundColor $color
}

if ($shown -eq 0) {
    Write-Host 'OK: all related skills are mentioned in content' -ForegroundColor Green
    exit 0
}

exit 1
