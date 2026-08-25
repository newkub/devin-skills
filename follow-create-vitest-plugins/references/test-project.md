# Test Project Reference

Test Project API (3.0.0+) สำหรับ inject และจัดการ test projects ใน Vitest

## injectTestProjects

```ts
function injectTestProjects(
  config: TestProjectConfiguration | TestProjectConfiguration[]
): Promise<TestProject[]>
```

รับ config ได้ 3 รูปแบบ: config glob pattern, filepath หรือ inline configuration คืน array ของ resolved `TestProject`

### Inline Config

```ts
configureVitest({ project, injectTestProjects }) {
  const newProjects = await injectTestProjects({
    extends: project.vite.config.configFile,
    test: {
      name: 'my-custom-alias',
      alias: {
        customAlias: resolve('./custom-path.js'),
      },
    },
  })
}
```

### Config Glob

```ts
configureVitest({ injectTestProjects }) {
  const projects = await injectTestProjects('./packages/*/vitest.config.ts')
}
```

### Filepath

```ts
configureVitest({ injectTestProjects }) {
  const projects = await injectTestProjects('./vitest.extra.config.ts')
}
```

## Unique Name Requirement

Vitest ไม่อนุญาตหลาย projects ชื่อซ้ำกัน ถ้าใช้ `extends` จะ inherit `name` ด้วย ต้อง override:

```ts
injectTestProjects({
  extends: project.vite.config.configFile,
  test: {
    name: 'my-unique-name', // ต้องไม่ซ้ำกับ existing projects
  },
})
```

> ตรวจสอบชื่อที่ใช้แล้วผ่าน `vitest.projects` array หรือ `project.name`

## Filter Behavior

Vitest filter projects ระหว่าง config resolution ถ้า user กำหนด filter project ที่ inject อาจไม่ถูก resolve แก้โดยอัปเดต `vitest.config.project`:

```ts
configureVitest({ vitest, injectTestProjects }) {
  vitest.config.project.push('my-project-name')
  await injectTestProjects({ test: { name: 'my-project-name' } })
}
```

> มีผลเฉพาะ projects ที่ inject ผ่าน `injectTestProjects`

## TestProject Properties

### name

ชื่อ unique ที่ user กำหนด หรือ Vitest อนุมานจาก `package.json` หรือ folder name

```ts
vitest.projects.map(p => p.name) // ['@pkg/server', 'utils', '2', 'custom']
```

### vitest

อ้างอิง global `Vitest` process

### config

Resolved test config ของ project นั้น

### globalConfig

Test config ที่ `Vitest` ถูก initialize ด้วย ถ้าเป็น root project จะอ้างอิง object เดียวกับ `config`

```ts
vitest.config === vitest.projects[0].globalConfig
```

### serializedConfig

Config ที่ test processes รับ หลัง serialize (remove functions และ non-serializable properties)

> เป็น getter - ทุกครั้งที่ access จะ serialize ใหม่ คืน reference ต่างกันเสมอ

### hash (3.2.0+)

Unique hash ของ project คงที่ระหว่าง reruns อิงจาก root และ name

> Root path ต่างกันข้าม OS ทำให้ hash ต่างกันด้วย

### vite

`ViteDevServer` ของ project แต่ละ project มี Vite server ของตัวเอง

### browser

Set เฉพาะถ้า tests รันใน browser ถ้า browser enabled แต่ยังไม่ run จะเป็น `undefined` ตรวจด้วย `project.isBrowserEnabled()`

## TestProject Methods

### provide

```ts
function provide<T extends keyof ProvidedContext & string>(
  key: T,
  value: ProvidedContext[T],
): void
```

Provide custom values ให้ tests ค่าถูก validate ด้วย `structuredClone`

```ts
project.provide('key', 'value')
// ใน test: inject('key') === 'value'
```

### getProvidedContext

คืน context object รวม global context จาก `vitest.provide` ค่าของ project override root

### createSpecification

```ts
function createSpecification(moduleId: string, locations?: number[]): TestSpecification
```

สร้าง spec สำหรับ `vitest.runTestSpecifications` ต้องเป็น resolved module ID

### globTestFiles

```ts
function globTestFiles(filters?: string[]): { testFiles: string[]; typecheckTestFiles: string[] }
```

Glob test files ใช้ `test.include`, `test.exclude`, `test.includeSource`, `test.typecheck.*`

### matchesTestGlob

```ts
function matchesTestGlob(moduleId: string, source?: () => string): boolean
```

ตรวจว่าไฟล์เป็น test file หรือ in-source test

### import

```ts
function import<T>(moduleId: string): Promise<T>
```

Import ไฟล์ผ่าน Vite module runner โดยใช้ config ของ project

### onTestsRerun

```ts
function onTestsRerun(cb: OnTestsRerunHandler): void
```

Shorthand สำหรับ `project.vitest.onTestsRerun`

### isBrowserEnabled / isRootProject / close

- `isBrowserEnabled()`: คืน `true` ถ้า project รันใน browser
- `isRootProject()`: ตรวจว่าเป็น root project
- `close()`: ปิด project และ resources ทั้งหมด (Vite server, typechecker, browser, temp dir)

## Sources

- [Test Project | Vitest](https://vitest.dev/api/advanced/test-project)
- [Plugin API | Vitest](https://vitest.dev/api/advanced/plugin)
- [Vitest Instance | Vitest](https://vitest.dev/api/advanced/vitest)
