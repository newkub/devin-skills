# Capgo OTA Best Practices

Guidelines for using `@capgo/capacitor-updater` for OTA updates of Capacitor apps — update flow, channels, rollback, and CI upload

## Recommended Patterns

### Update Flow

- Always call `CapacitorUpdater.notifyAppReady()` after the app boots successfully — without it within the timeout, the plugin rolls the bundle back automatically (this is a safety mechanism, not optional)
- Call `notifyAppReady()` after the critical render completes, not at process start — calling too early marks a broken-render bundle as "ready" by mistake
- Pick the mode that matches the use case:
  - `autoUpdate: true` — suits content apps that need fast updates
  - Manual `download()` → `set()` → `reload()` — suits apps that need their own conditions (e.g. wait for user idle)
- Listen to `updateAvailable`/`downloadComplete` events for telemetry — know whether the update actually reached the device
- Do staged rollouts via channels: `internal` → `staging` → `production` — never push production straight from a local build

### Channel Strategy

- At least 2 channels: `production` (public) and `staging` (QA/internal testers)
- Assign the channel with `capgo channel set --channel <name> --latest` after upload — keep this a separate step from upload so the bundle can be reviewed before promote
- Use versioned channels (`v2-hotfix`) when a bundle must be pinned to a specific app version

### Rollback Readiness

- Really test the rollback path: upload a broken bundle (e.g. one that throws at boot) to staging → verify the app reverts to the previous bundle by itself
- The previous bundle stays on the device — the updater does this automatically, but do not clear the cache by hand
- If a new bundle breaks after `notifyAppReady` (slow crash) — use `CapacitorUpdater.reset()` or revert the channel from the Capgo dashboard/CLI
- Monitor the crash-free rate after deploy — the rollback mechanism catches boot failures but not delayed runtime crashes

### Signing And Security

- Enable signed updates (`capgo key save` + config) for production — the device verifies the signature before applying the bundle, preventing MITM/tampered bundles
- `CAPGO_TOKEN` is a CI secret only — never embed it in app code or commit it
- App-side config (the updater section of `capacitor.config`) may hold appId/channel, but never private keys

## Common Pitfalls

| Pitfall | Symptom | Avoidance |
|---|---|---|
| Forgetting `notifyAppReady()` | the app rolls back after every update | call it after a successful boot + integration-test this path |
| OTA covering a native change | new plugin cannot find native code and crashes | OTA covers web assets only — when native deps change, ship a store release |
| nativeVersion mismatch | the bundle does not apply | set compatibility so the bundle binds to a supported native version |
| Updating mid-session | the user loses state | manual flow + apply updates at app restart/idle |
| Slow first launch | the whole bundle downloads on first open | delay the update check after the critical path, or download in the background |
| Forgetting `cap sync` after adding a plugin | no updater on the native side | run `cap sync` whenever a plugin/version changes |
| Token in the repo | CI secret leak | `CAPGO_TOKEN` only via a secrets manager |

## Do / Don't

| Do | Don't |
|---|---|
| test broken-bundle rollback in staging | assume auto-rollback works without testing it |
| separate `staging`/`production` channels | push straight to production from a dev machine |
| signed bundles for production | skip signing because "it is just web assets" |
| telemetry on update events | push an update without knowing whether it reached devices |
| bump the store release when native deps change | force an OTA over an app whose native side does not support it |
| document the channel map in the repo | make the deployer remember channel names by heart |

## Performance And CI Notes

- What gets uploaded is the web build output (`dist/` or `www/`) — minify + tree-shake before upload; a smaller bundle = faster updates on slow networks
- CI pipeline: `build web` → `capgo bundle upload --channel staging` → promote `--latest` after QA passes
- Separate the upload job from the promote job — promote should be a manual/approved step for production
- The updater checks for updates on app resume/start — no need to poll yourself; use the manual flow when more control is wanted
- `bunx capgo app add` runs once per app — keep the appId in a committable config file (it is not a secret)
- When self-hosting the backend, set `autoUpdateURL` in the config — the default points at the Capgo cloud

## Config Guidance

`capacitor.config.ts` (conceptual example — verify key names against the plugin version in use):

```ts
plugins: {
  CapacitorUpdater: {
    autoUpdate: false,        // manual flow if control is needed
    // appId, channel, statsUrl, etc.
  }
}
```

- Keep the updater config in version control — update-flow behavior is a product decision
- Document the rollout checklist: staging verify → rollback test → production promote → monitor
