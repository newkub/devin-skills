# Use Case — Mount a Scene Once and Dispose It Fully

> One renderer, a container-driven resize, and a teardown that returns every GPU resource. Source: https://threejs.org/manual (accessed 2026-10-20)

## 1. Keep the whole scene in one factory

```ts
// src/scene/create-scene.ts
import * as THREE from "three";

export function createScene(container: HTMLElement) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 1.6, 4);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x8899ff });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube, new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));

  const resize = new ResizeObserver(() => {
    const { clientWidth: width, clientHeight: height } = container;
    if (width === 0 || height === 0) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  });
  resize.observe(container);
  renderer.setSize(container.clientWidth, container.clientHeight, false);

  renderer.setAnimationLoop(() => {
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  });

  return {
    dispose() {
      renderer.setAnimationLoop(null);
      resize.disconnect();

      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const item of materials) item?.dispose();
      });

      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
```

The factory owns everything it allocates. A caller that has to remember five dispose calls will eventually miss one.

## 2. Bind it to the framework's lifecycle

```tsx
// React
useEffect(() => {
  const handle = createScene(containerRef.current!);
  return () => handle.dispose();
}, []);
```

```tsx
// Solid
onMount(() => {
  const handle = createScene(containerRef!);
  onCleanup(() => handle.dispose());
});
```

Empty dependency arrays matter. A dependency on a prop recreates the renderer mid-session, and two WebGL contexts on one canvas region is what produces the "context lost" flicker.

## 3. Never store THREE objects in a reactive store

`Scene`, `Mesh`, and `Material` are class instances. Wrapping them in a Vue `reactive` or a Solid store puts a proxy between you and the object, and `instanceof` plus internal identity checks break. Keep them in a closure or a plain ref.

## 4. Cap the pixel ratio and drive resize from the container

1. `setPixelRatio(Math.min(devicePixelRatio, 2))` — a 3× phone renders 9× the pixels for no visible gain
2. `ResizeObserver` on the container, not `window.resize`; a sidebar toggle changes canvas size without a window event
3. `setSize(width, height, false)` — the third argument stops three.js from writing inline CSS the layout already owns

## 5. Verify

1. `/run-verify` for lint/typecheck, `/run-test` when a scene has tests
2. Mount and unmount the component 5 times — `document.querySelectorAll("canvas").length` must return to its starting value
3. Log `renderer.info.memory.geometries` and `.textures` after unmount — both must return to the baseline
4. Resize the container, not the window — the aspect must follow
5. On failure read the [Migration Guide](https://github.com/mrdoob/three.js/wiki/Migration-Guide) before assuming a bug; `r150+` changed several defaults

## Pitfalls

- Creating the renderer inside a render body or a reactive effect, which allocates a new WebGL context per run.
- Disposing the renderer but not geometries, so `renderer.info.memory` keeps climbing across mounts.
- `requestAnimationFrame` instead of `setAnimationLoop`, which gives up XR support and does not pause when the tab hides.
- Using `three/examples/jsm/...` instead of the `three/addons/...` alias, which breaks under strict export maps.

## Related

- `references/apis.md`
- `best-practices/threejs.md`
- `usecases/load-compressed-gltf.md`
