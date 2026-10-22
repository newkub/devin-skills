# Use Case — Post-Processing Without Burning the Frame Budget

> Add bloom and anti-aliasing through a composer, keep the canvas idle when nobody is looking at it, and hold a frame budget you can prove. Source: https://threejs.org/examples/#webgl_postprocessing_unreal_bloom (accessed 2026-10-20)

## 1. Compose the pass chain

```ts
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.6, 0.4, 0.85);
composer.addPass(bloom);

composer.addPass(new OutputPass());   // tone mapping + colour space at the end of the chain
```

`OutputPass` last is not optional: without it the composer outputs linear colour and the scene looks washed out compared with a direct `renderer.render`.

## 2. Size the composer, not just the renderer

```ts
const onResize = () => {
  const { clientWidth: w, clientHeight: h } = container;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  renderer.setSize(w, h);
  composer.setSize(w, h);              // render targets and bloom mips
  bloom.resolution.set(w, h);
};
new ResizeObserver(onResize).observe(container);
```

Resizing only the renderer leaves the composer's render targets at the old size: the image is stretched and the bloom radius scales with the old resolution.

## 3. Render at a resolution you can afford

```ts
const budget = { maxDpr: 2, minDpr: 1 };
let dpr = Math.min(devicePixelRatio, budget.maxDpr);

renderer.setPixelRatio(dpr);

function adapt(frameMs: number) {
  if (frameMs > 22 && dpr > budget.minDpr) {        // below ~45 fps
    dpr = Math.max(budget.minDpr, dpr - 0.25);
    renderer.setPixelRatio(dpr);
    composer.setPixelRatio(dpr);
  }
}
```

Bloom is a full-screen, multi-mip effect: at 3× DPR it can cost more than the scene. Dropping resolution is the cheapest lever and is invisible on a blurred effect.

## 4. Stop rendering when nothing needs a frame

```ts
let visible = true;
const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
io.observe(canvas);

renderer.setAnimationLoop(() => {
  if (!visible || document.hidden) return;    // no GPU work for an offscreen canvas
  controls.update();
  composer.render();
});
```

A `setAnimationLoop` that always renders keeps a laptop fan spinning on a page scrolled past the hero. Pause on `document.hidden` and on intersection, and restart native loops on visibility change.

## 5. Verify

1. `renderer.info.render.calls` and `renderer.info.programs.length` — stable across frames, no growth
2. Resize the window — image is not stretched, bloom radius matches the new size
3. Scroll the canvas out of view — frame time drops to zero (check with the performance panel)
4. Switch tabs for a minute, return — no burst of queued frames, no memory growth
5. `/run-verify` + `/run-test`; on a low-end profile, the adaptive DPR step fires once
6. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Composer not resized → blurred, stretched output that looks like a broken camera aspect.
- Missing `OutputPass` → washed-out colours compared with the same scene rendered directly.
- Rendering while `document.hidden` → battery drain and thermal throttling with no visible benefit.
- A new `EffectComposer` per resize or per prop change → a new set of render targets each time, never freed.
- Bloom `strength` tuned on a desktop GPU → unusable on mobile; expose it and test at the minimum DPR.

## Related

- `references/apis.md`
- `best-practices/threejs.md`
- `usecases/mount-scene-with-full-disposal.md`
- `usecases/instanced-mesh-for-many-objects.md`
