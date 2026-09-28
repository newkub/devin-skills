#!/usr/bin/env bun
/**
 * app.ts — OS-level window/screen screenshot (Windows via PowerShell).
 *
 * Internal module — invoked by ../presentation/cli.ts.
 */

import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { tmpdir } from 'node:os'

const PS_CAPTURE = `
param([string]$Out, [string]$Title = '')
Add-Type -AssemblyName System.Drawing, System.Windows.Forms
Add-Type @'
using System;
using System.Runtime.InteropServices;
using System.Text;
public class W {
  [DllImport("user32.dll")] public static extern bool EnumWindows(IntPtr cb, IntPtr p);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
  public delegate bool EnumCb(IntPtr h, IntPtr p);
  public struct RECT { public int Left, Top, Right, Bottom; }
}
'@
$x = 0; $y = 0; $w = 0; $h = 0
if ($Title) {
  $found = $null
  $cb = [W+EnumCb]{ param($hwnd, $p)
    if (-not [W]::IsWindowVisible($hwnd)) { return $true }
    $sb = New-Object System.Text.StringBuilder 256
    [void][W]::GetWindowText($hwnd, $sb, 256)
    if ($sb.ToString() -like "*$Title*") { $script:found = $hwnd; return $false }
    return $true
  }
  [void][W]::EnumWindows($cb, [IntPtr]::Zero)
  if (-not $script:found) { Write-Error "window not found: $Title"; exit 1 }
  $r = New-Object W+RECT
  [void][W]::GetWindowRect($script:found, [ref]$r)
  $x = $r.Left; $y = $r.Top; $w = $r.Right - $r.Left; $h = $r.Bottom - $r.Top
} else {
  $b = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
  $x = $b.X; $y = $b.Y; $w = $b.Width; $h = $b.Height
}
if ($w -le 0 -or $h -le 0) { Write-Error 'empty capture bounds'; exit 1 }
$bmp = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.CopyFromScreen($x, $y, 0, 0, $bmp.Size)
$bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
`

export interface AppOptions {
  out: string
  title?: string
}

export function captureApp(o: AppOptions): number {
  if (process.platform !== 'win32') {
    console.error('FAIL: capture app is Windows-only (PowerShell CopyFromScreen)')
    return 1
  }
  mkdirSync(dirname(resolve(o.out)), { recursive: true })
  const script = join(tmpdir(), `capture-app-${process.pid}.ps1`)
  writeFileSync(script, PS_CAPTURE)
  const args = ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', script, '-Out', resolve(o.out)]
  if (o.title) args.push('-Title', o.title)
  const r = spawnSync('powershell', args, { encoding: 'utf8', timeout: 60_000 })
  rmSync(script, { force: true })
  if (r.status === 0 && existsSync(o.out)) {
    console.log(`OK app -> ${o.out}`)
    return 0
  }
  console.error(`FAIL app capture: ${(r.stderr || r.stdout || '').slice(0, 200)}`)
  return 2
}
