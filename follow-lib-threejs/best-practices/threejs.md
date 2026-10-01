# Three.js — Best Practices

Scene graph, resources และ render-loop discipline

## Recommended Patterns

- Dispose ทุกอย่าง: `geometry.dispose()`, `material.dispose()`, `texture.dispose()`, `renderer.dispose()` — GC ไม่เก็บ GPU resources
- Reuse geometries/materials/textures — share instances ข้าม meshes แทนสร้างใหม่ต่อ object
- Render loop เดียว: `renderer.setAnimationLoop` — ไม่ใช้ multiple RAF; pause เมื่อ tab hidden/canvas offscreen
- Loaders ผ่าน `LoadingManager` — track progress + error handling รวม
- Controls (`OrbitControls` ฯลฯ) จาก `three/addons` — import path ใหม่ `three/addons/` ไม่ใช่ `examples/jsm`

## Common Pitfalls

- Memory leaks = #1 bug: remove object จาก scene ≠ free GPU memory — dispose ทุกครั้งที่ unmount/destroy
- `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))` — DPR สูง = fill-rate kill บนมือถือ
- Texture sizes: power-of-two, compress (KTX2/basis) สำหรับ assets ใหญ่ — ไม่ใช่ PNG 4K ดิบ
- Color space: `renderer.outputColorSpace = SRGBColorSpace` + texture `.colorSpace` ถูก — mismatch = สีซีด
- อย่า mutate camera/objects นอก loop โดยไม่ invalidate — state sync ผ่าน loop เดียว

## Perf Notes

- Frustum culling อัตโนมัติ — แต่ scene หนัก → LOD (`THREE.LOD`), instancing (`InstancedMesh`), merge static geometry
- Draw calls > triangles เป็น bottleneck ส่วนใหญ่ — batch/instanced แทนหลาย mesh เล็ก
- Shadows แพง: `castShadow`/`receiveShadow` เฉพาะที่จำเป็น, shadow map size ต่ำสุดที่ยังสวย

## Do / Don't

| Do | Don't |
|----|-------|
| dispose ทุก resource ตอน cleanup | rely GC เก็บ GPU memory |
| `InstancedMesh` สำหรับ repeated objects | 1000 mesh เหมือนกันแยกกัน |
| cap `pixelRatio` ≤2 | DPR ดิบบน mobile |
| KTX2/Draco compressed assets | raw PNG/uncompressed glTF |
