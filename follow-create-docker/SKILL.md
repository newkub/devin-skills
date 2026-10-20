---
name: follow-create-docker
description: Create Dockerfile, .dockerignore and docker-compose per stack, following best practices
argument-hint: "[path]"
related:
  - deep-review
  - optimize
  - follow-deploy
  - setup-cicd
  - follow-secret-manager
  - check-secrets
  - run-check
  - report

---

## Goal

Create production-ready Docker artifacts for a project: `Dockerfile`, `.dockerignore`, and `docker-compose.yml` (if needed) with multi-stage builds, minimal base images, and security best practices

## Scope

- Use when containerizing an application or adding Docker support to an existing project
- Supports Bun/Node, Rust, Go, Python, and static sites
- Covers `Dockerfile`, `.dockerignore`, `compose.yaml`/`docker-compose.yml`, and health checks
- Does not cover Kubernetes manifests or production-cluster-level orchestration

- Check the local `docker --version`; always confirm the latest engine/compose versions and release notes with `/deep-research` + `/follow-best-practice` (don't pin them in files — per `/update-devin-global-skills`) — the Compose spec no longer uses a top-level `version:`

## Execute

### Workflows

| Argument | Workflow |
|----------|----------|
| `dockerfile`, `setup` | `workflows/setup-dockerfile/SKILL.md` — production-ready Dockerfile |
| `compose` | `workflows/config-compose/SKILL.md` — docker-compose multi-service |
| `optimize` | `workflows/optimize-image/SKILL.md` — harden/optimize docker image (findings-driven pass → `/optimize docker`) |

1. If the argument matches a workflow → read `workflows/<arg>/SKILL.md` and follow its flow
2. If not specified → follow the normal Steps (default = `setup-dockerfile`)

### 1. Review Tech Stack

> Goal: know the stack and requirements before writing the Dockerfile

1. Run `/deep-review` to summarize the tech stack in use
2. Run `/deep-review` to review dependencies and library design
3. Check the manifest: `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`
4. Identify runtime, build command, start command, port, and required env vars

### 2. Choose Base Image

> Goal: pick a small and secure base image

1. Bun/Node → `oven/bun:<version>-alpine` or `node:<version>-alpine`
2. Rust → build with `rust:<version>-alpine`, then copy the binary to `alpine` or `scratch`/`distroless`
3. Go → build with `golang:<version>-alpine`, then copy the binary to `scratch` or `distroless`
4. Python → `python:<version>-slim` or `alpine`
5. Static site → build stage, then serve with `nginx:alpine` or `oven/bun` with a static server
6. Always pin the version, never use `latest`

### 3. Write Dockerfile

> Goal: a multi-stage Dockerfile that builds fast with a small image

1. Separate the build stage and the runtime stage
2. Copy dependency manifests first (`package.json` + lockfile) to use layer caching
3. Install dependencies per ecosystem: `bun install --frozen-lockfile`, `cargo build --release`, `pip install -r requirements.txt`
4. Copy the source code, then build
5. Runtime stage: copy only the necessary artifacts
6. Create a non-root user (`USER` directive) before `CMD`
7. Add `HEALTHCHECK` if the app has a health endpoint
8. Use the `CMD` exec form `["binary", "arg"]`, not the shell form

### 4. Write .dockerignore

> Goal: a small build context with no secret leakage

1. Add `node_modules`, `target`, `dist`, `build`, `.git`, `.env*`, `*.log`
2. Add test files, docs, and CI configs not needed in the image
3. Run `/check-secrets secrets-leak` to confirm there are no secrets in the context

### 5. Write docker-compose.yml

> Goal: local orchestration for dev when needed

1. Create only when the app needs other services (database, cache, queue)
2. The file name `compose.yaml` is the current convention (`docker-compose.yml` is still supported) — never add a top-level `version:`, which is obsolete in the Compose spec
3. Use `services`, `ports`, `environment`, `volumes`, `depends_on` with `condition: service_healthy`
4. Read env from `.env`, don't hardcode secrets — use `/follow-secret-manager`
5. Add `healthcheck` for stateful services
6. Run with `docker compose` (v2 plugin, no hyphen)

### 6. Build And Verify

> Goal: the image builds and actually runs

1. Run `docker build -t <name>:local .` and check the image size
2. Run `docker run --rm -p <port>:<port> <name>:local`, then smoke test
3. Run `/run-check` on the project before shipping
4. Report results with `/report`: image size, layers, warnings

## Rules

### 1. Image Quality

- Always use a multi-stage build when there is a compilation step
- The runtime image must have no build tools, source code, or unneeded lockfiles
- Always use a non-root user in the final image
- Pin the base image version and digest for reproducibility

### 2. Security

- Never copy `.env` or secrets into the image — inject at runtime
- Don't `EXPOSE` unused ports
- Never run the container with `--privileged` or mount the docker socket without need

### 3. Deterministic Builds

- Use lockfiles in every ecosystem (`--frozen-lockfile`, `--locked`)
- Rebuilding with the same inputs must produce the same image digest (if the base image is digest-pinned)

### 4. Minimal Changes

- If the project already has a Dockerfile → improve the existing one, don't rewrite the whole file
- Don't add docker-compose if the app runs in a single container

- Use /follow-deploy when needed
- Use /setup-cicd when needed

## Expected Outcome

- The `Dockerfile` multi-stage build passes and the image has an appropriate size
- `.dockerignore` is complete with no secrets in the build context
- `docker-compose.yml` (if created) runs all services with healthchecks
- The container runs as a non-root user and passes the smoke test
