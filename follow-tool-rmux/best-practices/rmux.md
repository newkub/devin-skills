# RMUX — Best Practices

Terminal multiplexer for automation and scripting

## Recommended Patterns

- Give sessions descriptive names — `rmux new -s <name>`; list with `rmux ls` before attaching
- Scripting: send-keys/new-window/split commands via the CLI — reproducible layouts for dev envs
- Detached sessions for long-running tasks — survive SSH disconnects
- Windows/panes per concern — one pane for logs, one for the server, one for the editor
- Capture output: `capture-pane` for programmatic reads — automation reads panes, not just logs

## Common Pitfalls

- Orphaned sessions eat RAM/processes — `rmux kill-session` cleanup as part of the workflow
- send-keys faster than the shell consumes = dropped input — add sleeps or wait-for patterns in scripts
- Env vars in a session = a snapshot at create time — respawn the session when env changes
- Scripting timing: pane ready ≠ command done — poll output/capture-pane instead of fixed sleeps where possible
- Shared session collisions: scripts use names unique per run, or check existence first

## Automation

- Dev env bootstrap: a script of rmux commands creates the layout + starts services — one-command environment
- CI/testing: rmux fits local automation; CI should use proper job orchestration, not tmux-style hacks
- Logging: pane output is transient — persistent logs redirect to separate files

## Do / Don't

| Do | Don't |
|----|-------|
| Named sessions + scripted layouts | Scattered ad-hoc unnamed sessions |
| capture-pane for automation reads | Fixed sleeps everywhere |
| Cleanup sessions when done | Accumulating orphans |
| Env-aware session respawn | Assuming the env refreshes automatically |
