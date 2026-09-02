# Phase 1: Remove ** bold markers from skills
# Replaces **text** with text (plain removal)

$skillsDir = $PSScriptRoot | Split-Path

$csv = Import-Csv (Join-Path $skillsDir "validate-all-findings.csv")
$styleSkills = $csv | Where-Object { $_.Category -eq "style" } | ForEach-Object { $_.Skill } | Sort-Object -Unique

$fixed = 0
$skipped = 0

foreach ($skillName in $styleSkills) {
    $skillFile = Join-Path $skillsDir "$skillName\SKILL.md"
    if (-not (Test-Path $skillFile)) { $skipped++; continue }

    $content = Get-Content $skillFile -Raw
    $original = $content

    # Remove **text** -> text (bold markers)
    # Match ** followed by non-* content followed by **
    $content = [regex]::Replace($content, '\*\*([^*]+?)\*\*', '$1')

    if ($content -ne $original) {
        Set-Content -Path $skillFile -Value $content -NoNewline
        $fixed++
        Write-Output "FIXED: $skillName"
    } else {
        $skipped++
        Write-Output "SKIP: $skillName (no change)"
    }
}

Write-Output "---"
Write-Output "Fixed: $fixed"
Write-Output "Skipped: $skipped"
