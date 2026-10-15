# pitchfork — Best Practices

Daemon/process manager for dev workflows — start, stop, supervise

## Recommended Patterns

- Declare daemons in the pitchfork config per project — name, command, cwd, env, auto-restart policy
- Use for dev-time services: watchers, local servers, db proxies — not as a production supervisor
- `pitchfork start/stop/list/logs` — a consistent CLI instead of ad-hoc `&` background jobs
- Auto-restart only crash-recoverable services — restart loops on a broken config = noise
- Log capture per daemon — `pitchfork logs <name>` instead of hand-rolled redirect files

## Common Pitfalls

- Daemon drift: processes left outside pitchfork are untracked — start/stop only through pitchfork
- Env at spawn time is a snapshot — env changes require restarting the daemon, don't expect a reload
- Port conflicts when an old daemon lingers — check `pitchfork list` before assuming a clean state
- Auto-restart stacking into retry storms — use backoff/max-restart limits
- Cleanup when done — lingering daemons hold ports/resources; `pitchfork stop --all` at the end of work

## Workflow

- Project boot: a script that runs `pitchfork start` for the needed services — reproducible dev environment
- Debugging: check `logs` + status before assuming a service is running
- Integration: pair with `/run-dev` orchestration when several services must be ready at once

## Do / Don't

| Do | Don't |
|----|-------|
| Track every daemon through pitchfork | `nohup`/`&` outside it |
| Restart policies + backoff | Infinite restart loops |
| Stop daemons when finished | Leave orphans holding ports |
| Config per project | Global ad-hoc starts |
