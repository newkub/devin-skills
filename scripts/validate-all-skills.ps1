# Validate all skills in the repo
# Checks: line count, frontmatter, sections, name match, description length, TODO/MOCK, bold markers
# Requires: PowerShell 7+ (for UTF-8 handling)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$root = $PSScriptRoot | Split-Path | Split-Path
$skillsDir = Join-Path $root "skills"
if (-not (Test-Path $skillsDir)) { $skillsDir = $root }

$findings = @()
$skills = Get-ChildItem -Directory $skillsDir | Where-Object { Test-Path "$($_.FullName)\SKILL.md" }

# False-positive patterns for TODO/MOCK/placeholder content checks
# Lines matching ANY of these patterns are NOT real TODO/MOCK/placeholder defects
$falsePositivePatterns = @(
    # Tool/skill names containing todo/mock
    'todo_write', 'productionize-implementation', 'implement-mock', 'implement-todo-md',
    'update-todo-md', 'report-scan-todo', 'report-todo', 'mock-inventory', 'todo-inventory',
    # Backtick-quoted markers (instructions about them)
    '`TODO`', '`MOCK`', '`FIXME`', '`STUB`', '`FAKE`', '`placeholder`', '`mock`',
    '`TODO/MOCK', 'TODO/MOCK/placeholder', 'TODO/MOCK',
    # Code comment patterns
    '// TODO', '// MOCK', '# TODO', '# MOCK',
    # Test/mock patterns (mocking is a legitimate testing concept)
    'mock strategy', 'mock external', 'mock dependenc', 'mock service', 'mock database',
    'mock API', 'mock auth', 'mock email', 'mock payment', 'mock inputs', 'mock Octokit',
    'mock servers', 'mock ports', 'mock timers', 'mock data', 'mock UI',
    'mock implementation', 'mock inventory', 'mockup', 'mocks', 'mocking', 'mocked',
    'mock routes', 'mock server', 'Mock and Test', 'Mock event bus', 'Mock VueUse',
    'Mock repository', 'mocktail', 'Layer\.mock', 'No Mock In Production',
    # Placeholder instructions (lines telling to avoid/check/use placeholders)
    'placeholder functions', 'placeholder filler', 'Generic placeholders',
    'No Placeholder', 'no placeholder', 'placeholders', 'placeholder="',
    'placeholder assertions', 'lorem ipsum', 'banner image',
    # TODO/FIXME/HACK marker references (scanning/reporting them)
    'TODO/FIXME', 'TODO items', 'TODO table', 'TODO comments', 'TODO\.md',
    'TODO/roadmap', 'TODO markers', 'TODO comment', 'TODO high', 'TODO low',
    'TODO medium', 'TODO critical', 'TODO list', 'TODO queue', 'todos',
    'TODO/placeholder', 'comment markers', 'FIXME, HACK', 'NOTE, XXX',
    # Removal instructions
    'remove TODO', 'delete TODO', 'remove MOCK', 'delete MOCK',
    # Template/example patterns
    '\{\{ \.\.\. \}\}',
    # Additional skill names containing todo/mock
    'list-todo-md',
    # Backtick-quoted content examples
    'content contains TODO',
    # Instruction patterns about typing/using markers
    'Type TODO', 'Not For File TODO',
    # Instruction patterns about checking markers
    'MOCK, FAKE, STUB', 'FAKE, STUB',
    # Mock with backtick-quoted argument (test instruction)
    'Mock `external'
)

function Test-FalsePositive {
    param([string]$Line)
    foreach ($pattern in $falsePositivePatterns) {
        if ($Line -match $pattern) { return $true }
    }
    # Additional check: lines containing Thai text + TODO/MOCK/placeholder are almost always instructions
    # (e.g., "ตรวจ TODO", "ลบ placeholder", "ห้าม mock", "ใช้ placeholder")
    # Detect Thai characters (U+0E00-U+0E7F) on the same line as TODO/MOCK/placeholder
    if ($Line -match '[\u0E00-\u0E7F]') {
        if ($Line -match 'TODO|MOCK|placeholder|mock') { return $true }
    }
    return $false
}

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

    # TODO/MOCK/placeholder content check (with false-positive filtering)
    $todoMatches = $lines | Select-String -Pattern 'TODO|MOCK|placeholder' -CaseSensitive:$false |
        Where-Object { -not (Test-FalsePositive -Line $_.Line) }
    if ($todoMatches) {
        $findings += [PSCustomObject]@{
            Skill = $skillName; Category = "content"; Severity = "Medium";
            Finding = "Contains TODO/MOCK/placeholder text";
            Evidence = ($todoMatches | ForEach-Object { "$($_.LineNumber): $($_.Line.Trim())" }) -join "; "
        }
    }

    # Bold markers (exclude ** inside backticks which are instructions about bold)
    $boldMatches = $lines | Select-String -Pattern '\*\*[^*]+\*\*' |
        Where-Object { $_.Line -notmatch '`[^`]*\*\*[^`]*`' -and $_.Line -notmatch 'bold markers' }
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
$findings | Export-Csv -Path (Join-Path $skillsDir "validate-all-findings.csv") -NoTypeInformation -Encoding UTF8
"Exported to validate-all-findings.csv"
