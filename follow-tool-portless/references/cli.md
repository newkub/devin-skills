| command | description | options |
|---|---|---|
| `portless` | run the `dev` script through the proxy | `--script <name>`, `--force` |
| `portless run --name <name> <cmd>` | explicit name + command | `--tailscale`, `--funnel`, `--ngrok` |
| `portless <name> <cmd...>` | explicit route | `<name>.<parent>` for a subdomain |
| `portless list` | active routes + ports | |
| `portless get <name>` | print the URL | use in env vars |
| `portless alias <name> <port>` | map an external service | `--remove <name>` |
| `portless trust` | install the local CA into the trust store | required once for HTTPS |
| `portless doctor` | Node, state dir, proxy, CA trust, hostname checks | |
| `portless proxy start` | start the proxy | `-p 443`, `--no-tls`, `--foreground`, `--tld <tld>`, `--lan` |
| `portless proxy stop` | stop the proxy | |
| `portless service install\|status\|uninstall` | OS startup service | Task Scheduler on Windows |
| `portless prune` | kill orphaned dev servers after a crash | `--force` |
| `portless clean` | stop + remove CA + hosts entries + state | |
| `portless hosts sync\|clean` | manual hosts file sync | needed when a name doesn't resolve |
| `portless --version` | print the CLI version | |

| env var | meaning |
|---|---|
| `PORT` | port assigned by portless to the child process |
| `PORTLESS=0` | bypass the proxy for this command |
