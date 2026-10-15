# Maestro Flow Authoring — Best Practices

Patterns verified against the official repo (`mobile-dev-inc/Maestro`, Apache-2.0) and maestro.dev docs.

## 1. Keep Flows Flat And Independent

- One journey = one file; no cross-file state. Shared setup goes into a subflow called with `- run: subflow.yaml`
- `tags:` on the flow let CI shard: `maestro test --include-tags smoke flows/`

## 2. Selector Discipline

- Order of preference: exact text → `id:` → relative position (`below:`, `above:`, `leftOf:`)
- Duplicate matches: use index selectors or narrow with a parent `visible:` condition — Maestro fails on ambiguous taps, so fix the selector, don't wrap in `optional: true` to silence it
- Web target: selectors work on accessibility roles/labels — write accessible UI first (ties to `/follow-web-standard`)

## 3. Don't Fight The Waiter

- Maestro auto-waits for views; adding `waitUntilVisible` + long `stopApp/launchApp` cycles is an anti-pattern that hides real timing bugs
- Animations cause the most flakes: disable app animations on emulator/simulator (`adb shell settings put global window_animation_scale 0` and friends) instead of retrying flows

## 4. Conditional UI, Not Brittle Assertions

- Popups/onboarding that appear once: `- when: visible: "Skip"` steps, so the flow still passes after onboarding is done
- Use `assertVisible` for outcomes, not intermediate screens — fewer breaks on UI redesign

## 5. Agentic Authoring Loop

- With `maestro mcp` registered, let the agent explore the app first (inspect screen, try taps), then ask for the YAML flow and run it until green — the generated flow is the deterministic CI artifact; the agent loop is throwaway
- Review generated selectors the same way as human-written ones before committing

## 6. CI

- `maestro test --format JUNIT flows/ > report.xml`, upload as artifact; headless Android needs an emulator service or a booted emulator in the runner
- Physical iOS devices are unsupported — plan device-farm needs separately (Maestro Cloud is the paid path; don't add it silently)

## 7. Pitfalls

- Java missing or < 17 → CLI fails at startup, not at test time — check in setup, not CI
- React Native `testID` must be wired to the native view; in debug builds only, release builds may strip it — keep one release-build smoke flow
- `appId` differs per platform: use `- launchApp: appId: "{{APP_ID}}"` with `maestro test -e APP_ID=...`
