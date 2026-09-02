# Validate all skills in the repo
# Checks: line count, frontmatter, sections, name match, description length, TODO/MOCK, bold markers

$root = $PSScriptRoot | Split-Path | Split-Path
$skillsDir = Join-Path $root "skills"
if (-not (Test-Path $skillsDir)) { $skillsDir = $root }

$findings = @()
$skills = Get-ChildItem -Directory $skillsDir | Where-Object { Test-Path "$($_.FullName)\SKILL.md" }

foreach ($skill in $skills) {
    $skillName = $skill.Name
    $skillFile = Join-Path $skill.FullName "SKILL.md"
    $content = Get-Content $skillFile -Raw -Encoding UTF8
    $lines = Get-Content $skillFile -Encoding UTF8
    $lineCount = $lines.Count

    # Line count
    if ($lineCount -gt 250) {
        $findings += [PSCustomObject]@{
            Skill = $skillName; Category = "line-count"; Severity = "High";
            Finding = "SKILL.md exceeds 250 lines ($lineCount)";
            Evidence = "$skillFile`:$lineCount"
        }
    }

    # Frontmatter: name
    $nameMatch = [regex]::Match($content, '(?ms)^---\r?\n.*?name:\s*(.+?)\r?\n.*?^---')
    if ($nameMatch.Success) {
        $fmName = $nameMatch.Groups[1].Value.Trim()
        if ($fmName -ne $skillName) {
            $findings += [PSCustomObject]@{
                Skill = $skillName; Category = "frontmatter"; Severity = "High";
                Finding = "name '$fmName' != directory '$skillName'";
                Evidence = $skillFile
            }
        }
    } else {
        $findings += [PSCustomObject]@{
            Skill = $skillName; Category = "frontmatter"; Severity = "Critical";
            Finding = "Missing or invalid frontmatter";
            Evidence = $skillFile
        }
    }

    # Frontmatter: description
    $descMatch = [regex]::Match($content, '(?ms)^---\r?\n.*?description:\s*(.+?)\r?\n.*?^---')
    if ($descMatch.Success) {
        $desc = $descMatch.Groups[1].Value.Trim().Trim('"').Trim("'")
        if ($desc.Length -gt 100) {
            $findings += [PSCustomObject]@{
                Skill = $skillName; Category = "frontmatter"; Severity = "Medium";
                Finding = "description too long ($($desc.Length) > 100)";
                Evidence = $skillFile
            }
        }
    } else {
        $findings += [PSCustomObject]@{
            Skill = $skillName; Category = "frontmatter"; Severity = "High";
            Finding = "Missing description in frontmatter";
            Evidence = $skillFile
        }
    }

    # Required sections
    $requiredSections = @("## Goal", "## Scope", "## Execute", "## Rules", "## Expected Outcome")
    foreach ($sec in $requiredSections) {
        if ($content -notmatch [regex]::Escape($sec)) {
            $findings += [PSCustomObject]@{
                Skill = $skillName; Category = "sections"; Severity = "Medium";
                Finding = "Missing section: $sec";
                Evidence = $skillFile
            }
        }
    }

    # TODO/MOCK/placeholder (excluding tool names and instructions about them)
    $todoMatches = $lines | Select-String -Pattern 'TODO|MOCK|placeholder' -CaseSensitive:$false |
        Where-Object {
            $_.Line -notmatch 'ลบ TODO|remove TODO|delete TODO|ลบ MOCK|remove MOCK|FAKE|STUB|todo_write|`TODO`|`MOCK`|`FIXME`|`STUB`|`FAKE`|// TODO|// MOCK|# TODO|# MOCK'
        }
    if ($todoMatches) {
        $findings += [PSCustomObject]@{
            Skill = $skillName; Category = "content"; Severity = "Medium";
            Finding = "Contains TODO/MOCK/placeholder text";
            Evidence = ($todoMatches | ForEach-Object { "$($_.LineNumber): $($_.Line.Trim())" }) -join "; "
        }
    }

    # Bold markers (exclude ** inside backticks which are instructions about bold)
    $boldMatches = $lines | Select-String -Pattern '\*\*' |
        Where-Object { $_.Line -notmatch '`\*\*`|`\*\*' -and $_.Line -notmatch 'bold markers' }
    if ($boldMatches) {
        $findings += [PSCustomObject]@{
            Skill = $skillName; Category = "style"; Severity = "Low";
            Finding = "Contains ** bold markers";
            Evidence = ($boldMatches | Select-Object -First 3 | ForEach-Object { "L$($_.LineNumber)" }) -join ", "
        }
    }

    # Execute steps > 10 (only count within ## Execute section)
    $inExecute = $false
    $execStepCount = 0
    foreach ($line in $lines) {
        if ($line -match '^## Execute') { $inExecute = $true; continue }
        if ($line -match '^## Rules') { $inExecute = $false; break }
        if ($inExecute -and $line -match '^### \d+\.') { $execStepCount++ }
    }
    if ($execStepCount -gt 10) {
        $findings += [PSCustomObject]@{
            Skill = $skillName; Category = "sections"; Severity = "Medium";
            Finding = "Execute has more than 10 steps ($execStepCount)";
            Evidence = $skillFile
        }
    }
}

# Summary
$findings | Group-Object Severity | Sort-Object { $_.Name } | ForEach-Object {
    "$($_.Name): $($_.Count)"
}
"---"
"TOTAL findings: $($findings.Count)"
"TOTAL skills: $($skills.Count)"

# Export
$findings | Export-Csv -Path (Join-Path $skillsDir "validate-all-findings.csv") -NoTypeInformation
"Exported to validate-all-findings.csv"
