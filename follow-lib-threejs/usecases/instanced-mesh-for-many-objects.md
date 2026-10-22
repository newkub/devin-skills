# Use Case — Thousands of Objects With InstancedMesh

> Draw 10 000 repeated objects in one draw call, colour them per instance, and still pick one with the pointer. Source: https://threejs.org/docs/#api/en/objects/InstancedMesh (accessed 2026-10-20)

## 1. One mesh, many matrices

```ts
import * as THREE from "three";

const COUNT = 10_000;
const geometry = new THREE.BoxGeometry(0.08, 0.08, 0.08);
const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });

const mesh = new THREE.InstancedMesh(geometry, material, COUNT);
mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);   // we update every frame
mesh.frustumCulled = false;                             // instances live outside the base bounds

const dummy = new THREE.Object3D();
for (let i = 0; i < COUNT; i++) {
  dummy.position.set(Math.random() * 10 - 5, Math.random() * 4, Math.random() * 10 - 5);
  dummy.rotation.y = Math.random() * Math.PI;
  dummy.updateMatrix();
  mesh.setMatrixAt(i, dummy.matrix);
}
mesh.instanceMatrix.needsUpdate = true;
```

`frustumCulled = false` is required: the mesh's own bounding sphere covers only the base geometry at the origin, so a cluster of instances away from it disappears when the camera pans.

## 2. Per-instance colour

```ts
mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(COUNT * 3), 3);
const c = new THREE.Color();
for (let i = 0; i < COUNT; i++) {
  c.setHSL(i / COUNT, 0.6, 0.55);
  mesh.setColorAt(i, c);
}
mesh.instanceColor.needsUpdate = true;
```

`setColorAt` allocates `instanceColor` on first use; setting the attribute yourself lets you fill a typed array in one pass instead of 10 000 calls.

## 3. Animate without touching the geometry

```ts
renderer.setAnimationLoop((t) => {
  for (let i = 0; i < COUNT; i++) {
    mesh.getMatrixAt(i, dummy.matrix);
    dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
    dummy.position.y = Math.sin(t * 0.001 + i * 0.01) * 0.2 + 0.5;
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;    // once per frame, after the loop
  renderer.render(scene, camera);
});
```

One `needsUpdate` after the loop, not per instance — setting it inside the loop marks the buffer dirty 10 000 times and is the usual reason the frame budget disappears.

## 4. Pick a single instance

```ts
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

canvas.addEventListener("pointerdown", (e) => {
  const rect = canvas.getBoundingClientRect();
  pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);

  const hit = raycaster.intersectObject(mesh, false)[0];
  if (hit?.instanceId !== undefined) select(hit.instanceId);   // real instance index
});
```

`hit.instanceId` is the only per-instance information a raycast returns — keep your own `records[i]` array indexed the same way as the instance buffer.

## 5. Verify

1. `renderer.info.render.calls` — one call for the whole set, not 10 000
2. Pan the camera away from the origin — instances stay visible (`frustumCulled: false`)
3. Click three different cubes — the correct index highlights each time
4. Grow to 10 000 with the animation loop on — frame time stays within budget; drop `COUNT` or move the update to a shader if not
5. Dispose: `geometry.dispose()`, `material.dispose()`, `mesh.dispose()` (releases instance buffers)
6. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- A `for` loop of `new Mesh(...)` → one draw call per object and a dead frame rate at 1 000+.
- `frustumCulled` left on → the whole instanced set vanishes when the base geometry's bounds leave the view.
- `instanceMatrix.needsUpdate = true` inside the per-instance loop → 10 000 dirty flags per frame.
- Updating `instanceColor` without `needsUpdate` → colours never change on screen.
- Forgetting `mesh.dispose()` → instance buffers stay on the GPU after the scene unmounts.

## Related

- `references/apis.md`
- `best-practices/threejs.md`
- `usecases/mount-scene-with-full-disposal.md`
- `usecases/postprocessing-and-frame-budget.md`
