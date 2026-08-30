#!/usr/bin/env pwsh
# fix-skills-mentions.ps1
# Auto-fix orphan related references โดยเพิ่ม mention เข้าไปใน Rules section
# WARNING: ใช้ -WhatIf ก่อนเสมอ

param(
    [string]$SkillsDir = "$env:APPDATA\devin\skills",
    [Parameter(Mandatory = $true)]
    [string[]]$Skills,
    [switch]$WhatIf,
    [switch]$Backup
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

function Remove-Urls {
    param([string]$Body)
    $result = $Body -replace '\[.*?\]\(https?://[^\s\)]+\)', ' '
    $result = $result -replace 'https?://[^\s\)\]>]+', ' '
    return $result
}

function Find-MissingMentions {
    param([string]$Content)
    $fm = Get-FrontmatterHashtable $Content
    $body = Remove-Urls (Get-Body $Content)
    if ($null -eq $fm -or $null -eq $body) { return @() }

    $related = $fm['related']
    if ($null -eq $related) { return @() }

    $missing = @()
    foreach ($rel in $related) {
        $found = $false
        if ($body -match ('\b' + [regex]::Escape($rel) + '\b')) { $found = $true }
        if (-not $found -and ($body -match ('(?<![a-zA-Z0-9-])\/' + [regex]::Escape($rel) + '(?![a-zA-Z0-9-])'))) { $found = $true }
        if (-not $found -and ($body -match ('`\/' + [regex]::Escape($rel) + '`'))) { $found = $true }
        if (-not $found) { $missing += $rel }
    }
    return $missing
}

function Add-MentionsToRules {
    param([string]$Body, [string[]]$MissingSkills)
    $lines = $Body -split '\r?\n'
    $rulesIndex = -1
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '^## Rules\s*$') { $rulesIndex = $i; break }
    }

    if ($rulesIndex -eq -1) {
        # ถ้าไม่มี Rules ให้เพิ่มท้าย
        $newSection = "`n## Rules`n`n"
        foreach ($s in $MissingSkills) { $newSection += "- ใช้ `/$s` ถ้าจำเป็น`n" }
        return $Body + $newSection
    }

    # หา end of Rules section
    $endIndex = $rulesIndex + 1
    for ($i = $rulesIndex + 1; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '^## ') { $endIndex = $i; break }
        $endIndex = $i + 1
    }

    $newLines = @()
    for ($i = 0; $i -lt $endIndex; $i++) { $newLines += $lines[$i] }
    if ($newLines[-1] -ne '') { $newLines += '' }
    foreach ($s in $MissingSkills) { $newLines += "- ใช้ `/$s` ถ้าจำเป็น" }
    $newLines += ''
    for ($i = $endIndex; $i -lt $lines.Count; $i++) { $newLines += $lines[$i] }

    return $newLines -join "`n"
}

$changed = 0

foreach ($skillName in $Skills) {
    $skillFile = Join-Path $SkillsDir $skillName "SKILL.md"
    if (-not (Test-Path $skillFile)) {
        Write-Host "[$skillName] SKILL.md not found" -ForegroundColor Red
        continue
    }

    $content = Get-Content $skillFile -Raw
    $missing = Find-MissingMentions $content
    if ($missing.Count -eq 0) {
        Write-Host "[$skillName] OK: no missing mentions" -ForegroundColor Green
        continue
    }

    Write-Host "[$skillName] missing: $($missing -join ', ')" -ForegroundColor Yellow

    if ($WhatIf) {
        Write-Host "[$skillName] WhatIf: would add to Rules" -ForegroundColor Cyan
        continue
    }

    # Backup
    if ($Backup) {
        $backupPath = $skillFile + ".backup"
        Copy-Item $skillFile $backupPath -Force
        Write-Host "[$skillName] backup: $backupPath" -ForegroundColor Cyan
    }

    $fmMatch = [regex]::Match($content, '(?s)^(---\r?\n.*?\r?\n---\r?\n)')
    $frontmatter = $fmMatch.Groups[1].Value
    $body = $content.Substring($frontmatter.Length)

    $newBody = Add-MentionsToRules $body $missing
    $newContent = $frontmatter + $newBody

    Set-Content -Path $skillFile -Value $newContent -NoNewline
    $changed++
    Write-Host "[$skillName] fixed" -ForegroundColor Green
}

Write-Host "Done. Fixed $changed skill(s)." -ForegroundColor Green
