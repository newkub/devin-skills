| key | value |
|---|---|
| package | `gpui-kit` (crates.io) |
| install | `cargo add gpui-kit` |
| stable version | 0.8.0 (verified 2026-10-20 via `cargo info gpui-kit`; site examples show 0.7.3) |
| license | Apache-2.0 (code), docs prose CC BY 4.0 |
| docs | https://gpui-kit.com (full site as one file: https://gpui-kit.com/llms-full.txt) |
| api reference | https://docs.rs/gpui-kit |
| repository | https://github.com/longbridge/gpui-kit |
| publishes GPUI as | `gpui-pre` (crates.io snapshot of Zed's GPUI at a recorded commit — never depend on it directly alongside the kit) |
| re-export layers | `gpui_kit::*` (GPUI), `gpui_kit::component`, `gpui_kit::base`, `gpui_kit::assets`, `gpui_kit::platform` |

| feature | description | selection |
|---|---|---|
| default | `component` + `assets` (styled component library + default icon assets) | implicit |
| `gpui-fast` | switch every Kit layer to GPUI Fast retained rendering/layout engine (same imports, no `[patch]`) | `features = ["gpui-fast"]` |
| `test-support` | GPUI test harness support for UI tests | dev-dependency feature |
| `inspector` / `profiler` | dev inspection of the element tree | `features = [...]` |
| `speech` | dictation via system recognizer (needs ALSA on Linux) | `features = ["speech"]` |
| `assets` / `component` | layers individually with `default-features = false` | opt-in each |

| api | description | signature/example |
|---|---|---|
| `application()` | create the desktop application shell | `gpui_kit::application().with_assets(assets::Assets).run(\|cx\| ...)` |
| `.with_assets(...)` | register asset source (default icons) | `.with_assets(assets::Assets)` |
| `init(cx)` | initialize enabled Kit layers + component themes — once before any window/component | `gpui_kit::init(cx)` |
| `open_window(...)` | open a window; wraps the returned view in a `Root` automatically | `open_window(WindowOptions::default(), cx, \|_, cx\| cx.new(\|_\| MyView)).expect(...)` |
| `Root` | window-level owner of dialog/sheet/notification overlays — never build it yourself | via `open_window` |
| `Entity<T>` | state retained across frames; `T: Render` → persistent View | `cx.new(\|_\| MyView)` |
| `Render` trait | view rebuilds its element tree every render | `fn render(&mut self, _: &mut Window, cx: &mut Context<Self>) -> impl IntoElement` |
| `RenderOnce` | value component taking state + handlers from the caller (Button, Checkbox, Label) | builder chain per component |
| `cx.listener` | callback bound to the view entity — mutate then redraw | `cx.listener(\|this, ev, _, cx\| { ...; cx.notify(); })` |
| `cx.notify` | mark the entity dirty so it re-renders | after every state mutation |
| `cx.theme()` | read theme colors/typography (light/dark aware) | `.bg(cx.theme().background)` `.text_color(cx.theme().foreground)` |
| `Entity<*State>` | owned state for stateful inputs | `cx.new(\|cx\| InputState::new(window, cx))` stored in the view struct |
| `cx.subscribe_in` | event subscription — store the returned handle (drop = detach) | `let _sub = cx.subscribe_in(&state, window, \|v, s, ev, w, cx\| ...)` |
| `cx.spawn` | foreground async task on the UI context | `cx.spawn(async move \|this, cx\| { ...; this.update(cx, \|v, cx\| ...) })` |
| `cx.background_spawn` | heavy `Send` work on the worker pool — return owned data only | `cx.background_spawn(async move { compute() })` |
| `Task<T>` | task handle — drop = cancel, keep in a struct field | field `task: Task<()>` |
| `WeakEntity` | non-retaining entity handle for async callbacks | `entity.downgrade()` |
| `Action` derive | keyboard/command actions | `#[derive(Action)]` + `cx.bind_keys`/`KeyBinding` |
| `Sizable` / `Disableable` | shared component traits (`text_sm`..., `disabled(bool)`) | `use gpui_kit::component::Sizable as _;` |
| layout primitives | tailwind-style element building | `div()`/`v_flex()`/`h_flex()` + `.flex_col()` `.size_full()` `.gap_2()` `.p_4()` `.items_center()` `.justify_center()` |
| `#[gpui_kit::test]` | attribute for GPUI UI tests (with `test-support`) | mount the view in a test window, simulate events |

| category | components (`gpui_kit::component::<name>`) |
|---|---|
| basic | Accordion, Alert, Attachment, Avatar, Badge, Bubble, Button, Checkbox, Clipboard, Collapsible, DropdownButton, Empty, HoverCard, Icon, Image, Kbd, Label, Marker, Message, MessageScroller, Pagination, Progress, Questionnaire, Radio, Rating, Shimmer, Skeleton, Slider, Spinner, Stepper, Switch, Tag, TextView, Toggle, Tooltip |
| form | Input, InputGroup, Textarea, Editor, Select, Combobox, NumberInput, DatePicker, TimeField, OtpInput, Speech, ColorPicker, Form |
| layout | DescriptionList, FocusTrap, GroupBox, Root, Theme, Dialog, Notification, Popover, Resizable, Scrollable, Sheet, Sidebar, StatusBar, TitleBar, Toolbar |
| advanced | Diff, Calendar, Carousel, Command, Chart (Line/Bar/Area/Pie/Radar/Candlestick/Sankey), Plot (axis/shape internals), List, Menu, Settings, Table, DataTable, Dock (tabs/splits/persistent state), Tabs, Tree, VirtualList, WebView |

| platform | requirement |
|---|---|
| all | Rust + Cargo (Rust 1.92+ for the current locked dependency graph) |
| macOS | macOS 15+, Xcode Command Line Tools (`xcode-select --install`) — kit enables `font-kit` text rendering for you |
| Windows | Windows 10+, VS 2022 Build Tools "Desktop development with C++" (MSVC + Windows SDK), MSVC Rust toolchain (not GNU), CMake on `PATH` |
| Linux | Ubuntu 24.04 verified: `gcc g++ clang libfontconfig-dev libwayland-dev libwebkit2gtk-4.1-dev libxkbcommon-x11-dev libx11-xcb-dev libssl-dev libzstd-dev libasound2-dev vulkan-validationlayers libvulkan1`; needs a Wayland/X11 session + working Vulkan driver |
| other targets | WebAssembly (`/docs/webassembly`, nightly toolchain) and Mobile (`/docs/mobile`) have separate setup |

| dev-profile speedup | description |
|---|---|
| `[profile.dev.package]` `opt-level = 3` for `gpui-pre`, `gpui-component`, `gpui-kit`, `gpui-kit-assets`, `gpui-pre-macros`, `gpui-pre-platform`, `rustybuzz`, `taffy`, `ttf-parser` | debug build keeps debugging workflow but framework runs at release speed (longer compile, not faster) |
