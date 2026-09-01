#Requires -Version 7.0
param(
  [string]$SkillsDir = "$env:APPDATA\devin\skills",
  [string]$OutputFile = "$env:TEMP\skills-relation.json",
  [int]$MaxChainDepth = 3,
  [int]$MaxChains = 50
)

$ErrorActionPreference = "Stop"

$skillDirs = Get-ChildItem -Path $SkillsDir -Directory | Where-Object { Test-Path (Join-Path $_.FullName "SKILL.md") }
$skills = @()
$skillNames = @()

foreach ($dir in $skillDirs) {
  $path = Join-Path $dir.FullName "SKILL.md"
  $raw = Get-Content -Raw -Path $path

  $fmMatch = [regex]::Match($raw, "^---\r?\n(.*?)\r?\n---", [System.Text.RegularExpressions.RegexOptions]::Singleline)
  $frontmatter = if ($fmMatch.Success) { $fmMatch.Groups[1].Value } else { "" }
  $body = if ($fmMatch.Success) { $raw.Substring($fmMatch.Index + $fmMatch.Length).Trim() } else { $raw.Trim() }

  $name = [regex]::Match($frontmatter, "^name:\s*(.+)$", [System.Text.RegularExpressions.RegexOptions]::Multiline).Groups[1].Value.Trim()
  if ([string]::IsNullOrWhiteSpace($name)) { $name = $dir.Name }

  $related = [regex]::Matches($frontmatter, "^-\s*(.+)$", [System.Text.RegularExpressions.RegexOptions]::Multiline) | ForEach-Object { $_.Groups[1].Value.Trim() }

  $refPattern = '(?<![a-zA-Z0-9_.\-/:@])/(?![0-9])[a-z][a-z0-9-]*[a-z0-9](?![a-zA-Z0-9-])'
  $bodyRefs = [regex]::Matches($body, $refPattern) | ForEach-Object { $_.Groups[0].Value.TrimStart('/') } | Sort-Object -Unique

  $outgoing = ($related + $bodyRefs) | Sort-Object -Unique | Where-Object { $_ -ne $name -and -not [string]::IsNullOrWhiteSpace($_) }

  $skills += [PSCustomObject]@{
    name = $name
    dir = $dir.Name
    related = $related
    body_refs = $bodyRefs
    outgoing = $outgoing
  }
  $skillNames += $name
}

$validSkills = $skills | Where-Object { $_.name -in $skillNames }
$outgoingMap = @{}
$incomingMap = @{}

foreach ($skill in $validSkills) {
  $outgoingMap[$skill.name] = $skill.outgoing | Where-Object { $_ -in $skillNames }
  $incomingMap[$skill.name] = @()
}

foreach ($skill in $validSkills) {
  foreach ($target in $outgoingMap[$skill.name]) {
    if ($incomingMap.ContainsKey($target)) {
      $incomingMap[$target] += $skill.name
    }
  }
}

$chainSet = [System.Collections.Generic.HashSet[string]]::new()
$chains = [System.Collections.Generic.List[array]]::new()

foreach ($a in $validSkills.name) {
  foreach ($b in $outgoingMap[$a]) {
    if ($b -eq $a) { continue }
    $chain = @($a, $b)
    $key = $chain -join " -> "
    if ($chainSet.Add($key)) { $chains.Add($chain) }

    if ($MaxChainDepth -gt 2) {
      foreach ($c in $outgoingMap[$b]) {
        if ($c -eq $a -or $c -eq $b) { continue }
        $chain = @($a, $b, $c)
        $key = $chain -join " -> "
        if ($chainSet.Add($key)) { $chains.Add($chain) }
      }
    }
  }
}

$chainStrings = $chains | Select-Object -First $MaxChains | ForEach-Object { $_ -join " -> " }

$rows = $validSkills | ForEach-Object {
  [PSCustomObject]@{
    skill = $_.name
    contains = ($outgoingMap[$_.name] | Sort-Object -Unique) -join ", "
    called_by = ($incomingMap[$_.name] | Sort-Object -Unique) -join ", "
  }
}

$result = [PSCustomObject]@{
  count = $validSkills.Count
  edges = ($outgoingMap.Values | ForEach-Object { $_.Count } | Measure-Object -Sum).Sum
  rows = $rows
  chains = $chainStrings
  isolated = ($validSkills | Where-Object { $outgoingMap[$_.name].Count -eq 0 -and $incomingMap[$_.name].Count -eq 0 }).name
}

$result | ConvertTo-Json -Depth 10 | Set-Content -Path $OutputFile -Encoding UTF8

Write-Output "Scanned $($validSkills.Count) skills"
Write-Output "Found $($result.edges) edges"
Write-Output "Found $($result.chains.Count) chains"
Write-Output "Isolated: $($result.isolated.Count)"
Write-Output "Saved to $OutputFile"

Write-Output "`nTop 20 relation rows:"
$rows | Select-Object -First 20 | Format-Table -AutoSize
