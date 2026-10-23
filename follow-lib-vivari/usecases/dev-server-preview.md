# Dev Server Preview

Run `npm install`, start a dev server, and mount its preview.

```ts
import { Vivari, VivariError, isCrossOriginIsolated } from "@vivari/core"

const iframe = document.querySelector("iframe")!

if (!isCrossOriginIsolated()) {
  throw new Error("Cross-origin isolation headers are missing")
}

const vivari = await Vivari.boot({ timeout: 30_000 })

await vivari.mount({
  "package.json": {
    file: { contents: JSON.stringify({ name: "app", scripts: { dev: "vite" } }) },
  },
  "index.html": { file: { contents: "<h1>Hello</h1>" } },
})

vivari.attachPreview(iframe)

const install = await vivari.spawn("npm", ["install"])
for await (const chunk of install.output) terminal.write(chunk)
if ((await install.exit) !== 0) throw new Error("install failed")

void vivari.spawn("npm", ["run", "dev"])

const [port, url] = await vivari.once("server-ready")
iframe.src = url
```

## Restarts

A dev server can restart. Re-point the frame whenever `server-ready` fires again:

```ts
vivari.on("server-ready", ([, nextUrl]) => {
  iframe.src = nextUrl
})
```

## Reload Without Dropping HMR

Bump a key instead of remounting:

```ts
let reloadKey = 0
function reload() {
  reloadKey++
  iframe.contentWindow?.location.reload()
}
```

Remounting the iframe destroys the HMR socket; `attachPreview` would need to run again.

## Errors

```ts
try {
  await Vivari.boot()
} catch (err) {
  if (err instanceof VivariError) {
    if (err.code === "ERR_NOT_ISOLATED") {
      renderMissingHeadersState()
    } else if (err.code === "ERR_BOOT_TIMEOUT") {
      renderTimeoutState()
    } else {
      renderBootFailure(err.code)
    }
  }
}
```

## Cleanup

```ts
const procs = new Set<VivariProcess>()

async function teardown() {
  for (const p of procs) p.kill()
  procs.clear()
  await vivari.teardown()
}
```

Close `fs.watch` handles explicitly; the kernel reports every change and never coalesces.
