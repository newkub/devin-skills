# Use Case — Windows, Menus, and Permissions

> Describe the window scene as data, keep menus and shortcuts inside the platform budget, and grant capabilities group by group. Source: https://native-sdk.dev (accessed 2026-10-20)

## 1. Derive the window scene from the model

```ts
// src/core.ts
export function windows(model: Model): readonly WindowDescriptor[] {
  return [
    { label: "main", close_policy: "quit" },
    { label: "preferences", close_policy: "hide" },
  ];
}
```

Windows are a function of the model, not a call you make at runtime, so opening and closing one is an `update` that changes a flag the function reads. `main` is a reserved label, the scene is capped at 16 windows, and multi-window is desktop-only — the markup for a secondary window is chosen by its label.

## 2. Decide what closing actually does

`close_policy: "quit"` ends the app; `close_policy: "hide"` keeps it running with the window hidden. On Windows, hiding requires the `"tray"` capability — without it the window disappears from the taskbar with no tray icon to bring it back, which users report as a crash:

```sh
native validate app.json   # after declaring the tray capability
```

On Linux the tray service is `UnsupportedService`, so a hide-on-close app must either show a different close policy there or ship without the feature.

## 3. Stay inside the menu and shortcut budget

| Surface | Limit | Consequence of exceeding |
|---------|-------|--------------------------|
| Windows in the scene | 16 | The extra descriptor is ignored |
| Menu bars | 16 menus | The menu is dropped |
| Items per menu | 128 | The tail of the menu is cut |
| Global shortcuts | 64 | Later shortcuts never fire |

Give every command a stable id and drive it from one place, because the id is also what automation and the menu refer to:

```sh
native automate menu-command preferences
native automate shortcut "CmdOrCtrl+K"
```

An id renamed in the model but not in the menu leaves a dead item that looks enabled and does nothing.

## 4. Grant permissions per group, not globally

Permissions are default-deny, in groups: `window`, `command`, `view`, `dialog`, `filesystem`, `clipboard`, `credentials`, `network`, `camera`, `microphone`, `system_audio`, `location`, `notifications`.

Rules that keep the surface small:

1. Grant a group only when a feature in the build touches it — a notes app needs `window` and `command`, not `network`
2. The JS bridge groups (`dialogs`, `os`, `clipboard`, `credentials`) stay denied unless web content genuinely needs them; `js_window_api` opens `window`, `view`, and `webview` together, so prefer narrower grants
3. Paths outside the app roots need `filesystem` — the failure appears at runtime, not at `native check`
4. Re-run `native validate app.json` after every edit to the manifest

## 5. Allowlist navigation and external links

Navigation is limited to `zero://app`, `zero://inline`, the exact dev origin, and whatever `navigation.allowed_origins` adds. External links stay denied unless the action is `open_system_browser` and the URL is in `allowed_urls` — an exact URL, or a prefix with a single trailing `/*`.

A `https://*` entry turns the allowlist into decoration: any page the user can be tricked into means the app will open it in their browser. List the hosts you actually hand off to, and review the list when a feature is removed.

## 6. Verify

1. `native validate app.json` — manifest accepted with the capabilities you declared
2. Open the preferences window, close it — the app keeps running and the tray icon reopens it
3. Close the main window on Windows — with `quit`, the process exits; check the task manager, not just the screen
4. `native automate menu-command preferences` — the same window opens as from the menu
5. Open a path outside the app root without `filesystem` — the action fails and the UI reports it rather than hanging
6. Click an external link that is not allowlisted — nothing opens, and the log names the URL

## Pitfalls

- Hiding on close on Windows without the `tray` capability, leaving a running process with no window and no icon.
- Treating `windows(model)` as an imperative API and calling it from an event.
- Over 64 shortcuts registered globally, so the ones at the end silently never fire.
- Granting `js_window_api` because a dialog is needed, which also opens `view` and `webview`.
- Adding `https://*` to the external allowlist to make one link work.
- Assuming Linux has a tray and shipping a hide-only close policy there.
- Testing multi-window behaviour on mobile — the scene model is desktop-only.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/packaging-platform-security.md`
- `best-practices/native-ui-markup.md`
- `usecases/persistence-store-and-sqlite.md`
- `usecases/automation-assert-and-ci.md`
