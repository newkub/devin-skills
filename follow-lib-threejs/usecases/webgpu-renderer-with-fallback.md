# Use Case — WebGPU Renderer With a WebGL Fallback

> Ship the WebGPU renderer where the browser supports it, fall back to WebGL without a second scene, and write the material once in TSL. Source: https://threejs.org/manual/#en/installation (accessed 2026-10-20)

## 1. Detect before importing

```ts
// src/three/capabilities.ts
export async function hasWebGPU(): Promise<boolean> {
  if (!("gpu" in navigator)) return false;
  try {
    const adapter = await (navigator as Navigator & { gpu: GPU }).gpu.requestAdapter();
    return adapter !== null;
  } catch {
    return false;
  }
}
```

A `navigator.gpu` presence check is not enough — headless and blocklisted devices expose the object but return a null adapter.

## 2. Load the renderer that was chosen

```ts
// src/three/create-renderer.ts
export async function createRenderer(): Promise<THREE.WebGLRenderer | THREE.WebGPURenderer> {
  if (await hasWebGPU()) {
    const { WebGPURenderer } = await import("three/webgpu");
    const renderer = new WebGPURenderer({ antialias: true });
    await renderer.init();                       // required before the first render
    return renderer;
  }
  const { WebGLRenderer } = await import("three");
  return new WebGLRenderer({ antialias: true });
}
```

Dynamic import keeps `three/webgpu` and its WGSL chunks out of the bundle for browsers that will never use them, and avoids a top-level import that would fail on an old engine.

## 3. One material definition in TSL

```ts
// src/three/materials.ts
import { color, mix, normalWorld, positionWorld, sin, time, vec3 } from "three/tsl";
import { MeshStandardNodeMaterial } from "three/webgpu";

export const waveMaterial = () =>
  new MeshStandardNodeMaterial({
    color: mix(color("#1d4ed8"), color("#7dd3fc"), sin(positionWorld.y.mul(4).add(time)).mul(0.5).add(0.5)),
    roughness: 0.4,
    normalNode: normalWorld,
  });
```

Node materials run on the WebGPU path and are transpiled for WebGL, so the scene does not need two material trees. Classic `MeshStandardMaterial` also works on both backends — pick one style per project rather than mixing.

## 4. Keep the loop backend-agnostic

```ts
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});
```

`setAnimationLoop` works for both backends and is the only loop that gets XR frames. `requestAnimationFrame` also runs on the WebGPU renderer but bypasses the XR path.

## 5. Verify

1. Chrome with WebGPU — canvas renders, `renderer.backend.isWebGPUBackend === true`
2. Firefox without WebGPU — the same scene renders through WebGL, no console error, `three/webgpu` chunk not fetched
3. `/run-build` — the WebGPU chunk is a separate file, absent from the entry
4. Resize the container — both backends keep aspect and DPR cap
5. Read a pixel with `gl.readPixels` on the webgl path — non-black (proves it is actually drawing)
6. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Static `import "three/webgpu"` → older browsers parse WGSL-dependent code and throw before the fallback runs.
- Skipping `await renderer.init()` → the first `render()` is silently dropped on WebGPU.
- Two scene/material trees (one per backend) → they drift; the fallback path is never visually tested.
- `setPixelRatio(devicePixelRatio)` uncapped → 4× DPR on mobile means 4× the fragments and a hot device.
- Assuming `navigator.gpu` means a working adapter → black canvas on blocklisted drivers.

## Related

- `references/apis.md`
- `best-practices/threejs.md`
- `usecases/mount-scene-with-full-disposal.md`
- `usecases/postprocessing-and-frame-budget.md`
