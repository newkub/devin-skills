# Windows Associations

Where Windows stores default-app choices, how to read them read-only, and why writing them does not work.

## 1. URL Protocols

`http`, `https`, `mailto`, `ms-settings`, `ftp` are *URL associations*.

```
HKCU\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\<protocol>\UserChoice
  ProgId            REG_SZ     application actually chosen
  Hash              REG_SZ     opaque, bound to user SID + ProgId + timestamp
  Timestamp         REG_BINARY

HKCU\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\<protocol>\UserChoiceLatest
  ProgId            REG_SZ     Win11 22H2+ mirror, written after the Settings UI applies a change
```

```powershell
Get-ItemProperty 'HKCU:\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\http\UserChoice' |
  Select-Object ProgId
```

## 2. File Extensions

```
HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\FileExts\<.ext>\UserChoice
  ProgId            REG_SZ
HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\FileExts\<.ext>\OpenWithProgids
  <ProgId>          REG_NONE    acceptable alternatives
HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\FileExts\<.ext>\OpenWithList
  a, b, c           REG_SZ      MRU letters
  MRUList           REG_SZ      order, e.g. "cba"
```

`OpenWithProgids` is the honest candidate list for "what else can open this". `OpenWithList` is only a most-recently-used order, not a preference.

UWP defaults appear as `AppX<package-family-hash>` instead of a classic ProgId.

## 3. ProgId To Executable

```
HKEY_CLASSES_ROOT\<ProgId>\shell\open\command      (default) = "\"<exe>\" %1"
HKCU\Software\Classes\<ProgId>\shell\open\command  per-user override, checked first in practice
```

```powershell
Get-Item 'Registry::HKEY_CLASSES_ROOT\BraveHTML\shell\open\command' | ForEach-Object { $_.GetValue('') }
```

Classic ProgIds carry the command. AppX ProgIds usually do not — they expose:

```
HKCU\Software\Classes\<AppX ProgId>\Application
  ApplicationName        REG_SZ
  ApplicationIcon        REG_SZ
  AppUserModelID         REG_SZ
```

So an AppX default is usable but has no launchable path; status `unresolved`, launch by `explorer.exe shell:AppsFolder\<AUMID>` or the app's own CLI.

Friendly names: `(Get-Item $exe).VersionInfo.ProductName` beats the ProgId string (`BraveHTML` is not what the user calls it).

## 4. Why Writes Fail

`UserChoice\Hash` is an HMAC over the user SID, the target (`http`, `.pdf`), the ProgId, and the timestamp. Windows validates it when the association is used. A hand-written `ProgId` with a stale or absent hash is:

- ignored (treated as no `UserChoice`), or
- reset to the previous value on the next Settings apply, or
- replaced by the "how do you want to open this" prompt

There is no supported API. The only honoured path is the user acting in Settings. Same rule applies to `SetUserFTA`-style tools — unsupported, break on hash-secret changes between Windows builds, and are defeated by tamper protection.

## 5. Opening Settings

```powershell
Start-Process 'ms-settings:defaultapps'                    # top-level page
Start-Process 'ms-settings:defaultapps?registeredAppUser=' # per-app page (needs the registered app id)
```

There is no documented deep link that preselects `http` or `.pdf`. Name the exact target in chat so the user knows what to change, then re-run the resolver to confirm (`UserChoiceLatest` updates only after Settings applies the change).

## 6. Installed Browsers

```
HKLM\SOFTWARE\Clients\StartMenuInternet\<client>          (default) = display name
HKLM\SOFTWARE\WOW6432Node\Clients\StartMenuInternet\<client>
HKCU\SOFTWARE\Clients\StartMenuInternet\<client>
  shell\open\command                                      (default) = "\"<exe>\""
  Capabilities\URLAssociations\http                       ProgId the client registers
```

Chrome's and Brave's helpers also live under `HKCU\Software\Classes\ChromeHTML\...` / `BraveHTML\...`, but `StartMenuInternet` is the stable registry-declared browser list. Portable builds that never register there are invisible — say so instead of pretending the list is complete.

## 7. RecentApps (Warm Start)

```
HKCU\Software\Microsoft\Windows\CurrentVersion\Search\RecentApps\<AppId>
  LaunchCount       REG_DWORD
  LastAccessedTime  REG_BINARY  (FILETIME)
  AppId             REG_SZ
```

`AppId` is an AUMID (`Microsoft.WindowsCalculator_8wekyb3d8bbwe!App`) or a path-backed id. It answers "what does this user open" without resolving to an executable — treat it as a tiebreaker, never as the launch path.

Prefetch (`C:\Windows\Prefetch\*.pf`) and SRUM (`C:\Windows\System32\sru\SRUDB.dat`) also carry usage counts but need elevation and parsing outside this skill's read-only scope.
