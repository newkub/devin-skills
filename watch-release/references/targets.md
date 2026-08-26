# Release Targets

Common release registries and verification endpoints.

## npm

- Registry: `https://registry.npmjs.org/<package>/<version>`
- CLI: `npm view <package>@<version>`
- Success: HTTP 200 with `version` field matching requested version
- Notes: May take 1–5 minutes after `npm publish` for replication

## crates.io

- Registry: `https://crates.io/api/v1/crates/<package>/<version>`
- CLI: `cargo search <package>` (lists latest version)
- Success: HTTP 200 with `version.num` matching requested version
- Notes: crates.io can take a few minutes to index

## Docker Hub

- API: `https://hub.docker.com/v2/repositories/<owner>/<image>/tags/<tag>`
- CLI: `docker pull <owner>/<image>:<tag>`
- Success: HTTP 200 or successful pull
- Notes: Use `ghcr.io` for GitHub Container Registry with `GITHUB_TOKEN`

## VS Code Marketplace

- API: `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/<publisher>/vsextensions/<ext>/<version>`
- CLI: `bunx vsce show <publisher>.<ext>`
- Success: HTTP 200 or output shows the requested version
- Notes: Marketplace can take 5–10 minutes to propagate

## GitHub Releases

- API: `https://api.github.com/repos/<owner>/<repo>/releases/tags/<tag>`
- CLI: `gh release view <tag>`
- Success: HTTP 200 or `gh` returns release details
- Notes: Private repos need `GITHUB_TOKEN` or `gh auth`
