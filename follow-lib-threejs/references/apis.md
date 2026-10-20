| key | value |
|---|---|
| package | `three` (+ `@types/three`) |
| install | `bun add three` · `bun add -d @types/three` |
| version | 0.186.x (r186, verified 2026-09-17) — the npm minor tracks the `rXXX` release |
| license | MIT |
| docs | https://threejs.org/docs/ · https://threejs.org/manual/ |
| migration | https://github.com/mrdoob/three.js/wiki/Migration-Guide |
| repo | https://github.com/mrdoob/three.js |

| api | description | example |
|---|---|---|
| `THREE.WebGLRenderer` | default renderer, broad compatibility | `new THREE.WebGLRenderer({ antialias: true })` |
| `three/webgpu` | WebGPU renderer entry point | `new WebGPURenderer()` from `"three/webgpu"` |
| `three/tsl` | node-material shading language for WebGPU | `import { ... } from "three/tsl"` |
| `three/addons/*` | addons alias for `examples/jsm` — the only supported path | `three/addons/controls/OrbitControls.js` |
| `renderer.setAnimationLoop(fn)` | XR-safe frame loop (instead of raw rAF) | `renderer.setAnimationLoop(render)` |
| `renderer.setPixelRatio` | cap DPR for mobile | `Math.min(devicePixelRatio, 2)` |
| `renderer.toneMapping` | modern look | `THREE.ACESFilmicToneMapping` |
| `InstancedMesh` | one draw call for repeated geometry | instead of cloning meshes |
| `renderer.info` | draw calls / triangles counters | profile with the `stats.js` addon |
| `DRACOLoader` / `MeshoptDecoder` / `KTX2Loader` | compressed geometry and textures | `three/addons/loaders/...` |
| `@react-three/fiber` + `@react-three/drei` | React binding (mature) | |
| `@tresjs/core` | Vue binding | |
| `three-mesh-bvh` | faster raycasting on large meshes | `bun add three-mesh-bvh` |
