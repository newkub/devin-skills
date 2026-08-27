#Requires -Version 5.1
<#
.SYNOPSIS
  Thin wrapper for the Rust implementation of check-skills-related.
.DESCRIPTION
  Forwards arguments to the compiled Rust binary, building it if necessary.
.PARAMETER Root
  Root directory of the devin skills repo. Defaults to %APPDATA%\devin\skills.
.PARAMETER Skill
  Optional skill name to focus the report on.
.PARAMETER TreeDepth
  Maximum depth for the call tree. Defaults to 3.
.PARAMETER Mode
  One of: Summary, Tree, Cycles, Orphans, Verify, Full. Defaults to Summary
  (or Tree if -Skill is provided).
.PARAMETER IncludeTransitive
  Include transitive closure in Tree/Full output.
.PARAMETER FirstCycle
  Stop after finding the first cycle in Cycles/Full output.
.EXAMPLE
  .\check-skills-related.ps1
  .\check-skills-related.ps1 -Skill report-table
  .\check-skills-related.ps1 report-table
  .\check-skills-related.ps1 -Mode Cycles
#>
[CmdletBinding()]
param(
    [string]$Root = (Join-Path $env:APPDATA 'devin\skills'),
    [string]$Skill = '',
    [int]$TreeDepth = 3,
    [ValidateSet('Summary', 'Tree', 'Cycles', 'Orphans', 'Verify', 'Full')][string]$Mode = '',
    [switch]$IncludeTransitive,
    [switch]$FirstCycle,
    [Parameter(Position = 0, ValueFromRemainingArguments = $true)][string[]]$Remaining
)

# Allow a single positional argument to be a skill name or a root path.
if ($Remaining.Count -eq 1 -and -not $Skill) {
    $arg = $Remaining[0]
    if (Test-Path $arg -PathType Container) {
        $Root = $arg
    } else {
        $Skill = $arg
    }
}

# Default mode: Tree when a skill is targeted, otherwise Summary.
if (-not $Mode) {
    $Mode = if ($Skill) { 'Tree' } else { 'Summary' }
}

$skillDir = Split-Path -Parent $PSScriptRoot
$manifest = Join-Path $skillDir 'Cargo.toml'
$bin = Join-Path $skillDir 'target\release\check-skills-related.exe'

if (-not (Test-Path $bin) -or ((Get-Item $manifest).LastWriteTime -gt (Get-Item $bin).LastWriteTime)) {
    $cargo = Get-Command cargo -ErrorAction SilentlyContinue
    if (-not $cargo) {
        Write-Error "cargo not found. Install Rust to build check-skills-related."
        exit 1
    }
    & cargo build --release --manifest-path "$manifest" | Out-Host
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Build failed."
        exit $LASTEXITCODE
    }
}

$cmdArgs = @(
    "-Root", "`"$Root`"",
    "-Mode", $Mode
)
if ($Skill) { $cmdArgs += @("-Skill", "`"$Skill`"") }
if ($TreeDepth -ne 3) { $cmdArgs += @("-TreeDepth", $TreeDepth) }
if ($IncludeTransitive) { $cmdArgs += "-IncludeTransitive" }
if ($FirstCycle) { $cmdArgs += "-FirstCycle" }

& $bin @cmdArgs
exit $LASTEXITCODE
