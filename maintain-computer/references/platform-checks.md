# Platform Checks

Read-only probes per OS. Numbers match `references/dimensions.md`.

## How To Run

- Keep only the line the threshold needs; never dump raw output into the report
- A probe that errors (missing tool, permission denied) sets the dimension to `unknown` — do not install the tool
- Prefer the listed command; when a tool is absent use the fallback listed in the same row
- `report` mode runs the fast column; `deep` mode adds the slow probe

## Windows (PowerShell)

| # | Probe | Command |
| --- | --- | --- |
| 1 | Volume free space | `Get-PSDrive -PSProvider FileSystem \| Select Name,@{n='UsedGB';e={[math]::Round($_.Used/1GB,1)}},@{n='FreeGB';e={[math]::Round($_.Free/1GB,1)}}` |
| 1 | Large user folders (deep) | `dua aggregate -A $env:USERPROFILE` — fallback: `Get-ChildItem $env:USERPROFILE -Directory \| ForEach-Object { [pscustomobject]@{ Name=$_.Name; GB=[math]::Round((Get-ChildItem $_.FullName -Recurse -Force -File -ErrorAction SilentlyContinue \| Measure-Object Length -Sum).Sum/1GB,1) } } \| Sort GB -Desc \| Select -First 10` |
| 2 | Orphan app data | Delegate to `/check-orphan-programdata` |
| 3 | Docker reclaimable | `docker system df` |
| 3 | WSL / Docker disks | `Get-ChildItem "$env:LOCALAPPDATA\Docker\wsl","$env:LOCALAPPDATA\Packages" -Recurse -Filter *.vhdx -ErrorAction SilentlyContinue \| Select FullName,@{n='GB';e={[math]::Round($_.Length/1GB,1)}}` |
| 4 | Temp and dumps | `'C:\Windows\Temp',$env:TEMP,"$env:LOCALAPPDATA\CrashDumps","$env:SystemDrive\`$Recycle.Bin" \| ForEach-Object { [pscustomobject]@{ Path=$_; GB=[math]::Round((Get-ChildItem $_ -Recurse -Force -File -ErrorAction SilentlyContinue \| Measure-Object Length -Sum).Sum/1GB,2) } }` |
| 5 | Outdated packages | `winget upgrade --include-unknown`; `scoop status`; `mise outdated` |
| 6 | Last OS update | `Get-HotFix \| Sort InstalledOn -Descending \| Select -First 3 HotFixID,InstalledOn` |
| 6 | Pending reboot | `Test-Path 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Auto Update\RebootRequired'` |
| 7 | Autostart | `Get-CimInstance Win32_StartupCommand \| Select Name,Location,Command` |
| 7 | Heavy processes | `Get-Process \| Sort WorkingSet64 -Descending \| Select -First 10 Name,Id,@{n='MB';e={[math]::Round($_.WorkingSet64/1MB)}}` |
| 7 | Listeners | `Get-NetTCPConnection -State Listen \| Select LocalPort,OwningProcess` |
| 8 | PATH issues | `($env:PATH -split ';') \| Group-Object \| Where Count -gt 1`; `($env:PATH -split ';') \| Where { $_ -and -not (Test-Path $_) }` |
| 8 | Profile load | `Measure-Command { pwsh -NoProfile -Command 'exit' }` and again without `-NoProfile` |
| 9 | Protection | `Get-MpComputerStatus \| Select AntivirusEnabled,RealTimeProtectionEnabled,AntivirusSignatureAge` |
| 9 | Firewall | `Get-NetFirewallProfile \| Select Name,Enabled` |
| 9 | Encryption | `Get-BitLockerVolume \| Select MountPoint,ProtectionStatus,VolumeStatus` |
| 9 | TPM | `Get-Tpm \| Select TpmReady,TpmEnabled` |
| 9 | RDP | `(Get-ItemProperty 'HKLM:\System\CurrentControlSet\Control\Terminal Server').fDenyTSConnections` |
| 9 | UAC | `(Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System').EnableLUA` |
| 10 | DNS | `Resolve-DnsName example.com -DnsOnly \| Select -First 2 Name,IPAddress` |
| 10 | Gateway | `Get-NetRoute -DestinationPrefix '0.0.0.0/0' \| Select -First 1 NextHop` then `Test-Connection <nextHop> -Count 2` |
| 10 | Proxy | `netsh winhttp show proxy` |
| 10 | Hosts | `Get-Content 'C:\Windows\System32\drivers\etc\hosts' \| Where { $_ -and $_ -notmatch '^\s*#' }` |
| 11 | Disk health | `Get-PhysicalDisk \| Select FriendlyName,HealthStatus,OperationalStatus` |
| 11 | Reliability counters | `Get-PhysicalDisk \| Get-StorageReliabilityCounter \| Select DeviceId,Wear,ReadErrorsTotal,WriteErrorsTotal` |
| 11 | Filesystem errors | `Get-WinEvent -FilterHashtable @{LogName='System';Level=1,2;StartTime=(Get-Date).AddDays(-7)} -MaxEvents 20 \| Select TimeCreated,ProviderName,Id` |
| 11 | TRIM (deep) | `Get-Volume \| Select DriveLetter,FileSystemType`; `fsutil behavior query DisableDeleteNotify` |
| 12 | Restore points | `Get-ComputerRestorePoint \| Sort CreationTime -Descending \| Select -First 3` |
| 12 | Backup summary | `Get-WBSummary` (Windows Backup only; absent → `unknown`) |
| 13 | Failed tasks | `Get-ScheduledTask \| ForEach-Object { $i = $_ \| Get-ScheduledTaskInfo; if ($i.LastTaskResult -ne 0) { [pscustomobject]@{ Task=$_.TaskName; Result=$i.LastTaskResult; Last=$i.LastRunTime } } }` |
| 13 | Stopped auto services | `Get-Service \| Where StartType -eq 'Automatic' -and Status -ne 'Running' \| Select Name,Status` |
| 13 | Clock | `w32tm /query /status` (needs the service; absent → `unknown`) |
| 14 | Battery | `Get-CimInstance Win32_Battery \| Select EstimatedChargeRemaining,BatteryStatus` |
| 14 | Power plan | `powercfg /getactivescheme` |
| 14 | Thermal events | `Get-WinEvent -FilterHashtable @{LogName='System';Id=86,87,88} -MaxEvents 10 -ErrorAction SilentlyContinue` |
| 15 | Dev hygiene | Delegate to `/check-uncommit`, `/check-unpush`; sizes via `dua aggregate -A <repo>` |

## macOS (bash / zsh)

| # | Probe | Command |
| --- | --- | --- |
| 1 | Volumes | `df -h /`; `df -h /System/Volumes/Data` |
| 1 | Large folders (deep) | `dua aggregate -A ~` — fallback `du -sh ~/* 2>/dev/null \| sort -h \| tail -10` |
| 2 | Orphan app data | Delegate to `/check-orphan-programdata` |
| 3 | Docker | `docker system df`; `du -sh ~/Library/Containers/com.docker.docker/Data/vms 2>/dev/null` |
| 4 | Temp and logs | `du -sh ~/Library/Logs /tmp ~/.Trash 2>/dev/null` |
| 5 | Outdated | `brew outdated`; `brew outdated --cask --greedy`; `mise outdated` |
| 6 | OS updates | `softwareupdate -l` |
| 6 | Install history | `system_profiler SPInstallHistoryDataType \| tail -40` |
| 7 | Launch agents | `launchctl list \| awk '$2 == 0 {print}' \| head -40` |
| 7 | Heavy processes | `ps -Ao pid,comm,%cpu,%mem -r \| head -11` |
| 7 | Listeners | `lsof -nP -iTCP -sTCP:LISTEN` |
| 8 | PATH | `echo "$PATH" \| tr ':' '\n' \| sort \| uniq -d`; `for p in ${PATH//:/ }; do [ -d "$p" ] \|\| echo "missing: $p"; done` |
| 8 | Profile load | `time zsh -i -c exit` (or `bash -i -c exit`) |
| 9 | Firewall | `/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate` |
| 9 | Gatekeeper | `spctl --status`; `csrutil status` |
| 9 | FileVault | `fdesetup status` |
| 9 | Remote login | `systemsetup -getremotelogin` (needs sudo; denied → `unknown`) |
| 10 | DNS | `scutil --dns \| sed -n '1,20p'`; `dscacheutil -q host -a name example.com` |
| 10 | Gateway | `route -n get default \| grep gateway`; then `ping -c 2 <gateway>` |
| 10 | Proxy | `scutil --proxy` |
| 10 | Hosts | `grep -vE '^\s*(#\|$)' /etc/hosts` |
| 11 | S.M.A.R.T. | `diskutil info disk0 \| grep -i smart`; `smartctl -H /dev/disk0` when `smartmontools` exists |
| 11 | Volume verify (deep) | `diskutil verifyVolume /` (verify only — never `repairVolume`) |
| 11 | Filesystem errors | `log show --last 7d --predicate 'eventMessage CONTAINS[c] "I/O error"' --style compact \| tail -20` |
| 12 | Time Machine | `tmutil destinationinfo`; `tmutil latestbackup` |
| 12 | Local snapshots | `tmutil listlocalsnapshots /` |
| 13 | Failed jobs | `launchctl list \| awk '$2 != 0 && $2 != "-" {print}'` |
| 13 | Clock | `sntp time.apple.com \| tail -3` (query only) |
| 14 | Battery | `pmset -g batt`; `system_profiler SPPowerDataType \| grep -A2 'Condition'` |
| 14 | Thermal | `pmset -g therm` |
| 15 | Dev hygiene | Delegate to `/check-uncommit`, `/check-unpush`; sizes via `dua aggregate -A <repo>` |

## Linux (bash)

| # | Probe | Command |
| --- | --- | --- |
| 1 | Filesystems | `df -hT -x tmpfs -x devtmpfs` |
| 1 | Large folders (deep) | `dua aggregate -A ~` — fallback `du -xsh ~/* 2>/dev/null \| sort -h \| tail -10` |
| 2 | Orphan app data | Delegate to `/check-orphan-programdata` |
| 3 | Docker | `docker system df`; `du -sh /var/lib/docker 2>/dev/null` |
| 4 | Temp and journal | `du -sh /tmp /var/tmp 2>/dev/null`; `journalctl --disk-usage` |
| 5 | Outdated | `apt list --upgradable 2>/dev/null`; `dnf check-update`; `pacman -Qu`; `flatpak remote-ls --updates`; `snap refresh --list`; `mise outdated` |
| 6 | Pending updates | `apt-get -s upgrade \| tail -3`; `dnf check-update -q` (exit `100` means updates exist) |
| 6 | Pending reboot | `test -f /var/run/reboot-required && cat /var/run/reboot-required.pkgs` |
| 7 | Running services | `systemctl list-units --type=service --state=running --no-pager` |
| 7 | Listeners | `ss -tulpn` |
| 7 | Heavy processes | `ps -eo pid,comm,%cpu,%mem --sort=-%cpu \| head -11` |
| 8 | PATH | `echo "$PATH" \| tr ':' '\n' \| sort \| uniq -d`; `for p in ${PATH//:/ }; do [ -d "$p" ] \|\| echo "missing: $p"; done` |
| 8 | Profile load | `time bash -lic exit` |
| 9 | Firewall | `ufw status verbose`; `firewall-cmd --state`; `systemctl is-active firewalld` |
| 9 | Protection | `systemctl is-active clamav-daemon`; `getenforce`; `aa-status --enabled` |
| 9 | Encryption | `lsblk -o NAME,TYPE,FSTYPE,MOUNTPOINT`; `cryptsetup status <mapper>` when LUKS is present |
| 9 | Remote login | `sshd -T \| grep -E 'permitrootlogin\|passwordauthentication'` (needs root; denied → `unknown`) |
| 9 | ASLR / updates | `sysctl kernel.randomize_va_space`; check the unattended-upgrade or dnf-automatic unit is active |
| 10 | DNS | `resolvectl status \| sed -n '1,25p'` |
| 10 | Gateway | `ip route \| grep default`; then `ping -c 2 <gateway>` |
| 10 | Proxy | `env \| grep -iE '^(http\|https\|no)_proxy='` |
| 10 | Hosts | `grep -vE '^\s*(#\|$)' /etc/hosts` |
| 11 | S.M.A.R.T. | `smartctl -H /dev/nvme0n1` or `/dev/sda` (needs `smartmontools`; absent → `unknown`) |
| 11 | TRIM | `systemctl status fstrim.timer --no-pager`; `lsblk -D` |
| 11 | Kernel errors | `dmesg -T --level=err,crit,alert \| tail -20` (needs root; denied → `unknown`) |
| 12 | Backup units | `systemctl list-timers --all \| grep -iE 'backup\|restic\|borg'`; `timeshift --list` when installed |
| 13 | Failed units | `systemctl --failed --no-pager` |
| 13 | Clock | `timedatectl`; `chronyc tracking` when chrony is present |
| 14 | Battery | `upower -i "$(upower -e \| grep -m1 BAT)"` |
| 14 | Thermal | `sensors 2>/dev/null \| head -20`; `journalctl -k \| grep -i thermal \| tail -10` |
| 15 | Dev hygiene | Delegate to `/check-uncommit`, `/check-unpush`; sizes via `dua aggregate -A <repo>` |

## Unsupported Or Restricted

- No `dua` and no `du`/PowerShell fallback → size rows become `unknown`, not estimates
- A probe needing elevation the session does not have → `unknown` with reason `needs elevation`
- A container, VM, or WSL guest reports the host's disks in some probes → note the scope in `evidence` and do not score host-only dimensions (11, 12, 14) as `fail` on a guest
- A probe that would change state (`repairVolume`, `sfc /scannow`, `DISM /RestoreHealth`, `chkdsk /f`, `smartctl -t`) is a fix, never a check — route it to `fix` mode with confirmation
