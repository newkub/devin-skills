#Requires -Version 5.1
<#
.SYNOPSIS
  Scan devin skills repo for broken skill references in SKILL.md files.

.DESCRIPTION
  Reads every SKILL.md in the target directory, extracts /skill-name
  references from the body and related: entries from frontmatter, then
  compares them against the set of skill directories that actually exist.
  Reports broken references grouped by skill.

.PARAMETER Root
  Root directory of the devin skills repo. Defaults to %APPDATA%\devin\skills.

.EXAMPLE
  .\check-broken-refs.ps1
  .\check-broken-refs.ps1 -Root D:\repo\my-skills
#>
[CmdletBinding()]
param(
    [string]$Root = (Join-Path $env:APPDATA 'devin\skills')
)

if (-not (Test-Path $Root)) {
    Write-Error "Target directory not found: $Root"
    exit 1
}

# 1. Inventory all skills
$skillDirs = Get-ChildItem -Path $Root -Directory | Where-Object {
    (Test-Path (Join-Path $_.FullName 'SKILL.md')) -and
    $_.Name -notmatch '^(\.git|scripts|node_modules)$'
}
$skillSet = [System.Collections.Generic.HashSet[string]]::new()
foreach ($d in $skillDirs) { [void]$skillSet.Add($d.Name) }

Write-Output "=== INVENTORY ==="
Write-Output "Total skills: $($skillSet.Count)"
Write-Output ""

# 2. Scan references in each SKILL.md
$bodyBroken   = @{}
$relatedBroken = @{}
$bodyChecked   = 0
$relatedChecked = 0

foreach ($skill in $skillDirs) {
    $skillFile = Join-Path $skill.FullName 'SKILL.md'
    $content   = [System.IO.File]::ReadAllText($skillFile, [System.Text.Encoding]::UTF8)

    # --- Body references: /skill-name patterns ---
    # Strip frontmatter to avoid matching frontmatter keys
    $body = $content
    if ($content -match '(?s)^---\s*\r?\n(.*?)\r?\n---\s*\r?\n') {
        $body = $content.Substring($matches[0].Length)
    }
    $bodyRefs = [regex]::Matches($body, '/([a-z][a-z0-9]+(?:-[a-z0-9]+)+)')
    foreach ($r in $bodyRefs) {
        $name = $r.Groups[1].Value
        $bodyChecked++
        if (-not $skillSet.Contains($name)) {
            if (-not $bodyBroken.ContainsKey($skill.Name)) { $bodyBroken[$skill.Name] = @() }
            if ($name -notin $bodyBroken[$skill.Name]) { $bodyBroken[$skill.Name] += $name }
        }
    }

    # --- Related field in frontmatter ---
    if ($content -match '(?s)^---\s*\r?\n(.*?)\r?\n---\s*\r?\n') {
        $fm = $matches[1]
        $inRelated = $false
        foreach ($line in ($fm -split "`n")) {
            if ($line -match '^\s*related:\s*$') { $inRelated = $true; continue }
            if ($line -match '^\s*-\s*(.+?)\s*$') {
                if ($inRelated) {
                    $rel = $matches[1].Trim().Trim("'").Trim('"')
                    $relatedChecked++
                    if (-not $skillSet.Contains($rel)) {
                        if (-not $relatedBroken.ContainsKey($skill.Name)) { $relatedBroken[$skill.Name] = @() }
                        if ($rel -notin $relatedBroken[$skill.Name]) { $relatedBroken[$skill.Name] += $rel }
                    }
                }
            } elseif ($line -match '^\s*\S') {
                $inRelated = $false
            }
        }
    }
}

# 3. Report
Write-Output "=== SCAN RESULTS ==="
Write-Output "Body references checked: $bodyChecked"
Write-Output "Related entries checked: $relatedChecked"
Write-Output ""

$criticalCount = ($relatedBroken.Values | Measure-Object).Count
$warningCount  = ($bodyBroken.Values | Measure-Object).Count

Write-Output "=== BROKEN REFERENCES ==="
Write-Output "Critical (broken related:): $criticalCount"
Write-Output "Warning (broken body /ref): $warningCount"
Write-Output ""

if ($criticalCount -gt 0) {
    Write-Output "--- CRITICAL: broken related: entries ---"
    foreach ($k in ($relatedBroken.Keys | Sort-Object)) {
        Write-Output "  $k -> $($relatedBroken[$k] -join ', ')"
    }
    Write-Output ""
}

if ($warningCount -gt 0) {
    Write-Output "--- WARNING: broken body /skill-name refs ---"
    foreach ($k in ($bodyBroken.Keys | Sort-Object)) {
        Write-Output "  $k -> $($bodyBroken[$k] -join ', ')"
    }
    Write-Output ""
}

if ($criticalCount -eq 0 -and $warningCount -eq 0) {
    Write-Output "no broken references found"
} else {
    Write-Output "=== RECOMMENDED NEXT ACTIONS ==="
    if ($criticalCount -gt 0) {
        Write-Output "- Run /update-references to fix broken related: entries"
    }
    if ($warningCount -gt 0) {
        Write-Output "- Run /update-references to fix broken body /skill-name refs"
    }
}
