#Requires -Version 5.1
<#
.SYNOPSIS
  Scan devin skills repo and build a call/related graph of skills.

.DESCRIPTION
  Reads every SKILL.md in the target directory, extracts skill names from
  frontmatter, related: lists, and /skill-name references from the body.
  Builds a directed graph and reports direct and transitive callees for
  every skill (or a single target skill).

.PARAMETER Root
  Root directory of the devin skills repo. Defaults to %APPDATA%\devin\skills.

.PARAMETER Skill
  Optional skill name to focus the report on.

.PARAMETER TreeDepth
  Maximum depth to display in the call tree for a target skill. Defaults to 3.

.EXAMPLE
  .\check-skills-related.ps1
  .\check-skills-related.ps1 -Skill check-skills-related
  .\check-skills-related.ps1 -Root D:\repo\my-skills
#>
[CmdletBinding()]
param(
    [string]$Root = (Join-Path $env:APPDATA 'devin\skills'),
    [string]$Skill = '',
    [int]$TreeDepth = 3
)

if (-not (Test-Path $Root)) {
    Write-Error "Target directory not found: $Root"
    exit 1
}

# --- 1. Inventory all skills and cache content
$skillData = [System.Collections.Generic.List[object]]::new()
$skillDirs = Get-ChildItem -Path $Root -Directory | Where-Object {
    (Test-Path (Join-Path $_.FullName 'SKILL.md')) -and
    $_.Name -notmatch '^(\.git|node_modules)$'
}

foreach ($dir in $skillDirs) {
    $skillFile = Join-Path $dir.FullName 'SKILL.md'
    $content   = [System.IO.File]::ReadAllText($skillFile, [System.Text.Encoding]::UTF8)

    $fmMatch = [regex]::Match($content, '(?s)^---\s*\r?\n(.*?)\r?\n---\s*\r?\n')
    $fm = if ($fmMatch.Success) { $fmMatch.Groups[1].Value } else { '' }
    $body = if ($fmMatch.Success) { $content.Substring($fmMatch.Length) } else { $content }

    $name = $dir.Name
    $nameMatch = [regex]::Match($fm, '(?m)^\s*name:\s*(.+?)\s*$')
    if ($nameMatch.Success) {
        $name = $nameMatch.Groups[1].Value.Trim().Trim('"').Trim("'")
    }
    if ([string]::IsNullOrWhiteSpace($name)) { $name = $dir.Name }

    $skillData.Add([PSCustomObject]@{
        Name    = $name
        Dir     = $dir.FullName
        Body    = $body
        Fm      = $fm
    })
}

$skillSet = [System.Collections.Generic.HashSet[string]]::new()
foreach ($s in $skillData) { [void]$skillSet.Add($s.Name) }

if ($skillSet.Count -eq 0) {
    Write-Output "No skills found in $Root"
    exit 0
}

$skillNamesSorted = @($skillSet) | Sort-Object -Property @{Expression='Length'; Descending=$true}, @{Expression={$_}; Ascending=$true}

# --- 2. Build graph
$graph = @{}
$unknownRefs = [System.Collections.Generic.List[string]]::new()

foreach ($s in $skillData) {
    $callees = [System.Collections.Generic.HashSet[string]]::new()

    # related: frontmatter
    $relMatch = [regex]::Match($s.Fm, '(?m)^\s*related:\s*\r?\n((?:^\s+-\s+.+?\r?\n)+)')
    if ($relMatch.Success) {
        $relLines = $relMatch.Groups[1].Value -split '\r?\n'
        foreach ($line in $relLines) {
            if ($line -match '^\s+-\s+(.+?)\s*$') {
                $rel = $matches[1].Trim().Trim('"').Trim("'")
                if ($rel -and $rel -ne $s.Name) {
                    if ($skillSet.Contains($rel)) {
                        [void]$callees.Add($rel)
                    } else {
                        [void]$unknownRefs.Add("$($s.Name) -> related:$rel")
                    }
                }
            }
        }
    }

    # body /skill-name references (not URLs, not file paths)
    $bodyNoUrl = [regex]::Replace($s.Body, 'https?://\S+', ' ')
    foreach ($target in $skillNamesSorted) {
        if ($target -eq $s.Name) { continue }
        $escaped = [regex]::Escape($target)
        $pattern = "(?<![/.\w:])/$escaped(?![a-z0-9-])"
        $matches = [regex]::Matches($bodyNoUrl, $pattern)
        if ($matches.Count -gt 0) { [void]$callees.Add($target) }
    }

    $graph[$s.Name] = $callees
}

# --- 3. DFS helpers
$visited = @{}
$recStack = @{}
$closure = @{}
$cycleFound = $null

function Get-Closure($node, [System.Collections.Generic.List[string]]$path) {
    if ($recStack[$node]) {
        $idx = $path.IndexOf($node)
        if ($idx -ge 0) {
            $script:cycleFound = ($path[$idx..($path.Count-1)] + $node) -join ' -> '
        }
        return
    }
    if ($visited[$node]) { return }

    $visited[$node] = $true
    $recStack[$node] = $true
    [void]$path.Add($node)

    $all = [System.Collections.Generic.HashSet[string]]::new()
    if ($graph.ContainsKey($node)) {
        foreach ($c in $graph[$node]) {
            [void]$all.Add($c)
            Get-Closure $c $path
            if ($closure.ContainsKey($c)) {
                foreach ($x in $closure[$c]) { [void]$all.Add($x) }
            }
        }
    }

    [void]$all.Remove($node)
    [void]$path.Remove($node)
    $recStack[$node] = $false
    $closure[$node] = $all
}

function Show-Tree($node, [string]$indent, [System.Collections.Generic.List[string]]$path, [int]$currentDepth) {
    if ($currentDepth -gt $TreeDepth) { return }
    if ($path.Contains($node)) {
        Write-Output "$indent$node (cycle)"
        return
    }
    Write-Output "$indent$node"
    [void]$path.Add($node)
    if ($graph.ContainsKey($node)) {
        foreach ($c in @($graph[$node] | Sort-Object)) {
            Show-Tree $c "  $indent" $path ($currentDepth + 1)
        }
    }
    [void]$path.Remove($node)
}

$depthCache = @{}
$depthRec = @{}
function Get-Depth($node) {
    if ($depthRec[$node]) { return 0 }
    if ($depthCache.ContainsKey($node)) { return $depthCache[$node] }
    if (-not $graph.ContainsKey($node) -or $graph[$node].Count -eq 0) { return 0 }
    $depthRec[$node] = $true
    $max = 0
    foreach ($c in $graph[$node]) {
        $d = Get-Depth $c
        if ($d -gt $max) { $max = $d }
    }
    $depthRec[$node] = $false
    $depth = $max + 1
    $depthCache[$node] = $depth
    return $depth
}

# --- 4. Compute closures and depth
if ($Skill) {
    if (-not $graph.ContainsKey($Skill)) {
        Write-Error "Skill not found: $Skill"
        exit 1
    }
    Get-Closure $Skill ([System.Collections.Generic.List[string]]::new())
} else {
    foreach ($name in $graph.Keys) { Get-Closure $name ([System.Collections.Generic.List[string]]::new()) }
}

# --- 5. Output
if ($Skill) {
    Write-Output "=== SKILL: $Skill ==="
    Write-Output ""
    Write-Output "--- Call Tree (depth <= $TreeDepth) ---"
    Show-Tree $Skill '' ([System.Collections.Generic.List[string]]::new()) 0
    Write-Output ""
    $direct = @($graph[$Skill] | Sort-Object)
    $transitive = @($closure[$Skill] | Sort-Object)
    $depth = Get-Depth $Skill
    Write-Output "--- Summary ---"
    Write-Output "direct:     $($direct -join ', ')"
    Write-Output "transitive: $($transitive -join ', ')"
    Write-Output "depth:      $depth"
    if ($cycleFound) { Write-Output "cycle:      $cycleFound" }
} else {
    Write-Output "=== SKILL RELATION GRAPH ==="
    Write-Output ""
    $keys = @($graph.Keys | Sort-Object)
    foreach ($name in $keys) {
        $direct = @($graph[$name] | Sort-Object)
        $transitive = @($closure[$name] | Sort-Object)
        $depth = Get-Depth $name
        Write-Output "--- $name ---"
        Write-Output "  direct:     $($direct -join ', ')"
        Write-Output "  transitive: $($transitive -join ', ')"
        Write-Output "  depth:      $depth"
    }

    Write-Output ""
    Write-Output "=== SUMMARY ==="
    $totalSkills = $skillSet.Count
    $totalRelations = 0
    foreach ($name in $graph.Keys) { $totalRelations += $graph[$name].Count }
    $orphanCount = ($keys | Where-Object { $graph[$_].Count -eq 0 }).Count
    Write-Output "total skills:   $totalSkills"
    Write-Output "total relations: $totalRelations"
    Write-Output "orphan skills:  $orphanCount"
    if ($cycleFound) { Write-Output "cycle found:    $cycleFound" } else { Write-Output "cycle found:    none" }

    if ($unknownRefs.Count -gt 0) {
        Write-Output ""
        Write-Output "=== UNKNOWN REFERENCES ==="
        foreach ($u in $unknownRefs) { Write-Output $u }
    }
}
