# Use Case — IDE-style Workspace (Dock + Code Editor)

> Multi-panel resizable workspaces with persistable layout and a source-code editor. Source: https://gpui-kit.com/component/dock, /component/editor (accessed 2026-10-20)

## 1. Dock — panel workspace (verified from docs)

Draggable tab groups, nested splits, collapsible left/right/bottom docks. This is the layout foundation Longbridge uses in production; `gpui-base` owns model/layout/drag, `gpui-component` supplies chrome.

```rust
use gpui_kit::component::dock::{DockArea, DockSkin, DockLayout, BasePanel, Panel, PanelEvent, panel_handle};

// 1. create the area (version = your saved-layout schema version)
let (dock_area, dock_skin) = DockSkin::dock_area("main-dock", Some(1), window, cx);

// 2. a panel: Focusable + EventEmitter<PanelEvent> + BasePanel (identity) + Panel (title) + Render
impl BasePanel for FilesPanel {
    fn panel_name(&self) -> &'static str { "FilesPanel" }
}
impl Panel for FilesPanel {
    fn title(&mut self, _: &mut Window, _: &mut Context<Self>) -> impl IntoElement { "Files" }
}

// 3. describe initial layout — DockLayout is a plain value, composable before any window
let layout = DockLayout::h_split()
    .child(DockLayout::tabs().panel_view(panel_handle(files), cx), Some(px(240.)))
    .child(DockLayout::tabs().panel_view(panel_handle(editor), cx), None); // None = fill
dock_area.update(cx, |area, cx| area.set_center(layout, window, cx));
```

Persist and restore with Serde:

```rust
use gpui_kit::component::dock::DockAreaState;

let state = dock_area.read(cx).dump(cx);                 // save
let json = serde_json::to_string_pretty(&state)?;
let state: DockAreaState = serde_json::from_str(&json)?; // restore
dock_area.update(cx, |area, cx| area.load(state, window, cx))?;

// register every restorable panel name at app init:
register_panel(cx, "FilesPanel", |state, window, cx| {
    panel_handle(cx.new(|cx| FilesPanel::from_state(state, window, cx)))
});
```

- runtime ops: add/remove/activate/zoom/move panels; user actions emit `DockEvent` incl. `LayoutChanged` (persist on that)
- style via the retained skin: `dock_skin.set_panel_style(PanelStyle::default(), cx)`, `set_toggle_button_visible(true, cx)`; full custom rendering = implement `gpui-base` renderer traits
- runnable reference: `cargo run -p example-dock` (`examples/dock/src/main.rs`)
- keep a fallback layout for removed panels or deliberate schema bumps

## 2. Editor — source-code control (verified from docs)

Use `Input` for single-line, `Textarea` for plain multi-line, `Editor` for code.

```rust
use gpui_kit::component::input::{Editor, EditorState, TabSize};

let editor = cx.new(|cx| {
    EditorState::new(window, cx)
        .language("rust")                       // syntax needs Cargo feature e.g. tree-sitter-rust
        .line_number(true).folding(true)        // .show_whitespaces(true)
        .tab_size(TabSize { tab_size: 4, hard_tabs: false })
        .auto_close(true).smart_indent(true)    // editor preferences, independent of language rules
        .default_value("fn main() {}")
});
Editor::new(&editor).h(px(320.))
```

Per-language editing rules (Monaco-style subset, not a Monaco JSON loader):

```rust
use gpui_kit::component::input::{AutoClosingPair, BracketPair, SyntaxContext, set_language_config};
use gpui_kit::component::input::language_config::LanguageConfig;

let rules = LanguageConfig::default()
    .brackets([BracketPair::new("{", "}"), BracketPair::new("(", ")")])
    .auto_closing_pairs([
        AutoClosingPair::new("{", "}").not_in([SyntaxContext::String, SyntaxContext::Comment]),
    ])
    .auto_close_before(";:.,=}])>");
set_language_config("rust", rules, cx); // replaces live; aliases share config (python/py/pyi)
```

- `IndentationRules::new(increase, decrease)` takes compiled `regex::Regex` patterns tested before/after the caret on Enter; rules never reformat existing or pasted lines
- completions: `window.dispatch_action(Box::new(ShowCompletions), cx)` or `state.show_completions(window, cx)` — no default shortcut; bind with context `Input && mode == editor`
- search: built-in panel on `Ctrl-F`/`Cmd-F`, `state.open_search(false, cx)` / `close_search(cx)` programmatically, `set_searchable(false)` to hide the panel and drive your own UI with `set_search_query` / `next_search_match`
- multi-cursor + column selection per platform (macOS Option, Windows/Linux Alt): add cursor above/below, block drag, edits apply to all selections — multi-cursor, not Vim Visual Block

## Pitfalls

- restoring a saved layout without registering panel factories — unknown panel names can't be rebuilt
- depending on `gpui-pre` directly for base Dock types — use the `gpui_kit` re-exports (single-dependency rule)
- expecting Tree-sitter `.scm` or Monaco JSON to load — only the `LanguageConfig` subset is supported; unknown languages fall back to `LanguageConfig::default()`
- `not_in([SyntaxContext::...])` without a grammar feature — base editor reports everything as `Code`, so guards never fire

## Related

- `references/apis.md`
- `best-practices/components.md`
- `best-practices/state-model.md`
