# Obsidian Plugin Reference

## Official Sources

- Obsidian Developer Docs: https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin
- Obsidian API: https://github.com/obsidianmd/obsidian-api
- Sample Plugin: https://github.com/obsidianmd/obsidian-sample-plugin
- Plugin Directory: https://obsidian.md/plugins
- Community Release Repo: https://github.com/obsidianmd/obsidian-releases

## Manifest Schema

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "minAppVersion": "0.15.0",
  "description": "A sample plugin",
  "author": "Your Name",
  "authorUrl": "https://example.com",
  "fundingUrl": "https://example.com/fund",
  "isDesktopOnly": false
}
```

- `id`: ตัวอักษร lowercase, hyphen, underscore, ไม่มี space
- `version`: semver
- `minAppVersion`: Obsidian version ต่ำสุด
- `isDesktopOnly`: `true` ถ้าใช้ API ทีไม่รองรับ mobile

## versions.json

```json
{
  "1.0.0": "0.15.0",
  "1.1.0": "0.15.0"
}
```

## esbuild.config.mjs

```js
import esbuild from 'esbuild'
import process from 'process'

const prod = process.argv[2] === 'production'

esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  external: ['obsidian', 'fs', 'path'],
  format: 'cjs',
  target: 'es2018',
  outdir: '.',
  sourcemap: prod ? false : 'inline',
  minify: prod,
}).catch(() => process.exit(1))
```

## Plugin Class Example

```ts
import { Plugin, Notice, Setting, PluginSettingTab } from 'obsidian'

interface MySettings {
  greeting: string
}

const DEFAULT_SETTINGS: MySettings = { greeting: 'Hello' }

export default class MyPlugin extends Plugin {
  settings: MySettings

  async onload() {
    await this.loadSettings()
    this.addRibbonIcon('dice', 'Greet', () => {
      new Notice(this.settings.greeting)
    })
    this.addCommand({
      id: 'greet',
      name: 'Greet',
      callback: () => new Notice(this.settings.greeting),
    })
    this.addSettingTab(new MySettingTab(this.app, this))
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)
  }
}

class MySettingTab extends PluginSettingTab {
  plugin: MyPlugin
  constructor(app, plugin) {
    super(app, plugin)
    this.plugin = plugin
  }
  display() {
    const { containerEl } = this
    containerEl.empty()
    new Setting(containerEl)
      .setName('Greeting')
      .setDesc('Message to show')
      .addText(text => text
        .setValue(this.plugin.settings.greeting)
        .onChange(async value => {
          this.plugin.settings.greeting = value
          await this.plugin.saveSettings()
        }))
  }
}
```

## package.json

```json
{
  "name": "obsidian-my-plugin",
  "version": "1.0.0",
  "description": "My Obsidian plugin",
  "main": "main.js",
  "scripts": {
    "dev": "node esbuild.config.mjs",
    "build": "tsc -noEmit -skipLibCheck && node esbuild.config.mjs production"
  },
  "devDependencies": {
    "obsidian": "latest",
    "esbuild": "^0.25.0",
    "typescript": "^5.8.0"
  }
}
```

## Release Checklist

- อัปเดต `manifest.json` version
- อัปเดต `versions.json`
- build `main.js` และ `styles.css`
- สร้าง git tag `1.0.0`
- สร้าง GitHub release พร้อมแนบ `main.js`, `manifest.json`, `styles.css`
