param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Domain,
    [int]$Depth = 2,
    [int]$Limit = 500,
    [int]$TimeoutSec = 15,
    [switch]$UseJS
)

# check-routes-status: discover every page route on a domain via `crw map`
# (sitemap + crawl fallback) then report HTTP status per route. Read-only.
# API routes are covered by test-all-api-routes instead.

if (-not (Get-Command crw -ErrorAction SilentlyContinue)) {
    Write-Output "ERROR: crw CLI not found - install via /download-program"
    exit 2
}
if (-not (Get-Command curl.exe -ErrorAction SilentlyContinue)) {
    Write-Output "ERROR: curl.exe not found"
    exit 2
}

# Normalize input -> base URL
$d = $Domain.Trim()
if ($d -notmatch '^[a-zA-Z][a-zA-Z0-9+.-]*://') {
    if ($d -match '^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?(/|$)') { $d = "http://$d" } else { $d = "https://$d" }
}
try { $uri = [System.Uri]$d } catch { Write-Output "ERROR: invalid domain '$Domain'"; exit 2 }
$baseUrl = "$($uri.Scheme)://$($uri.Authority)"

# 1. Discover routes via crw map (sitemap first, crawl fallback)
function Get-Routes {
    param([string[]]$Extra)
    $cmdArgs = @('map', $baseUrl, '--depth', "$Depth", '--limit', "$Limit", '--format', 'json') + $Extra
    $raw = & crw @cmdArgs 2>$null
    if (-not $raw) { return @() }
    try { $parsed = ($raw | Out-String | ConvertFrom-Json) } catch { return @() }
    $items = @()
    if ($parsed -is [array]) { $items = $parsed }
    elseif ($null -ne $parsed.links) { $items = @($parsed.links) }
    elseif ($null -ne $parsed.urls) { $items = @($parsed.urls) }
    $list = @()
    foreach ($item in $items) {
        if ($item -is [string]) { $list += $item }
        elseif ($null -ne $item.url) { $list += [string]$item.url }
    }
    return $list
}

$urls = Get-Routes @()
if ($urls.Count -eq 0) { $urls = Get-Routes @('--no-sitemap') }
if ($urls.Count -eq 0 -and $UseJS) { $urls = Get-Routes @('--no-sitemap', '--js') }

# same-origin only + dedupe
$urls = @($urls | Where-Object {
    try { ([System.Uri]$_).Authority -eq $uri.Authority } catch { $false }
} | Select-Object -Unique)

if ($urls.Count -eq 0) {
    Write-Output "ERROR: no same-origin routes discovered for $baseUrl (tried sitemap + crawl)"
    exit 2
}

# 2. Check each route: HEAD first, GET fallback on 405/501
function Get-Status {
    param([string]$Url, [string[]]$MethodArgs)
    $out = & curl.exe -sk -o NUL -w '%{http_code} %{time_total}' --max-time $TimeoutSec @MethodArgs "$Url" 2>$null
    $status = 0; $ms = 0
    if ("$out" -match '(\d+)\s+([\d.]+)') {
        $status = [int]$Matches[1]
        $ms = [int][math]::Round([double]$Matches[2] * 1000)
    }
    return @($status, $ms)
}

$results = New-Object System.Collections.ArrayList
$no = 0
foreach ($u in $urls) {
    $no++
    $r = Get-Status -Url $u -MethodArgs @('--head')
    if ($r[0] -eq 405 -or $r[0] -eq 501) { $r = Get-Status -Url $u -MethodArgs @('-X', 'GET') }
    $status = $r[0]; $ms = $r[1]
    if ($status -ge 200 -and $status -lt 300) { $sev = 'ok' }
    elseif ($status -ge 300 -and $status -lt 400) { $sev = 'redirect' }
    elseif ($status -eq 401 -or $status -eq 403) { $sev = 'protected' }
    elseif ($status -ge 400) { $sev = 'critical' }
    else { $sev = 'unreachable' }
    if ($ms -gt 3000 -and $sev -eq 'ok') { $sev = 'slow' }
    [void]$results.Add([PSCustomObject]@{ No = $no; Route = $u; Status = $status; TimeMs = $ms; Severity = $sev })
    Write-Output ("{0,4} {1,3} {2,6}ms {3,-11} {4}" -f $no, $status, $ms, $sev, $u)
}

$total = $results.Count
$ok = @($results | Where-Object Severity -eq 'ok').Count
$redirect = @($results | Where-Object Severity -eq 'redirect').Count
$slow = @($results | Where-Object Severity -eq 'slow').Count
$protectedCnt = @($results | Where-Object Severity -eq 'protected').Count
$bad = @($results | Where-Object { $_.Severity -in 'critical', 'unreachable' }).Count

Write-Output ""
Write-Output "SUMMARY total=$total ok=$ok redirect=$redirect slow=$slow protected=$protectedCnt critical=$bad"

if ($bad -gt 0) { exit 1 } else { exit 0 }
