# Three.js — Best Practices

Scene graph, resources, and render-loop discipline

## Recommended Patterns

- Dispose everything: `geometry.dispose()`, `material.dispose()`, `texture.dispose()`, `renderer.dispose()` — GC won't reclaim GPU resources
- Reuse geometries/materials/textures — share instances across meshes instead of creating new ones per object
- A single render loop: `renderer.setAnimationLoop` — don't use multiple RAF; pause when the tab is hidden / the canvas is offscreen
- Loaders through a `LoadingManager` — track progress + centralized error handling
- Controls (`OrbitControls` etc.) from `three/addons` — use the new `three/addons/` import path, not `examples/jsm`

## Common Pitfalls

- Memory leaks are the #1 bug: removing an object from the scene ≠ freeing GPU memory — dispose on every unmount/destroy
- `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))` — a high DPR kills fill-rate on mobile
- Texture sizes: power-of-two, compress (KTX2/basis) for large assets — not raw 4K PNG
- Color space: `renderer.outputColorSpace = SRGBColorSpace` + the correct texture `.colorSpace` — a mismatch makes colors look washed out
- Don't mutate camera/objects outside the loop without invalidating — sync state through the single loop

## Perf Notes

- Frustum culling is automatic — but a heavy scene → LOD (`THREE.LOD`), instancing (`InstancedMesh`), merge static geometry
- Draw calls, not triangles, are usually the bottleneck — batch/instance instead of many small meshes
- Shadows are expensive: `castShadow`/`receiveShadow` only where needed, the smallest shadow map size that still looks good

## Do / Don't

| Do | Don't |
|----|-------|
| dispose every resource on cleanup | rely on GC to reclaim GPU memory |
| `InstancedMesh` for repeated objects | 1000 separate identical meshes |
| cap `pixelRatio` ≤2 | the device DPR on mobile |
| KTX2/Draco compressed assets | raw PNG/uncompressed glTF |
