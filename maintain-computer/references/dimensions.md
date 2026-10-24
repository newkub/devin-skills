# Dimensions

Fifteen checks in fixed order. Each row names one owner skill; `maintain-computer` probes and scores, the owner skill fixes.

Status vocabulary: `pass` / `warn` / `fail` / `unknown`. Thresholds here are the only source of truth — `references/health-score.md` converts them to points.

## 1. Disk And Space

- Check: free space on every fixed volume, the ten largest folders under the user roots, and the reclaimable cache total
- Pass: every system volume has ≥ 15 % free **and** ≥ 10 GB free
- Warn: below either bound, but still ≥ 5 % and ≥ 2 GB
- Fail: < 5 % free or < 2 GB free on a system volume
- Owner: `/cleanup-disk-computer` (caches, temp) and `/cleanup-artifact` (build artifacts, dependency caches)
- Fix mode: `clean`, dry run first

## 2. Leftover App Data

- Check: folders under `ProgramData` / `Program Files` / `AppData` with no installed owner
- Pass: no orphan folder ≥ 1 GB
- Warn: orphan total 1–10 GB
- Fail: orphan total > 10 GB, or any single orphan > 5 GB
- Owner: `/check-orphan-programdata` (read-only report; removal is a separate confirmed step)
- Fix mode: `review`, never delete inside this skill

## 3. Containers And Virtual Disks

- Check: Docker reclaimable space and every WSL/Docker `.vhdx` size
- Pass: reclaimable < 2 GB and no `.vhdx` > 30 GB
- Warn: reclaimable 2–10 GB or a `.vhdx` 30–60 GB
- Fail: reclaimable > 10 GB or a `.vhdx` > 60 GB
- Owner: `/cleanup-docker`
- Fix mode: `clean`, dry run first

## 4. Temp, Logs, Dumps, Recycle Bin

- Check: size of the user temp root, the system temp root, crash dumps, and the recycle bin / trash
- Pass: total < 2 GB
- Warn: total 2–10 GB
- Fail: total > 10 GB
- Owner: `/delete-temp`
- Fix mode: `clean`, dry run first

## 5. Program Updates

- Check: outdated packages per manager in use (`winget`, `scoop`, `brew`, `apt`, `dnf`, `pacman`, `mise`, `cargo`, `npm` global)
- Pass: zero outdated
- Warn: 1–5 outdated
- Fail: > 5 outdated, or any security-critical runtime (shell, browser, SSH, runtime) more than 90 days behind
- Owner: `/update-all-program-in-computer`; single-tool version checks via `/check-update`
- Fix mode: `update`, one manager at a time

## 6. OS Patch And Pending Reboot

- Check: last installed OS update date, whether updates are pending, whether a reboot is required, and OS support status
- Pass: no pending update and no pending reboot
- Warn: reboot pending, or last update 30–90 days old
- Fail: updates pending > 30 days, OS build out of support, or update scan failing
- Owner: none — this skill owns the probe; installation stays with the OS tooling and needs confirmation
- Fix mode: `confirm`, `high` risk

## 7. Startup, Processes, Listeners

- Check: autostart entries, the ten heaviest processes, and every TCP listener with its owning process
- Pass: no unknown autostart entry and no orphaned listener holding a port
- Warn: 1–3 unknown autostart entries or a listener with no matching project
- Fail: > 3 unknown entries, or an orphaned listener blocking a port in use
- Owner: `/check-open-ports` for listeners; autostart changes need confirmation
- Fix mode: `review`, then `confirm`

## 8. Environment, PATH, Shell Profile

- Check: duplicate or missing PATH entries, broken profile snippets, and profile load time
- Pass: no broken entry and profile loads < 500 ms
- Warn: 1–3 issues or load 500 ms–2 s
- Fail: profile errors on load, shell cannot start cleanly, or > 3 broken PATH entries
- Owner: `/check-system-env` and `/check-shell-profile`
- Fix mode: `review`, then `confirm` for profile edits

## 9. Security Posture

- Check: firewall state, antivirus / endpoint protection and signature age, disk encryption, remote login / RDP, and user-account control
- Pass: firewall on, protection on with signatures ≤ 7 days, disk encryption on, remote login off, elevation prompt on
- Warn: exactly one control off or signatures 7–30 days
- Fail: protection off or signatures > 30 days, encryption absent on a portable device, or remote login exposed with no restriction
- Owner: none for the probe; secret findings route to `/check-secrets`, deeper review to `/scan-security`
- Fix mode: `confirm`, `high` risk

## 10. Network, DNS, Proxy, Hosts

- Check: default gateway reachability, DNS resolution and latency, configured proxy, and non-default `hosts` entries
- Pass: gateway reachable, DNS resolves in < 100 ms, no unexpected proxy, only known `hosts` entries
- Warn: DNS 100 ms–500 ms or one unexpected `hosts` entry
- Fail: no connectivity, DNS failure, or a `hosts` entry redirecting a known domain
- Owner: none — this skill owns the probe
- Fix mode: `confirm` for any `hosts` or proxy change

## 11. Disk Health

- Check: S.M.A.R.T. health, reallocated / pending sectors, filesystem errors, and TRIM state on SSD
- Pass: health OK, zero failing attributes, TRIM enabled
- Warn: one non-fatal attribute flagged, or TRIM disabled
- Fail: health failing, bad sectors present, or a filesystem error in the log
- Owner: none — this skill owns the probe; repair is never automatic
- Fix mode: `review`, `high` risk (back up before any repair)

## 12. Backup And Restore Point

- Check: last successful backup, backup destination reachable, and the newest restore point or snapshot
- Pass: backup within 7 days and destination reachable
- Warn: last backup 7–30 days old, or destination unreachable now
- Fail: no backup ever, or last backup > 30 days
- Owner: none — this skill owns the probe
- Fix mode: `confirm` (creating a restore point or a first backup is a write)

## 13. Scheduled Tasks, Services, Clock

- Check: failed scheduled tasks in the last 7 days, automatic services that are stopped, and clock offset
- Pass: zero failed tasks, zero stopped automatic services, offset < 2 s
- Warn: 1–3 failed tasks or offset 2–60 s
- Fail: a critical service stopped, or offset > 60 s
- Owner: none — this skill owns the probe
- Fix mode: `confirm`, `high` risk for service changes

## 14. Power, Battery, Thermal

- Check: battery health ratio, active power plan, and thermal-throttle or overheat events
- Pass: battery ≥ 80 % of design capacity, no throttle events, no unexpected shutdown
- Warn: battery 60–80 %, or occasional throttle events
- Fail: battery < 60 %, or repeated thermal shutdown
- Owner: none — this skill owns the probe
- Fix mode: `review`

## 15. Dev Hygiene

- Check: oversized `node_modules` / `target` / `.git` directories, `.devin/temp` size, repos with uncommitted changes, and branches with unpushed commits
- Pass: no artifact directory > 2 GB, no copied temp > 1 GB, no active repo left dirty or unpushed
- Warn: one repository dirty or unpushed, or artifact total 2–10 GB
- Fail: any artifact directory > 20 GB, or a repo unpushed > 30 days
- Owner: `/cleanup-artifact`, `/delete-temp`, `/check-uncommit`, `/check-unpush`
- Fix mode: `clean` for caches, `review` for git state (never auto-commit)

## Overlap Notes

- Dimension 1 and dimension 15 both read folder sizes — dimension 1 reports the volume verdict, dimension 15 reports the dev-specific offenders. Report both rows.
- Dimension 2 and dimension 4 can match the same folder · keep them separate, size each once, and note the overlap.
- Dimension 5 and dimension 6 differ: 5 is application packages, 6 is the OS itself.
