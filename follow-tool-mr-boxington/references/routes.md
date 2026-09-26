# Mr Boxington Route Map

- Website: <https://mr-boxington.jdx.dev>
- Repository: <https://github.com/jdx/mr-boxington>

## Routes

- `/` — landing + benchmarks summary
- `/getting-started` — install, `mbx doctor`, first build, read cache result
- `/installation` — mise/cargo/release archives, platforms, upgrade/uninstall
- `/setup` — Cargo & editor setup: mise native, standalone shim, rust-analyzer, completions
- `/cookbook/local-development` — local dev workflows
- `/managed-targets` — `target` symlink, adoption (`mbx adopt`), collection policy, target seeding (Cargo ≥1.100)
- `/scheduling` — parallel builds, machine-wide compiler pool, `scheduler.tests`, pressure control, cgroup supervision
- `/incremental` — incremental builds trade-off (`MBX_INCREMENTAL`)
- `/linkers` — managed linkers (`mold`, `wild`, `rust-lld` profiles)
- `/tui` — live dashboard (`mbx tui`)
- `/standalone-builds` — C/C++ นอก Cargo ผ่าน `mbx exec`
- `/github-action` — `jdx/mr-boxington-action@v1` inputs, GH cache modes, parallel steps, Docker
- `/cookbook/migrate` — migrate existing cache (sccache ฯลฯ)
- `/cookbook/fork-prs` — fork PR handling
- `/remote-cache` — `[remote]` config, cache server vs S3 bucket, auth, write policy
- `/cache-server` — self-hostable cache server
- `/troubleshooting`, `/cache-results`, `/stats`, `/how-it-works`, `/limits`, `/compared`, `/benchmarks`, `/faq`
- `/configuration` — settings reference, config file locations
- `/cli/` — CLI reference index
- `/cli/setup|completion|doctor|explain|clean|gc|tui|stats|prefetch|exec|adopt` — per-command pages
- `/cli/cache/` + `dir|stats|projects|largest|verify|trace|export|import|remove` — cache subcommands
- `/stability`, `/protocol-compatibility`, `/acknowledgements`

## Notes

- Docs built ด้วย VitePress บน `mr-boxington.jdx.dev`
- GitHub repo `jdx/mr-boxington` เป็น source of truth สำหรับ releases และ issues
- Action repo แยก: `jdx/mr-boxington-action` (inputs reference เต็มอยู่ที่นั่น)
