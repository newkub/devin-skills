# Health Score

Convert the fifteen dimension verdicts from `references/dimensions.md` into one 0–100 number. The thresholds live there; this file only turns verdicts into points.

## 1. Weights

Fixed weights, sum = 100. Security, disk space, OS patch, and disk health carry the most because their failure degrades everything else.

| No. | Dimension | Weight |
|-----|-----------|--------|
| 1 | Disk And Space | 10 |
| 2 | Leftover App Data | 5 |
| 3 | Containers And Virtual Disks | 5 |
| 4 | Temp, Logs, Dumps, Recycle Bin | 4 |
| 5 | Program Updates | 6 |
| 6 | OS Patch And Pending Reboot | 10 |
| 7 | Startup, Processes, Listeners | 6 |
| 8 | Environment, PATH, Shell Profile | 5 |
| 9 | Security Posture | 14 |
| 10 | Network, DNS, Proxy, Hosts | 6 |
| 11 | Disk Health | 10 |
| 12 | Backup And Restore Point | 6 |
| 13 | Scheduled Tasks, Services, Clock | 5 |
| 14 | Power, Battery, Thermal | 3 |
| 15 | Dev Hygiene | 5 |

## 2. Deductions

Start at 100. Deduct once per dimension, using its own verdict:

| Verdict | Deduction |
|---------|-----------|
| `pass` | 0 |
| `warn` | `floor(weight / 2)` |
| `fail` | full `weight` |
| `unknown` | `ceil(weight / 4)` |
| `deferred` | 0 for the `report` mode, `unknown` rules apply in `deep` |

Rules:

1. One deduction per dimension — never stack two findings inside the same row
2. `unknown` is a penalty, not a pass; a probe that could not run is a gap in coverage
3. `deferred` exists only in `report` mode for slow probes; the score therefore covers fast probes only and the report must say so

Worked example: disk `warn` (10 → 5), OS patch `pass` (0), security `fail` (14), disk health `unknown` (10 → 3), everything else `pass` → `100 − 5 − 14 − 3 = 78` → band B.

## 3. Bonuses

Applied after deductions, then the total is capped at 100. Each is all-or-nothing across every observed volume or control.

| Bonus | Points | Condition |
|-------|--------|-----------|
| Headroom | +3 | Every volume has ≥ 30 % free |
| Hardened | +3 | Every security control in dimension 9 passes |
| Backed up | +4 | A backup completed and was verified within 7 days |

Bonuses never offset a `fail` in the same area — a machine with encryption off still reports the deduction, and the bonus only applies when the whole set passes.

## 4. Bands

| Band | Range | Meaning |
|------|-------|---------|
| A | 90–100 | Healthy — keep the current routine |
| B | 75–89 | Good — a few cheap wins remain |
| C | 60–74 | Attention — fix the top two deductions this week |
| D | 40–59 | Poor — multiple live risks, act now |
| E | 0–39 | Critical — data loss or security exposure is plausible |

## 5. Reproducibility

The same probe results must always produce the same score.

1. Walk dimensions 1→15 in order, never in discovery order
2. Record the verdict per dimension before computing anything
3. Compute once at the end from the recorded verdicts
4. Print the score as `<score>/100 (band <X>)` plus the three largest deductions and their dimension names
5. Print the probe command and OS in the report header — a score without them cannot be reproduced

## 6. Fastest Wins

Used by step 3 of `SKILL.md` to pick the top three improvers. Rank by points recoverable per unit of user effort, not by points alone.

| No. | Dimension | Recover | Cheapest path |
|-----|-----------|---------|---------------|
| 1 | Disk And Space | up to 10 | `/cleanup-disk-computer` — no data loss |
| 2 | Security Posture | up to 14 | enable the one disabled control, then re-probe |
| 3 | OS Patch And Pending Reboot | up to 10 | apply pending updates, reboot at a chosen time |
| 4 | Disk Health | up to 10 | back up first, then repair — highest risk |
| 5 | Temp, Logs, Dumps, Recycle Bin | up to 4 | `/delete-temp` — regenerates itself |
| 6 | Dev Hygiene | up to 5 | `/cleanup-artifact` + `/delete-temp` |

Dimensions 2, 3, 5, 7, 8, 10, 12, 13, 14, 15 stay below 6 points each — fix them only after the top three, unless one is `fail` and cheap to reverse.
