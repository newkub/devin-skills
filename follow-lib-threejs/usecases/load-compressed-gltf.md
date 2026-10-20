# Use Case — Load a Compressed glTF Model

> Ship a Draco/Meshopt-compressed model, load it with addons, and free both the model and the decoders. Source: https://threejs.org/manual/#en/load-gltf (accessed 2026-10-20)

## 1. Install and pick the loader path

```bash
bun add three && bun add -d @types/three
```

```ts
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
```

`three/addons` maps to `examples/jsm`. Importing the deep `three/examples/jsm/...` path fails under a strict exports map and breaks on bundler upgrades.

## 2. Reuse one loader for the whole app

```ts
// src/scene/load-model.ts
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";

const draco = new DRACOLoader().setDecoderPath("/draco/");
const loader = new GLTFLoader().setDRACOLoader(draco);
loader.setMeshoptDecoder(MeshoptDecoder);

export async function loadModel(url: string) {
  const gltf = await loader.loadAsync(url);
  return gltf.scene;
}

export function disposeLoaders() {
  draco.dispose();
}
```

Constructing a `DRACOLoader` per call spawns a decoder worker pool per model. Build it once, share it.

## 3. Copy the decoder files into `public/`

`setDecoderPath("/draco/")` points at static assets you must serve: the Draco wasm/js files from the three.js distribution, and `basis/` if KTX2 textures are used. A 404 here surfaces as `THREE.DRACOLoader: Decoder error` with no path in the message.

## 4. Compress at build time, not at runtime

| Asset | Path |
|-------|------|
| geometry | `gltf-transform optimize` (Draco or Meshopt) |
| textures | KTX2 / Basis via `KTX2Loader` |
| repeated objects | `InstancedMesh` instead of a clone loop |

Compression is a build-step decision. A 40 MB uncompressed GLB that "loads fine locally" is a 40 MB download on a phone.

## 5. Add the model and free it with the scene

```ts
const model = await loadModel("/models/car.glb");
scene.add(model);

// on teardown
model.traverse((object) => {
  const mesh = object as THREE.Mesh;
  mesh.geometry?.dispose();
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  for (const item of materials) item?.dispose();
});
scene.remove(model);
```

Disposing the scene root is not enough — a loaded hierarchy carries its own geometries and materials that `scene.traverse` only reaches if the model is still attached.

## 6. Verify with renderer counters

1. `/run-verify` then a real render
2. `renderer.info.render.calls` and `.triangles` after the model appears — a sudden 10× triangle count means the compression or LOD did not apply
3. Unload the model and check `renderer.info.memory.geometries` / `.textures` drop back
4. Disable the network cache for one run to see the real compressed transfer size
5. On failure check the [Migration Guide](https://github.com/mrdoob/three.js/wiki/Migration-Guide) — loader signatures changed across releases

## Pitfalls

- Decoder files missing from `public/`, which fails only in the deployed build where the path differs.
- `await loader.setMeshoptDecoder(...)` on a setter that returns the loader, not a promise — the await silently resolves early.
- Cloning a loaded model per instance instead of `InstancedMesh`, multiplying draw calls by instance count.
- Mutation of `gltf.scene` transforms before adding it to the scene, which makes the first frame jump and any later reset wrong.

## Related

- `references/apis.md`
- `best-practices/threejs.md`
- `usecases/mount-scene-with-full-disposal.md`
