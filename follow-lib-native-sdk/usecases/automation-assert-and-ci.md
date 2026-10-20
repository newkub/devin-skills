# Use Case — Automation Assertions and CI Tiers

> Let the CLI drive the real app and prove a label exists before a human looks at it, then run the same checks in the CI tier that matches their cost. Source: https://native-sdk.dev (accessed 2026-10-20)

## 1. Build a binary that can be driven

```sh
native build -Dautomation=true
```

A normal ReleaseFast build has no automation server, so `.zig-cache/native-sdk-automation/` never appears and every `native automate` command fails. Build the automation variant for testing and keep the release build clean.

## 2. Assert on the snapshot, not on a screenshot

```sh
native automate snapshot
native automate assert "Inbox" --timeout-ms 5000
native automate assert "No notes yet" --absent
```

`snapshot.txt` lists widget roles, labels, commands, and a ready flag; `accessibility.txt` and `windows.txt` carry the tree and the window scene. An assert against the snapshot is deterministic and cheap. `--timeout-ms` is what makes it wait for an async result instead of racing the render, and `--absent` is how you assert that an error banner did not appear.

## 3. Drive the app the way a user would

```sh
native automate widget-click compose
native automate menu-command preferences
native automate shortcut "CmdOrCtrl+N"
native automate reload
native automate bridge '{"command":"reset","payload":{}}'
```

Each command goes into a `command-<n>.txt` queue that the runtime consumes and deletes as its acknowledgement. Never write or delete those files yourself: a hand-deleted command is re-dispatched, and a hand-written one has no schema validation. Screenshots are named by view label (`screenshot-<label>.png`), which is why the label matters.

## 4. Keep assertions inside the regex subset

```sh
native automate assert "3 items? found"      # works
native automate assert "(Inbox|Archive)"     # does not — no groups or alternation
```

The assertion engine supports a small regex subset. When a pattern stops matching, inspect `snapshot.txt` for the literal text rather than adding regex features it does not have.

## 5. Record a session and replay it

```sh
NATIVE_SDK_SESSION_RECORD=1 native dev
NATIVE_SDK_SESSION_REPLAY=1 native test
```

Recording captures the messages and effects of a real session; replay re-runs them and `verifyReplay()` fails if the outcome diverges. That is the regression gate after a markup or refactor pass: the same inputs must produce the same model, not merely a similar screen.

## 6. Put the checks in the tier that fits

| Tier | Runner | Build | What it proves |
|------|--------|-------|----------------|
| Unit | Any OS in CI | `-Dplatform=null` | `update` and markup derive the right view from the model |
| Integration | Linux with Xvfb | `-Dautomation=true` | The real window tree responds to clicks and menu commands |
| GUI smoke | macOS runner | Release plus automation | Rendering, focus, and platform integration |

Golden screenshots byte-compare only on the same runner image — text measurement differs across hosts. Store a golden next to the image that produced it, or the tier fails on the first runner upgrade.

## 7. Verify

1. `native check --strict` and `native test` — unit tier green before any automation run
2. `native build -Dautomation=true` — the automation directory appears under `.zig-cache/`
3. `native automate snapshot` — the ready flag is set and the expected widgets are listed
4. An assert with `--timeout-ms` passes on a slow machine; the same assert without it fails
5. Record, change nothing, replay — `verifyReplay()` passes; change a binding, replay — it fails
6. CI: the null-platform job passes on a runner with no display

## Pitfalls

- Running `native automate` against a plain `native build`, where the protocol never starts.
- Editing `command-<n>.txt` or deleting it to "reset" the queue, which loses or duplicates commands.
- Asserting on a screenshot instead of the snapshot, which turns a text check into a pixel comparison.
- A regex with groups or alternation that silently never matches.
- Byte-comparing goldens recorded on a different runner image.
- Using automation in the release build, which ships a debug surface to users.
- Treating a passing snapshot as proof of behaviour — drive the action, then assert on the result.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/automation-testing.md`
- `best-practices/ts-core-subset.md`
- `usecases/scaffold-app.md`
- `usecases/windows-menus-and-permissions.md`
