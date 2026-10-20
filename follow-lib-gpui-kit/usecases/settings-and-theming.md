# Use Case — Settings UI, Theming & Localization

> macOS-style settings, theme loading, and translated components. Source: https://gpui-kit.com/component/settings, /component/theme, /docs/i18n (accessed 2026-10-20)

## 1. Settings screen (verified from docs)

Layout: `Settings → SettingPage → SettingGroup → SettingItem → SettingField`. Search matches title, description, and custom keywords (macOS/iOS style).

```rust
use gpui_kit::component::setting::{Settings, SettingPage, SettingGroup, SettingItem, SettingField};

Settings::new("my-settings")
    .pages(vec![
        SettingPage::new("General")
            .default_open(true)
            .group(SettingGroup::new().title("Basic Options").item(
                SettingItem::new(
                    "Enable Feature",
                    SettingField::switch(
                        |cx: &App| true,               // getter reads current value
                        |val: bool, cx: &mut App| { /* setter persists */ },
                    ),
                ),
            )),
        SettingPage::new("About").group(SettingGroup::new().items(vec![...])),
    ])
```

- search selection rules: the current page stays selected while it has matches, else the first matching page; clearing search keeps the current page
- field types include Input, Dropdown, Switch via the `SettingField` constructors

## 2. Theme access & custom themes (verified from docs)

```rust
use gpui_kit::component::ActiveTheme;

div().bg(cx.theme().background).text_color(cx.theme().foreground)
     .border_color(cx.theme().border);
```

- theme JSON color tokens accept hex or CSS-style two-stop gradients: `"button.primary.background": "linear-gradient(135deg, #4F46E5, #06B6D4)"`; top-level fields stay solid `Hsla` — resolved `Background` (incl. gradients) is at `cx.theme().tokens.button_primary.background`
- 20+ built-in themes live in the repo `themes/` folder; look them up by entry `name` (e.g. `Ayu Light`)

```rust
use gpui_kit::component::{Theme, ThemeRegistry};

ThemeRegistry::watch_dir(std::path::PathBuf::from("./themes"), cx, move |cx| {
    if let Some(theme) = ThemeRegistry::global(cx).themes().get(&theme_name).cloned() {
        Theme::update(cx, |current| current.apply_config(&theme));
    }
});
```

`watch_dir` hot-reloads on file changes — the callback re-applies whenever the directory updates.

## 3. Localization with rust-i18n (verified from docs)

Requires rust-i18n 4.2+. Component built-in strings live in `crates/component/locales/ui.yml` (en, zh-CN, zh-HK, zh-TW, it); your app owns its own `locales/ui.yml` and overrides deep-merged on top.

```toml
[dependencies]
gpui-kit = "..."        # live-check version with cargo info
rust-i18n = "4.2"
```

```yaml
# locales/ui.yml — component keys go under the gpui_component namespace
# (crate name gpui-component with hyphens -> underscores; copy key names exactly)
_version: 2
app:
  save:
    en: Save
    fr: Enregistrer
gpui_component:
  Calendar:
    month.January:
      fr: Janvier
  DatePicker:
    placeholder:
      fr: Sélectionner une date
```

```rust
// crate root:
rust_i18n::i18n!("locales", fallback = "en");

// startup order matters — extend! once, BEFORE init:
use gpui_kit::component as gpui_component;
rust_i18n::extend!(gpui_component);
gpui_kit::init(cx);
```

- lookup priority: app locales first, component built-ins fill the rest — supply only the keys you need; future component translations stay available without copying
- `extend!` affects component lookups only; app code reads its own keys via `rust_i18n::t!("app.save")`
- switching: `gpui_kit::component::{locale, set_locale}` — locale is outside GPUI change tracking, so follow with `cx.notify()` (view-level) or `cx.refresh_windows()` (from `&mut App`), and rebuild cached menus/labels explicitly
- CJK/RTL: verify font glyph coverage per platform; `set_locale` selects strings but does not mirror layout, and does not format dates/numbers — bring your own formatter for domain data

## Pitfalls

- calling `extend!` after `gpui_kit::init(cx)` — overrides don't register and components keep built-in strings
- changing locale without notify/refresh — stale labels until the next unrelated repaint
- defining app keys inside `gpui_component` expecting `t!` to find them — that namespace is component-lookup only
- hand-copying the whole component `ui.yml` into the app — deep-merge means you only override the keys you need
- assuming `cx.theme().tokens.*` is needed everywhere — solid fields like `cx.theme().primary` stay compatible unless you consume gradients

## Related

- `references/apis.md`
- `best-practices/components.md`
- `best-practices/state-model.md`
