# Helpers for resolve-default-apps.ps1. Dot-sourced; not meant to run alone.
# Read-only over the registry; Add-Count is the only writer (counter file).

$CounterPath = Join-Path $env:APPDATA 'devin\default-apps.json'
$EditorExts  = @('.txt', '.md', '.markdown', '.json', '.yaml', '.yml', '.ts', '.tsx', '.js', '.css', '.html')

function Expand-Targets {
    param([string[]] $Names)
    $out = New-Object System.Collections.Generic.List[string]
    foreach ($name in $Names) {
        $key = $name.Trim().ToLowerInvariant()
        $values = switch ($key) {
            'browser' { @('http', 'https') }
            'mail'    { @('mailto') }
            'editor'  { @('.txt', '.md') }
            'all'     { @('http', 'https', 'mailto', '.txt', '.md') }
            default {
                if ($key.StartsWith('.')) { @($key) } else { @('.' + $key) }
            }
        }
        foreach ($value in $values) {
            if (-not $out.Contains($value)) { $out.Add($value) }
        }
    }
    return $out.ToArray()
}

function Get-Category {
    param([string] $TargetName)
    if ($TargetName -eq 'http' -or $TargetName -eq 'https') { return 'browser' }
    if ($TargetName -eq 'mailto') { return 'mail' }
    if ($EditorExts -contains $TargetName) { return 'editor' }
    return 'other'
}

function Get-RegValue {
    param([string] $Path, [string] $Name = '')
    try {
        $item = Get-Item -LiteralPath $Path -ErrorAction Stop
        return $item.GetValue($Name)
    } catch {
        return $null
    }
}

function Get-UserChoicePath {
    param([string] $TargetName)
    if ($TargetName.StartsWith('.')) {
        return "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\FileExts\$TargetName\UserChoice"
    }
    return "HKCU:\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\$TargetName\UserChoice"
}

function Resolve-ProgId {
    param([string] $ProgId)
    $roots = @(
        "Registry::HKEY_CLASSES_ROOT\$ProgId",
        "HKCU:\Software\Classes\$ProgId"
    )
    foreach ($root in $roots) {
        $command = Get-RegValue -Path "$root\shell\open\command"
        if ($command) {
            return [pscustomobject]@{ command = $command; source = "$root\shell\open\command" }
        }
    }
    $appName = Get-RegValue -Path "HKCU:\Software\Classes\$ProgId\Application" -Name 'ApplicationName'
    return [pscustomobject]@{
        command = $null
        source  = $(if ($appName) { 'AppX' } else { $null })
    }
}

function Get-ExePath {
    param([string] $Command)
    if (-not $Command) { return $null }
    $trimmed = $Command.Trim()
    if ($trimmed.StartsWith('"')) {
        $end = $trimmed.IndexOf('"', 1)
        if ($end -gt 1) { return $trimmed.Substring(1, $end - 1) }
    }
    $index = $trimmed.ToLowerInvariant().IndexOf('.exe')
    if ($index -ge 0) { return $trimmed.Substring(0, $index + 4).Trim() }
    return ($trimmed -split '\s+')[0]
}

function Get-AppName {
    param([string] $ExePath)
    if (-not $ExePath) { return $null }
    try {
        $info = (Get-Item -LiteralPath $ExePath -ErrorAction Stop).VersionInfo
        if ($info.ProductName) { return $info.ProductName }
        if ($info.FileDescription) { return $info.FileDescription }
    } catch { }
    return [System.IO.Path]::GetFileNameWithoutExtension($ExePath)
}

function Get-InstalledBrowsers {
    $roots = @(
        'HKLM:\SOFTWARE\Clients\StartMenuInternet',
        'HKLM:\SOFTWARE\WOW6432Node\Clients\StartMenuInternet',
        'HKCU:\SOFTWARE\Clients\StartMenuInternet'
    )
    $seen = @{}
    $list = New-Object System.Collections.Generic.List[object]
    foreach ($root in $roots) {
        if (-not (Test-Path -LiteralPath $root)) { continue }
        foreach ($key in (Get-ChildItem -LiteralPath $root -ErrorAction SilentlyContinue)) {
            $name = (Get-Item -LiteralPath $key.PSPath).GetValue('')
            $command = Get-RegValue -Path "$($key.PSPath)\shell\open\command"
            $exe = Get-ExePath -Command $command
            if (-not $exe) { continue }
            $exe = [Environment]::ExpandEnvironmentVariables($exe)
            if ($seen.ContainsKey($exe.ToLowerInvariant())) { continue }
            $seen[$exe.ToLowerInvariant()] = $true
            $list.Add([pscustomobject]@{
                name   = $(if ($name) { $name } else { Get-AppName -ExePath $exe })
                exe    = $exe
                exists = Test-Path -LiteralPath $exe
            })
        }
    }
    return @($list | Sort-Object name)
}

function Get-CountTable {
    if (-not (Test-Path -LiteralPath $CounterPath)) { return @{} }
    try {
        $data = Get-Content -LiteralPath $CounterPath -Raw | ConvertFrom-Json
    } catch {
        return @{}
    }
    $table = @{}
    if ($data.counts) {
        foreach ($property in $data.counts.PSObject.Properties) {
            $table[$property.Name] = [int]$property.Value
        }
    }
    return $table
}

function Add-Count {
    param([string] $ExePath, [string] $CategoryName)
    $table = Get-CountTable
    $key = "$CategoryName|$ExePath"
    if ($table.ContainsKey($key)) { $table[$key] = $table[$key] + 1 } else { $table[$key] = 1 }
    $dir = Split-Path -Parent $CounterPath
    if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    [ordered]@{
        version   = 1
        counts    = $table
        updatedAt = (Get-Date).ToString('o')
    } | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $CounterPath -Encoding UTF8
    return $table[$key]
}

function Get-TopCount {
    param([hashtable] $Counts, [string] $CategoryName)
    $bestExe = $null
    $bestCount = 0
    foreach ($key in $Counts.Keys) {
        $parts = $key.Split('|', 2)
        if ($parts.Count -ne 2 -or $parts[0] -ne $CategoryName) { continue }
        $count = [int]$Counts[$key]
        if ($count -gt $bestCount -and (Test-Path -LiteralPath $parts[1])) {
            $bestExe = $parts[1]
            $bestCount = $count
        }
    }
    if (-not $bestExe) { return $null }
    return [pscustomobject]@{ exe = $bestExe; count = $bestCount }
}

function Get-RecentApps {
    $root = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Search\RecentApps'
    if (-not (Test-Path -LiteralPath $root)) { return @() }
    $items = @()
    foreach ($key in (Get-ChildItem -LiteralPath $root -ErrorAction SilentlyContinue)) {
        $item = Get-Item -LiteralPath $key.PSPath
        $items += [pscustomobject]@{
            appId       = $key.PSChildName
            launchCount = [int]($item.GetValue('LaunchCount', 0))
        }
    }
    return @($items | Sort-Object launchCount -Descending | Select-Object -First 5)
}

function Get-Note {
    param([string] $Status)
    switch ($Status) {
        'stale'      { return 'exe missing - open ms-settings:defaultapps' }
        'missing'    { return 'no UserChoice - set it in Settings' }
        'unresolved' { return 'AppX/UWP - launch by AUMID, no exe path' }
        default      { return '-' }
    }
}

function Format-Cell {
    param($Value)
    if ($null -eq $Value -or "$Value" -eq '') { return '-' }
    return "$Value"
}
