#!/usr/bin/env pwsh
#Requires -Version 5.1
<#
.SYNOPSIS
  Read Windows default-app associations and fall back to the most-used app.

.DESCRIPTION
  Read-only over the registry. Resolves UserChoice -> ProgId -> shell\open\command
  -> executable, verifies the executable still exists, and falls back to a local
  usage counter (%APPDATA%\devin\default-apps.json) when the default is unusable.

  Registry helpers live in scripts/lib/default-apps.ps1 (dot-sourced).

.PARAMETER Target
  browser, mail, editor, all, http, https, mailto, or an extension (ts / .ts / pdf).

.PARAMETER Json
  Machine-readable output.

.PARAMETER Record
  Executable path to count as one launch. Writes the counter file only.

.PARAMETER Category
  Counter category for -Record: browser (default), mail, editor, other.

.PARAMETER OpenSettings
  Open ms-settings:defaultapps after resolving. Ask the user first.

.PARAMETER IncludeRecent
  Include the top HKCU Search\RecentApps entries (AppId + LaunchCount).

.EXAMPLE
  powershell -NoProfile -ExecutionPolicy Bypass -File scripts/resolve-default-apps.ps1 -Target browser

.EXAMPLE
  powershell -NoProfile -ExecutionPolicy Bypass -File scripts/resolve-default-apps.ps1 -Target all -Json

.EXAMPLE
  powershell -NoProfile -ExecutionPolicy Bypass -File scripts/resolve-default-apps.ps1 -Record "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe" -Category browser
#>
[CmdletBinding()]
param(
    [string[]] $Target = @('browser'),
    [switch]   $Json,
    [string]   $Record,
    [string]   $Category = 'browser',
    [switch]   $OpenSettings,
    [switch]   $IncludeRecent
)

$ErrorActionPreference = 'Stop'

if ($env:OS -ne 'Windows_NT') {
    throw 'check-default-apps resolves Windows associations only. Use `open` (macOS) or `xdg-open` (Linux).'
}

. (Join-Path $PSScriptRoot 'lib\default-apps.ps1')

# --- optional write: usage counter -------------------------------------------
$recordedCount = $null
if ($Record) {
    $Record = [Environment]::ExpandEnvironmentVariables($Record)
    if (-not (Test-Path -LiteralPath $Record)) {
        Write-Warning "Recording a launch for a path that does not exist: $Record"
    }
    $recordedCount = Add-Count -ExePath $Record -CategoryName $Category
}

# --- resolve ----------------------------------------------------------------
$targets = Expand-Targets -Names $Target
$installedBrowsers = @(Get-InstalledBrowsers)
$counts = Get-CountTable
$rows = @()
$number = 0

foreach ($targetName in $targets) {
    $category = Get-Category -TargetName $targetName
    $choicePath = Get-UserChoicePath -TargetName $targetName
    $progId = Get-RegValue -Path $choicePath -Name 'ProgId'

    $command = $null
    $commandSource = $null
    $exe = $null
    $appName = $null
    $exeExists = $null
    $status = 'missing'

    if ($progId) {
        $resolved = Resolve-ProgId -ProgId $progId
        $command = $resolved.command
        $commandSource = $resolved.source
        if ($command) {
            $exe = Get-ExePath -Command $command
            if ($exe) { $exe = [Environment]::ExpandEnvironmentVariables($exe) }
            if ($exe -and (Test-Path -LiteralPath $exe)) {
                $exeExists = $true
                $status = 'set'
            } else {
                $exeExists = $false
                $status = 'stale'
            }
            $appName = Get-AppName -ExePath $exe
        } else {
            $status = 'unresolved'
            $appName = Get-RegValue -Path "HKCU:\Software\Classes\$progId\Application" -Name 'ApplicationName'
        }
    }

    $fallback = $null
    $source = 'userchoice'
    if ($status -ne 'set') {
        $top = Get-TopCount -Counts $counts -CategoryName $category
        $usableBrowsers = @($installedBrowsers | Where-Object { $_.exists })
        if ($top) {
            $fallback = $top.exe
            $source = 'counter'
        } elseif ($category -eq 'browser' -and $usableBrowsers.Count -gt 0) {
            $fallback = $usableBrowsers[0].exe
            $source = 'installed'
        } else {
            $source = 'ask'
        }
    }

    $number++
    $rows += [pscustomobject]@{
        'No.'    = $number
        target   = $targetName
        category = $category
        progId   = $progId
        appName  = $appName
        exe      = $exe
        exeExists = $exeExists
        status   = $status
        source   = $source
        fallback = $fallback
        registryPath = $(if ($progId) { $choicePath } else { $null })
        commandPath  = $commandSource
    }
}

if ($OpenSettings) {
    Start-Process 'ms-settings:defaultapps'
}

$result = [ordered]@{
    generatedAt       = (Get-Date).ToString('o')
    counterFile       = $CounterPath
    targets           = @($rows)
    installedBrowsers = @($installedBrowsers)
}

if ($IncludeRecent) {
    $result.recentApps = @(Get-RecentApps)
}

if ($recordedCount -ne $null) {
    $result.recorded = [pscustomobject]@{ exe = $Record; category = $Category; count = $recordedCount }
}

if ($Json) {
    $result | ConvertTo-Json -Depth 6
    return
}

Write-Output ("Default apps on {0}  (counter: {1})" -f $env:COMPUTERNAME, $CounterPath)
Write-Output ''

$table = $rows | ForEach-Object {
    [pscustomobject]@{
        'No.'    = $_.'No.'
        Target   = $_.target
        App      = (Format-Cell $_.appName)
        Exe      = (Format-Cell $_.exe)
        Status   = $_.status
        Source   = $_.source
        Fallback = (Format-Cell $_.fallback)
        Note     = (Get-Note -Status $_.status)
    }
}

$table | Format-Table -AutoSize | Out-String -Width 260 | Write-Output

if ($installedBrowsers.Count -gt 0) {
    Write-Output 'Installed browsers:'
    $index = 0
    foreach ($browser in $installedBrowsers) {
        $index++
        $state = if ($browser.exists) { 'ok' } else { 'missing' }
        Write-Output ("  {0}. {1} - {2} [{3}]" -f $index, (Format-Cell $browser.name), $browser.exe, $state)
    }
    Write-Output ''
}

if ($IncludeRecent -and $result.recentApps.Count -gt 0) {
    Write-Output 'Recent apps (Search\RecentApps, tiebreaker only):'
    $index = 0
    foreach ($recent in $result.recentApps) {
        $index++
        Write-Output ("  {0}. {1} ({2})" -f $index, $recent.appId, $recent.launchCount)
    }
    Write-Output ''
}

if ($recordedCount -ne $null) {
    Write-Output ("Recorded {0} launch for {1} (count {2})" -f $Category, $Record, $recordedCount)
}

if ($OpenSettings) {
    Write-Output 'Opened ms-settings:defaultapps'
}
