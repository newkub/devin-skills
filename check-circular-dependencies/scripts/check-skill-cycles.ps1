$skillsDir = "C:\Users\Veerapong\AppData\Roaming\devin\skills"
$skillDirs = Get-ChildItem -Path $skillsDir -Directory
$graph = @{}
foreach ($dir in $skillDirs) {
    $path = Join-Path $dir.FullName 'SKILL.md'
    if (Test-Path $path) {
        $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
        $fmMatch = [regex]::Match($content, '(?s)^---\r?\n(.*?)\r?\n---\r?\n')
        if ($fmMatch.Success) {
            $fm = $fmMatch.Groups[1].Value
            $relMatch = [regex]::Match($fm, '(?s)related:\s*\r?\n(.*)')
            if ($relMatch.Success) {
                $relSection = $relMatch.Groups[1].Value
                $relSection = ($relSection -split "`r?`n(?=[a-zA-Z])")[0]
                $related = [regex]::Matches($relSection, '^\s+-\s+(.+)$') | ForEach-Object { $_.Groups[1].Value.Trim() -replace '#.*','' }
                $graph[$dir.Name] = @($related | Where-Object { $_ -and (Test-Path ([System.IO.Path]::Combine($skillsDir, $_, 'SKILL.md'))) })
            } else { $graph[$dir.Name] = @() }
        } else { $graph[$dir.Name] = @() }
    } else { $graph[$dir.Name] = @() }
}

$visited = @{}
$recStack = @{}
$cycle = @()

function DFS($node, [System.Collections.ArrayList]$path) {
    $visited[$node] = $true
    $recStack[$node] = $true
    [void]$path.Add($node)
    foreach ($n in $graph[$node]) {
        if (-not $visited[$n]) { $found = DFS $n $path; if ($found) { return $true } }
        elseif ($recStack[$n]) {
            $idx = $path.IndexOf($n)
            $cyclePath = $path[$idx..($path.Count-1)] + $n
            $script:cycle = $cyclePath
            return $true
        }
    }
    [void]$path.Remove($node)
    $recStack[$node] = $false
    return $false
}

$keys = @($graph.Keys)
foreach ($k in $keys) { if (-not $visited[$k]) { $p = [System.Collections.ArrayList]::new(); if (DFS $k $p) { break } } }

if ($cycle.Count -gt 0) { Write-Output "CIRCULAR REFERENCE FOUND: $($cycle -join ' -> ')"; exit 1 } else { Write-Output "NO CIRCULAR REFERENCES IN SKILL RELATED" }
