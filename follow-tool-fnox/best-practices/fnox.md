# fnox — Best Practices

Secret injection from providers — committable references, process-scoped env

## Recommended Patterns

- Keep `fnox.toml` committable by storing provider references or age ciphertext only — never a plaintext value
- Let `fnox set` write the reference/ciphertext instead of hand-editing the value field
- Choose the provider by what the team already runs: an existing vault (1Password, AWS/Azure/GCP Secret Manager, Vault) as a reference, otherwise age encryption with a shared recipient
- Run applications through `fnox exec -- <cmd>` so secrets exist only in that process environment
- Separate environments with profiles (dev/staging/prod) rather than editing provider blocks per machine
- Enable the daemon only when repeated resolution is measurably slow, and clear it after rotating a secret
- Use leases for short-lived cloud credentials and the agent proxy when handing work to an AI agent
- In CI, authenticate through OIDC/provider identity instead of storing long-lived keys in the runner

## Common Pitfalls

- Committing a plaintext `value` turns the repo into a secret store
- Committing the age private key alongside the ciphertext removes the whole protection
- Shell integration that exports values globally leaks them into unrelated child processes
- A stale daemon cache keeps serving a rotated secret until restarted
- Pointing a dev profile at production providers exposes real credentials locally
- Printing resolved values in logs or `set -x` traces defeats redaction
- Assuming a committed ciphertext is safe forever — recipients and keys rotate too

## Perf Notes

- Resolve once per process; repeated provider calls add startup latency in dev loops
- Cache with the daemon for CLI-heavy workflows, not for one-shot scripts
- Keep the secret list minimal — each entry is a resolution cost and an audit surface

## Do / Don't

| Do | Don't |
|----|-------|
| references or ciphertext in `fnox.toml` | plaintext `value` committed |
| `fnox exec -- cmd` | exporting secrets into the whole shell |
| profiles per environment | one config pointed at prod |
| provider per team's existing vault | new secret store per project |
| rotate then update the reference | edit the value in place |
