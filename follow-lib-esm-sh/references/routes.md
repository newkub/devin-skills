# Follow Lib Esm Sh Route Map

- Website: <https://esm.sh>
- esm.sh เป็น CDN service — "routes" คือ URL endpoints ของ service

## Service Endpoints

| Route / Topic | URL |
|---|---|
| Docs home (usage docs อยู่บน homepage) | https://esm.sh |
| Module import | `https://esm.sh/{package}@{version}/{subpath}` |
| JSR registry | `https://esm.sh/jsr/@scope/pkg@ver/path` |
| GitHub registry | `https://esm.sh/gh/owner/repo@ref/path` |
| pkg.pr.new | `https://esm.sh/pr/owner/repo/pkg@sha` |
| Raw files | `https://raw.esm.sh/<PATH>` (เทียบเท่า `?raw`) |
| No-build JSX/TSX runtime | `https://esm.sh/run` |
| Status | https://esm.sh/status |

## Project Resources

| Route / Topic | URL |
|---|---|
| Repository | https://github.com/esm-dev/esm.sh |
| Releases / changelog | https://github.com/esm-dev/esm.sh/releases |
| CLI (`esm.sh` import maps manager) | https://github.com/esm-dev/esm.sh/releases/tag/v0.1.1 |

## Key Concepts

- URL format: `{package}@{version}/{subpath}` + query params (`?deps`, `?external`, `?alias`, `?exports`, `?dev`, `?target`, `?raw`, `?worker`, `?css`, `?no-dts`)
- Pin version เสมอสำหรับ production — date versioning (`@yyyy-mm-dd`) ใช้ได้ตั้งแต่ v137
- ตั้งแต่ build v136 ไม่มี `/v135/` prefix และ `?pin` ถูก ignore; v137_2 shutdown legacy build server
