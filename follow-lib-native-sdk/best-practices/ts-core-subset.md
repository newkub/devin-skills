# TypeScript Core Subset (compiled AOT — no runtime)

`src/core.ts` ไม่ใช่ TypeScript ทั่วไป — มันถูก checker แล้ว compile เป็น native code ทุกบรรทัดต้องอยู่ใน subset

## Recommended patterns

- **Model เป็น readonly record** —ทุก field immutable; state ใหม่คืนจาก `update` เท่านั้น
  ```ts
  type Model = {
    readonly count: i32;
    readonly name: Str;
    readonly items: readonly Item[];
  };
  ```
- **Msg เป็น discriminated union** + `update` ใช้ exhaustive switch (ไม่มี `default` ที่กลืน case ใหม่)
  ```ts
  type Msg =
    | { readonly kind: "increment" }
    | { readonly kind: "load"; readonly key: Str }
    | { readonly kind: "fetched"; readonly ok: Bool; readonly body: Str };

  export function update(model: Model, msg: Msg): Model | [Model, Cmd<Msg>] {
    switch (msg.kind) {
      case "increment": return { ...model, count: model.count + 1 };
      case "load": return [model, Cmd.fetch(msg.key, "fetched")];
      case "fetched": return { ...model, name: msg.body };
    }
  }
  ```
- **Effect orchestration:** `initialModel()` คืน `[Model, Cmd]` ได้; `update` คืน `Model` (pure state) หรือ `[Model, Cmd<Msg>]` (state + effect) — ห้ามทำ side effect ตรง ๆ ใน update
- **Subscriptions declarative:** `subscriptions(model): Sub<Msg>` — เช่น `Sub.timer("tick", 1000, "tick")` เปิด/ปิดตาม state (ไม่ manual setInterval)
- **Cmd vocabulary ที่ใช้บ่อย:** `Cmd.none/now/delay/fetch/readFile/writeFile/appendFile/statFile/deleteFile/clipboardRead/clipboardWrite/showNotification/openExternalUrl/spawn/quitApp/persist/store.set/db.query/Cmd.request/Cmd.batch/Cmd.cancel` — ผูกผลกลับมากับ `Msg` kind ที่ match
- **Text เป็น bytes:** ใช้ `utf8Bytes`/`asciiBytes` จาก `@native-sdk/core`; slice/index เป็น **byte offsets** ไม่ใช่ UTF-16 code units — ตัดกลาง multibyte ได้ ต้องคิดเป็น byte
- **Modules:** import แบบ relative พร้อม filename จริงใต้ `src/` (เช่น `import { Item } from "./item.ts"`), ห้าม `../`, ห้าม circular, ห้าม `export default` / `export x =` / `export *`
- **Classes ใช้ได้เฉพาะ "data classes"** — checker แปลงเป็น record (ไม่มี inheritance, ไม่มี methods ที่ถือ state ซ่อน)
- **Services เป็น escape hatch ทางการ:** งาน regex/JSON/Map/Set/Date/class logic/child_process/filesystem → เขียนใน `src/services/` (ordinary TS เต็มรูปแบบ compile native) แล้วเรียกจาก core ผ่าน `Cmd.request(name, payload, { key, ok, err })` หรือ typed client (`feedsParse(request, {key, ok, err})` จาก `@native-sdk/services`) — carrier แยก (`<app>_services` process บน desktop)
- **Memory:** per-dispatch arena 1 MiB — ทุกอย่างข้าม dispatch ต้องอยู่ใน `Model` เท่านั้น

## Pitfalls

- **ห้ามใน core (checker ไม่ผ่าน):** npm imports (นอกจาก `@native-sdk/core`), regex, `JSON.*`, Promises/`async`/`await`, `eval`, class inheritance, `Map`/`Set`, mutable module-level state, `Date.now()`/random ตรง ๆ (ambient time/randomness ห้าม — ใช้ `Cmd.now`/timer msg), runtime type tests (`instanceof`)
- **deferred:** generators, `BigInt`, `Symbol` — อย่าใช้
- **error จาก service:** `throw { kind, message }` (plain object union) —ฝั่ง core รับเป็น `err` msg ที่ declare ไว้
- **streaming service:** `emit` + `@streamBuffer`, `@deadlineMs` default 30s — กำหนด key ของ request ให้ตรงกับ Msg ที่รอ
- **rules ที่ checker enforced:** NS1065/1066/1067 (service boundary), NS1068 (persist migrate) — error code ขึ้นต้น `NS` ค้นหาใน docs
- **อย่าแปล task เป็น async/await ใน core** — pattern ที่ถูกคือ split เป็น msg: request msg → Cmd → result msg → update
