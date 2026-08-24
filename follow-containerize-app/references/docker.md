# Docker & Container Engines Reference

## Overview

Docker is an open platform for developing, shipping, and running applications in containers. This reference covers Docker Engine, Dockerfile syntax, and alternative container engines (Podman, buildah, nerdctl).

## Version Info

- **Docker Engine**: `29.7.2` (latest stable)
- **Docker Desktop**: Bundled with Docker Engine
- **License**: Apache 2.0 (Docker Engine); Docker Desktop requires paid subscription for larger enterprises (>250 employees OR >$10M revenue)

## Install

### Docker Desktop (macOS, Windows, Linux)

Download from [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

### Docker Engine (Linux — Ubuntu)

```sh
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Verify Docker is running:

```sh
sudo systemctl status docker
sudo systemctl start docker
```

### Install Specific Version

```sh
apt list --all-versions docker-ce
sudo apt install docker-ce=5:29.7.2-1~ubuntu.24.04~noble docker-ce-cli=5:29.7.2-1~ubuntu.24.04~noble containerd.io docker-buildx-plugin docker-compose-plugin
```

### Podman (Alternative Engine)

```sh
brew install podman          # macOS
sudo apt install podman      # Linux
```

### Buildah

```sh
sudo apt install buildah     # Linux
brew install buildah         # macOS
```

## Dockerfile Reference

A Dockerfile must begin with a `FROM` instruction. Instructions are conventionally UPPERCASE.

### Supported Instructions

| Instruction | Description |
|---|---|
| `FROM` | Create a new build stage from a base image |
| `RUN` | Execute build commands |
| `COPY` | Copy files and directories |
| `ADD` | Add local or remote files and directories |
| `CMD` | Specify default commands |
| `ENTRYPOINT` | Specify default executable |
| `ENV` | Set environment variables |
| `EXPOSE` | Describe which ports the app listens on |
| `WORKDIR` | Change working directory |
| `USER` | Set user and group ID |
| `VOLUME` | Create volume mounts |
| `LABEL` | Add metadata to an image |
| `HEALTHCHECK` | Check container health on startup |
| `ARG` | Use build-time variables |
| `SHELL` | Set the default shell |
| `STOPSIGNAL` | Specify the system call signal for exiting |

### Multi-Stage Build Example

```dockerfile
# syntax=docker/dockerfile:1

FROM node:22-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-slim AS runtime
WORKDIR /app
RUN groupadd -r appuser && useradd -r -g appuser appuser
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
USER 1000
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
LABEL org.opencontainers.image.source="https://github.com/example/repo"
LABEL org.opencontainers.image.license="MIT"
CMD ["node", "dist/index.js"]
```

### Build Cache Mount

```dockerfile
RUN --mount=type=cache,target=/root/.npm \
    npm ci
```

### Non-Root User

```dockerfile
RUN groupadd -r appuser && useradd -r -g appuser appuser
USER 1000
```

### Healthcheck

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

## CLI Commands

### Docker

| Command | Description |
|---|---|
| `docker build -t myapp:latest .` | Build image from Dockerfile |
| `docker build -t myapp:latest -f Dockerfile.prod .` | Build with specific Dockerfile |
| `docker images` | List images |
| `docker run -p 3000:3000 myapp:latest` | Run container with port mapping |
| `docker run --rm myapp:latest` | Run and remove on exit |
| `docker ps` | List running containers |
| `docker ps -a` | List all containers |
| `docker logs <container>` | View container logs |
| `docker exec -it <container> sh` | Execute shell in container |
| `docker stop <container>` | Stop container |
| `docker rm <container>` | Remove container |
| `docker rmi <image>` | Remove image |
| `docker tag myapp:latest myapp:v1.0` | Tag an image |
| `docker push <registry>/myapp:latest` | Push to registry |
| `docker pull <registry>/myapp:latest` | Pull from registry |

### Podman Equivalents

| Command | Description |
|---|---|
| `podman build -t myapp:latest .` | Build image |
| `podman run -p 3000:3000 myapp:latest` | Run container |
| `podman images` | List images |
| `podman ps` | List containers |

### Buildah

| Command | Description |
|---|---|
| `buildah bud -t myapp:latest .` | Build image from Containerfile |

## `.dockerignore`

```
node_modules
.git
dist
*.log
.env
.env.*
.cache
coverage
```

## Container Engine Equivalence

| Feature | Docker | Podman | buildah | nerdctl |
|---|---|---|---|---|
| Build | `docker build` | `podman build` | `buildah bud` | `nerdctl build` |
| Run | `docker run` | `podman run` | N/A | `nerdctl run` |
| List images | `docker images` | `podman images` | `buildah images` | `nerdctl images` |
| Config file | `Dockerfile` | `Containerfile` | `Dockerfile` | `Dockerfile` |

## Source

- [Get Docker](https://docs.docker.com/get-started/get-docker/)
- [Docker Engine Install (Ubuntu)](https://docs.docker.com/engine/install/ubuntu/)
- [Dockerfile Reference](https://docs.docker.com/reference/dockerfile/)
- [Docker Desktop](https://docs.docker.com/desktop/)
