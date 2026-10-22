# Automation & Testing Tiers

Every app has a built-in automation server — design it to be testable at unit, harness, and agent-driven E2E levels

## Recommended patterns

- 3 tiers per the docs (CI scaffolds from `native init --full`):
  1. unit — `-Dplatform=null` (`NullPlatform`, view = f(model)) runs fast on every platform in CI
  2. integration — Linux Xvfb + `-Dautomation=true`, driving for real through the automation protocol
  3. GUI smoke — macOS runner (deepest surface)
- TS-level app tests with `native test` + `@native-sdk/core/testing`:
  ```ts
  const app = await NativeApp.start({ wallMs: 0 })   // deterministic clock
  app.click("increment")
  expect(app.findWidget("count").text).toBe("1")
  app.fireTimer("tick")
  app.respond(key, bytes, ok)   // answer a pending effect/request
  app.verifyReplay()             // record/replay determinism
  ```
  Use `snapshot.windows/effects.requests/timers` to check state instead of reading widgets one at a time
- Zig-level harness: `TestHarness` (create/destroy + `BufferSink`) for runtime wiring below the core
- Agent-driven verification (file protocol): build with `-Dautomation=true`, then read/write under `.zig-cache/native-sdk-automation/`:
  - `snapshot.txt` (roles/labels/commands/ready), `accessibility.txt`, `windows.txt`, `screenshot-<view-label>.png`, `provenance.txt`
  - drive it through the queue: `command-<n>.txt` (the CLI writes it, the runtime consumes+deletes it = ack) — or use the CLI:
  ```sh
  native automate snapshot
  native automate assert "Counter" [--timeout-ms 5000] [--absent]
  native automate widget-click <id> | menu-command <id> | shortcut <combo> | screenshot | reload | resize | wait | bridge '<json>'
  ```
- Record/replay: `NATIVE_SDK_SESSION_RECORD=1` captures a session → `REPLAY=1` + `verifyReplay()` — use as a regression gate after markup refactors
- Determinism: time is an input (`wallMs`), not ambient — apps that inject the clock through msgs are always deterministic to test

## Pitfalls

- assert regex is a subset — no capture groups/alternation; write simple patterns matching the text the snapshot shows
- golden screenshots only byte-compare on the same runner image — text measurement differs across hosts; store goldens with the image recorded
- don't forget to enable automation at build time when using `native automate` — the protocol dir never appears with a normal build (ReleaseFast has no `-Dautomation=true`)
- the command queue is ack-by-delete — deleting/editing queue files yourself loses or re-dispatches commands; always drive it via `native automate`
- mobile automation is a separate path — snapshot/actions go through the embed ABI and the file protocol lives in the app data container (experimental, API may change)
- bridge responses are read from `bridge-response.txt` — don't poll in a way that races the filesystem; let the CLI own the protocol
