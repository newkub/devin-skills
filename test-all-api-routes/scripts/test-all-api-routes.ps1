param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Domain,
    [string]$RoutesFile,
    [string]$SpecUrl,
    [string]$Token,
    [int]$Limit = 500,
    [int]$TimeoutSec = 15,
    [switch]$AllowWrite
)

# test-all-api-routes: test every API route on a domain.
# Route sources (in order): -RoutesFile, OpenAPI spec on the domain, crw map /api filter.
# Safe by default: only GET/HEAD/OPTIONS are sent; mutation methods are marked
# 'skipped' unless -AllowWrite is passed. Read-only by default.

if (-not (Get-Command curl.exe -ErrorAction SilentlyContinue)) {
    Write-Output "ERROR: curl.exe not found"
    exit 2
}

$d = $Domain.Trim()
if ($d -notmatch '^[a-zA-Z][a-zA-Z0-9+.-]*://') {
    if ($d -match '^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?(/|$)') { $d = "http://$d" } else { $d = "https://$d" }
}
try { $uri = [System.Uri]$d } catch { Write-Output "ERROR: invalid domain '$Domain'"; exit 2 }
$baseUrl = "$($uri.Scheme)://$($uri.Authority)"

$safeMethods = @('GET', 'HEAD', 'OPTIONS')
$routes = New-Object System.Collections.ArrayList  # @{ Method; Path; Expected }
$routeSource = ''

function Add-Route {
    param([string]$Method, [string]$Path, [int]$Expected = 0)
    [void]$routes.Add([PSCustomObject]@{ Method = $Method.ToUpper(); Path = $Path; Expected = $Expected })
}

# Source 1: routes file - lines like "GET /api/users 200" or "/api/users"
if ($RoutesFile -and (Test-Path $RoutesFile)) {
    foreach ($line in (Get-Content $RoutesFile)) {
        $l = $line.Trim()
        if (-not $l -or $l.StartsWith('#')) { continue }
        if ($l -match '^(GET|HEAD|OPTIONS|POST|PUT|PATCH|DELETE)\s+(\S+)(?:\s+(\d{3}))?') {
            $exp = 0; if ($Matches[3]) { $exp = [int]$Matches[3] }
            Add-Route -Method $Matches[1] -Path $Matches[2] -Expected $exp
        } else {
            Add-Route -Method 'GET' -Path ($l -split '\s')[0]
        }
    }
    if ($routes.Count -gt 0) { $routeSource = "file:$RoutesFile" }
}

# Source 2: OpenAPI spec on the domain
if ($routes.Count -eq 0) {
    $candidates = @()
    if ($SpecUrl) { $candidates += $SpecUrl }
    $candidates += @('/openapi.json', '/api/openapi.json', '/swagger.json', '/api/swagger.json', '/api-docs', '/api/docs', '/docs/openapi.json') | ForEach-Object { "$baseUrl$_" }
    foreach ($s in $candidates) {
        $body = & curl.exe -sk --max-time $TimeoutSec "$s" 2>$null
        if (-not $body) { continue }
        try { $spec = ($body | Out-String | ConvertFrom-Json) } catch { continue }
        if ($null -eq $spec.paths) { continue }
        foreach ($p in $spec.paths.PSObject.Properties) {
            foreach ($m in $p.Value.PSObject.Properties) {
                $method = $m.Name.ToUpper()
                if ($method -in @('GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE')) {
                    Add-Route -Method $method -Path $p.Name
                }
            }
        }
        if ($routes.Count -gt 0) { $routeSource = "spec:$s"; break }
    }
}

# Source 3: crw map fallback, api-ish paths only
if ($routes.Count -eq 0 -and (Get-Command crw -ErrorAction SilentlyContinue)) {
    $raw = & crw map $baseUrl --limit $Limit --format json 2>$null
    if ($raw) {
        try { $parsed = ($raw | Out-String | ConvertFrom-Json) } catch { $parsed = $null }
        $links = @(); if ($null -ne $parsed.links) { $links = @($parsed.links) }
        foreach ($l in $links) {
            try { $u = [System.Uri]$l } catch { continue }
            if ($u.Authority -ne $uri.Authority) { continue }
            if ($u.AbsolutePath -match '^/(api|v\d+)(/|$)') { Add-Route -Method 'GET' -Path $u.AbsolutePath }
        }
        if ($routes.Count -gt 0) { $routeSource = 'crw:map' }
    }
}

$routes = @($routes | Select-Object -First $Limit)
if ($routes.Count -eq 0) {
    Write-Output "ERROR: no API routes found for $baseUrl - provide -RoutesFile, -SpecUrl, or run /list-website-all-routes on source code"
    exit 2
}
Write-Output "route source: $routeSource"

# Test each route
$results = New-Object System.Collections.ArrayList
$no = 0
foreach ($r in $routes) {
    $no++
    $path = $r.Path -replace '\{[^}]+\}', '1'
    $url = if ($path -match '^https?://') { $path } else { "$baseUrl$path" }
    if ($r.Method -notin $safeMethods -and -not $AllowWrite) {
        [void]$results.Add([PSCustomObject]@{ No = $no; Method = $r.Method; Route = $r.Path; Status = 0; Expected = $r.Expected; TimeMs = 0; Severity = 'skipped' })
        Write-Output ("{0,4} {1,-7} {2,-9} --- {3,6}ms {4}" -f $no, $r.Method, 'skipped', 0, $r.Path)
        continue
    }
    $hdr = @(); if ($Token) { $hdr = @('-H', "Authorization: Bearer $Token") }
    $out = & curl.exe -sk -o NUL -w '%{http_code} %{time_total}' --max-time $TimeoutSec -X $r.Method @hdr "$url" 2>$null
    $status = 0; $ms = 0
    if ("$out" -match '(\d+)\s+([\d.]+)') {
        $status = [int]$Matches[1]
        $ms = [int][math]::Round([double]$Matches[2] * 1000)
    }
    if ($r.Expected -gt 0 -and $status -eq $r.Expected) { $sev = 'ok' }
    elseif ($r.Expected -gt 0) { $sev = 'critical' }
    elseif ($status -eq 404 -and $routeSource -match '^(file|spec):') { $sev = 'missing' }
    elseif ($status -ge 200 -and $status -lt 300) { $sev = 'ok' }
    elseif ($status -ge 300 -and $status -lt 400) { $sev = 'redirect' }
    elseif ($status -eq 401 -or $status -eq 403) { $sev = 'protected' }
    elseif ($status -ge 400) { $sev = 'critical' }
    else { $sev = 'unreachable' }
    if ($ms -gt 3000 -and $sev -eq 'ok') { $sev = 'slow' }
    [void]$results.Add([PSCustomObject]@{ No = $no; Method = $r.Method; Route = $r.Path; Status = $status; Expected = $r.Expected; TimeMs = $ms; Severity = $sev })
    Write-Output ("{0,4} {1,-7} {2,3} {3,6}ms {4,-11} {5}" -f $no, $r.Method, $status, $ms, $sev, $r.Path)
}

$total = $results.Count
$ok = @($results | Where-Object Severity -eq 'ok').Count
$skipped = @($results | Where-Object Severity -eq 'skipped').Count
$protectedCnt = @($results | Where-Object Severity -eq 'protected').Count
$bad = @($results | Where-Object { $_.Severity -in 'critical', 'unreachable', 'missing' }).Count

Write-Output ""
Write-Output "SUMMARY total=$total tested=$($total - $skipped) ok=$ok protected=$protectedCnt skipped=$skipped critical=$bad"

if ($bad -gt 0) { exit 1 } else { exit 0 }
