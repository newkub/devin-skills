# Tauri Plugin Rust API Reference

อ้างอิง Rust API สำหรับสร้าง custom Tauri plugins ครอบคลุม `Builder`, commands macro, lifecycle hooks, state management และ `Manager` trait

## Builder

`Builder` เป็น entry point สำหรับสร้าง plugin ใช้ `tauri::plugin::Builder` พร้อมชื่อ plugin และเรียก `.build()` เพื่อสร้าง `TauriPlugin`

```rust
use serde::Deserialize;
use tauri::{
    plugin::{Builder, TauriPlugin},
    Runtime,
};

#[derive(Deserialize)]
pub struct Config {
    timeout: usize,
}

pub fn init<R: Runtime>() -> TauriPlugin<R, Config> {
    Builder::<R, Config>::new("<plugin-name>")
        .setup(|app, api| {
            let timeout = api.config().timeout;
            Ok(())
        })
        .build()
}
```

- ใช้ `Builder::<R, Option<Config>>` หากต้องการให้ config เป็น optional
- `api.config()` คืนค่า config ที่ parse จาก `tauri.conf.json > plugins`

## Commands Macro

commands ใช้ `#[tauri::command]` macro และ register ผ่าน `tauri::generate_handler!`

```rust
use tauri::{command, ipc::Channel, AppHandle, Runtime, Window};

#[command]
async fn upload<R: Runtime>(
    app: AppHandle<R>,
    window: Window<R>,
    on_progress: Channel,
    url: String,
) {
    on_progress.send(100).unwrap();
}
```

Register ใน `lib.rs`:

```rust
Builder::new("<plugin-name>")
    .invoke_handler(tauri::generate_handler![commands::upload])
```

- commands สามารถ access `AppHandle`, `Window`, state และ input parameters ผ่าน dependency injection
- ใช้ `Channel` สำหรับ streaming data กลับไปยัง frontend

## Lifecycle Hooks

### setup

ทำงานเมื่อ plugin กำลัง initialize ใช้สำหรับ manage state และ start background tasks

```rust
use tauri::{Manager, plugin::Builder};
use std::{collections::HashMap, sync::Mutex, time::Duration};

struct DummyStore(Mutex<HashMap<String, String>>);

Builder::new("<plugin-name>")
    .setup(|app, api| {
        app.manage(DummyStore(Default::default()));

        let app_ = app.clone();
        std::thread::spawn(move || {
            loop {
                app_.emit("tick", ());
                std::thread::sleep(Duration::from_secs(1));
            }
        });

        Ok(())
    })
```

### on_navigation

ทำงานเมื่อ webview กำลัง navigate คืน `false` เพื่อ cancel navigation

```rust
Builder::new("<plugin-name>")
    .on_navigation(|window, url| {
        url.scheme() != "forbidden"
    })
```

### on_webview_ready

ทำงานเมื่อ window ใหม่ถูกสร้าง ใช้สำหรับ execute initialization script

```rust
Builder::new("<plugin-name>")
    .on_webview_ready(|window| {
        window.listen("content-loaded", |event| {
            println!("webview content has been loaded");
        });
    })
```

### on_event

ทำงานเมื่อมี event loop events เช่น `RunEvent::ExitRequested`, `RunEvent::Exit`

```rust
use tauri::{plugin::Builder, Manager, RunEvent};

Builder::new("<plugin-name>")
    .on_event(|app, event| {
        match event {
            RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit();
            }
            RunEvent::Exit => {
                let store = app.state::<DummyStore>();
                // cleanup logic
            }
            _ => {}
        }
    })
```

### on_drop

ทำงานเมื่อ plugin ถูก destroy ใช้สำหรับ teardown logic

```rust
Builder::new("<plugin-name>")
    .on_drop(|app| {
        // plugin has been destroyed
    })
```

## State Management

ใช้ `app.manage()` ใน `setup` hook เพื่อ register state และ access ผ่าน `tauri::State` ใน commands

```rust
struct MyState(String);

#[tauri::command]
fn my_command(state: tauri::State<MyState>) {
    println!("{}", state.0);
}
```

นอก commands ใช้ `Manager` trait เพื่อ access state:

```rust
use tauri::{Manager, Window, WindowEvent};

fn on_window_event(window: &Window, _event: &WindowEvent) {
    let app_handle = window.app_handle();
    let state = app_handle.state::<Mutex<MyState>>();
    let mut state = state.lock().unwrap();
    state.counter += 1;
}
```

## Manager Trait

`Manager` trait ให้ method สำหรับ access state, windows, events บน `AppHandle`, `App`, `Window`

- `app.manage(state)` — register state
- `app.state::<T>()` — ดึง state ที่ registered
- `app.emit("event", payload)` — emit event ไปยัง frontend
- `app.path()` — access path APIs

## Extension Traits

Plugin APIs ใน `desktop.rs` และ `mobile.rs` export เป็น struct และ access ผ่าน extension trait

```rust
use tauri_plugin_global_shortcut::GlobalShortcutExt;

tauri::Builder::default()
    .plugin(tauri_plugin_global_shortcut::init())
    .setup(|app| {
        app.global_shortcut().register(...);
        Ok(())
    })
```

## Command Permissions

commands ไม่ accessible โดย default ต้อง define permissions ใน `permissions/` directory

Autogenerate permissions ผ่าน `build.rs`:

```rust
const COMMANDS: &[&str] = &["upload"];

fn main() {
    tauri_plugin::Builder::new(COMMANDS).build();
}
```

สร้าง `allow-upload` และ `deny-upload` อัตโนมัติ

Default permission ใน `permissions/default.toml`:

```toml
"$schema" = "schemas/schema.json"
[default]
description = "Allows upload operations"
permissions = ["allow-upload"]
```

## Sources

- https://v2.tauri.app/develop/plugins/
- https://v2.tauri.app/develop/state-management/
- https://v2.tauri.app/develop/calling-rust/
- https://docs.rs/tauri/2/tauri/plugin/struct.Builder.html
- https://docs.rs/tauri/2/tauri/manager/trait.Manager.html
