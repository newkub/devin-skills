# Resolution Order

The contract every consumer follows when it needs "the user's app for this target".

## 1. Chain

| Order | Source | Decides when | Status label |
|-------|--------|--------------|--------------|
| 1 | Windows `UserChoice` | key exists, ProgId resolves, exe exists | `set` |
| 2 | Windows `UserChoice`, broken | key exists but exe missing → report `stale`; no command → `unresolved`; no key → `missing` | `stale`/`unresolved`/`missing` |
| 3 | Usage counter | order 1 is unusable and the counter has a count for the category | `counter` |
| 4 | Installed list | counter empty → `installedBrowsers` for `browser` only | `installed` |
| 5 | Ask the user | nothing above produced a usable exe | `ask` |

A working `UserChoice` always wins. The counter never overrides a real default — it only fills a hole. Do not "helpfully" switch a user off a default they set on purpose.

## 2. Category Mapping

| Category | Targets | Counter key prefix |
|----------|---------|-------------------|
| `browser` | `http`, `https` | `browser\|` |
| `mail` | `mailto` | `mail\|` |
| `editor` | `.txt`, `.md`, any `.ext` | `editor\|` |
| `other` | everything else | `other\|` |

## 3. Counter File

`%APPDATA%\devin\default-apps.json` — the only write this skill performs.

```json
{
  "version": 1,
  "counts": {
    "browser|C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe": 34,
    "browser|C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe": 6,
    "editor|C:\\Users\\me\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe": 12
  },
  "updatedAt": "2026-10-24T09:12:44.1234567+07:00"
}
```

Rules:

- Flat `"<category>|<absolute exe path>"` keys — no nesting, no case folding, no path normalization beyond what the launcher reports
- Increment by exactly 1 per real launch; never backfill, never infer from history
- Corrupt or unreadable file → treat as empty, do not fail the whole resolution
- Deleting the file resets the signal; say so rather than "fixing" it silently

## 4. Status Semantics

| Status | Meaning | Action |
|--------|---------|--------|
| `set` | ProgId resolved to an existing exe | use it |
| `stale` | ProgId resolved but the exe is gone (uninstalled/moved) | report as root cause of wrong-app launches; open Settings |
| `missing` | no `UserChoice` key for the target | open Settings, or fall back per §1 |
| `unresolved` | ProgId has no `shell\open\command` (AppX/UWP) | usable by name (`shell:AppsFolder\<AUMID>`), not by path |

`stale` is the valuable one: it is the honest answer to "why does my link open a browser I deleted".

## 5. What Consumers Receive

Every consumer gets the same shape, so no skill re-implements the chain:

```
target      http | https | mailto | .ext
appName     friendly product name            (null when unknown)
exe         absolute path                    (null for AppX)
status      set | stale | missing | unresolved
source      userchoice | counter | installed | ask
```

Rules for consumers:

1. Launch `exe` when `status = set` or `source` is `counter`/`installed`
2. Never hardcode a vendor name; if the resolved value is missing, use `/ask-me`
3. Record the launch with `-Record <exe> -Category <category>` so the fallback keeps improving
4. Re-resolve per run, not once per install — users change defaults mid-project

## 6. Known Limits

- Portable/unregistered apps never appear in `installedBrowsers`
- Windows Terminal's default profile is stored in its own `settings.json`, not in `UserChoice` — out of scope
- `http` and `https` can diverge; report both, never assume one implies the other
- RecentApps gives AppIds, not paths; use it only as a tiebreaker between candidates the counter already knows
