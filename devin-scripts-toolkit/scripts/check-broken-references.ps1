#!/usr/bin/env pwsh
# check-broken-references.ps1
# ตรวจสอบ broken skill references ใน .md files

param(
    [string]$ProjectDir = ".",
    [string]$SkillsDir = "$env:APPDATA\devin\skills"
)

$issues = @()

$existingSkills = (Get-ChildItem -Path $SkillsDir -Directory -ErrorAction SilentlyContinue).Name

$mdFiles = Get-ChildItem -Path $ProjectDir -Recurse -Filter "*.md" -File -ErrorAction SilentlyContinue
foreach ($file in $mdFiles) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }

    # หา `/skill-name` references ทีมี backticks หรือเป้นคำอ้างอิง
    $matches = [regex]::Matches($content, '(?<=^|[\s\(\[\{`"''])/([a-z][a-z0-9-]*)')
    foreach ($m in $matches) {
        $skill = $m.Groups[1].Value
        if ($skill -notin $existingSkills) {
            $issues += "$($file.FullName): /$skill not found"
        }
    }

    # หา URLs
    $urlMatches = [regex]::Matches($content, '\[.*?\]\((https?://[^\s\)]+)\)')
    foreach ($m in $urlMatches) {
        $url = $m.Groups[1].Value
        if ($url -match '\(\)|\[\]$' -or $url -match ' ') {
            $issues += "$($file.FullName): suspicious URL '$url'"
        }
    }
}

if ($issues.Count -eq 0) {
    Write-Host 'OK: no broken references found' -ForegroundColor Green
    exit 0
}

# จำกัด output ถ้าเยอะ
$limit = 50
$shown = $issues | Select-Object -First $limit
foreach ($issue in $shown) {
    Write-Host ("[References] " + $issue) -ForegroundColor Yellow
}
if ($issues.Count -gt $limit) {
    Write-Host ("... and " + ($issues.Count - $limit) + " more") -ForegroundColor Cyan
}
exit 1
