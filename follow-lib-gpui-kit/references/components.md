# GPUI Kit — Component Catalog

Docs pattern: `https://gpui-kit.com/component/<slug>` — import `use gpui_kit::component::<mod>::<Type>;`

## Inputs & Forms

| Component | Slug | Notes |
|-----------|------|-------|
| Checkbox | `checkbox` | `Checkbox::new("id").label().checked().on_change()` — Sizable, Disableable |
| Radio | `radio` | `RadioGroup` grouping |
| Switch | `switch` | binary toggle |
| Input | `input` | stateful — `Entity<InputState>` + `InputEvent` subscription |
| Input Group | `input-group` | grouped inputs |
| Textarea | `textarea` | multi-line state |
| NumberInput | `number-input` | numeric field |
| OtpInput | `otp-input` | OTP entry |
| Slider | `slider` | value range |
| Rating | `rating` | star rating |
| Select | `select` | dropdown select |
| Combobox | `combobox` | searchable select |
| DatePicker | `date-picker` | date selection |
| Calendar | `calendar` | calendar view |
| TimeField | `time-field` | time entry |
| ColorPicker | `color-picker` | color selection |
| Form | `form` | `Form` + `Field` layout |
| Questionnaire | `questionnaire` | survey-style forms |
| Toggle | `toggle` | toggle button |
| DropdownButton | `dropdown_button` | button + menu |
| Focus Trap | `focus-trap` | focus containment |

## Data Display

| Component | Slug | Notes |
|-----------|------|-------|
| Table | `table` | basic table |
| DataTable | `data-table` | advanced table |
| List | `list` | item list |
| VirtualList | `virtual-list` | large list virtualization |
| Tree | `tree` | hierarchical |
| DescriptionList | `description-list` | key/value |
| Chart | `chart` | charts |
| Plot | `plot` | plotting |
| Tag | `tag` | labels |
| Badge | `badge` | status badge |
| Avatar | `avatar` | user avatar |
| TextView | `text-view` | rich/markdown text |
| Marker | `marker` | highlight marker |
| Carousel | `carousel` | sliding content |
| Image | `image` | image display |
| Icon | `icon` | `IconName` — Lucide + Isocons |
| Kbd | `kbd` | keyboard hint |
| Empty | `empty` | empty state |
| Skeleton | `skeleton` | loading placeholder |
| Shimmer | `shimmer` | shimmer effect |

## Feedback & Overlay

| Component | Slug | Notes |
|-----------|------|-------|
| Alert | `alert` | inline alert |
| AlertDialog | `alert-dialog` | confirm dialog |
| Dialog | `dialog` | modal (owned by `Root`) |
| Sheet | `sheet` | side sheet |
| Notification | `notification` | toast |
| Popover | `popover` | anchored overlay |
| Tooltip | `tooltip` | hover hint |
| HoverCard | `hover-card` | hover preview |
| Menu | `menu` | context/dropdown menu |
| Spinner | `spinner` | loading |
| Progress | `progress` | progress bar |
| Message | `message` | chat message |
| Bubble | `bubble` | chat bubble |
| MessageScroller | `message-scroller` | chat scroll area |
| Attachment | `attachment` | file attachment |

## Layout & Navigation

| Component | Slug | Notes |
|-----------|------|-------|
| Accordion | `accordion` | collapsible sections |
| Collapsible | `collapsible` | single collapse |
| Tabs | `tabs` | tab strip |
| Sidebar | `sidebar` | app sidebar |
| Dock | `dock` | docked panels |
| Resizable | `resizable` | split panes |
| Scrollable | `scrollable` | scroll container |
| GroupBox | `group-box` | titled group |
| Stepper | `stepper` | step wizard |
| Pagination | `pagination` | pager |
| TitleBar | `title-bar` | custom titlebar |
| StatusBar | `status-bar` | bottom bar |
| Toolbar | `toolbar` | action bar |
| Root View | `root` | `Root` overlay host (auto via `open_window`) |
| Theme | `theme` | theme provider + `ActiveTheme` |
| Settings | `settings` | settings UI |
| Editor | `editor` | code/text editor |
| Label | `label` | text label |
| Button | `button` | `ButtonVariants` (`.primary()` etc.) |
| Clipboard | `clipboard` | clipboard helper |
| Command | `command` | command palette |

## Common Patterns

```rust
// Controlled component — owner keeps value, applies requested, notifies
Checkbox::new("id")
    .label("Accept terms")
    .checked(self.agree)
    .on_change(cx.listener(|view, checked, _, cx| {
        view.agree = *checked;
        cx.notify();
    }))

// Sizing — shared Sizable trait
use gpui_kit::component::Sizable as _;
Checkbox::new("cb").text_sm().label("Small")

// Disabled — shared Disableable trait
use gpui_kit::component::Disableable as _;
Checkbox::new("cb").disabled(true)

// Stateful input — Entity<InputState> + subscription
let input = cx.new(|cx| InputState::new(window, cx).placeholder("Name"));
let sub = cx.subscribe_in(&input, window, |this, state, ev, _, cx| {
    if matches!(ev, InputEvent::Change) {
        this.value = state.read(cx).value().to_string().into();
        cx.notify();
    }
});
```
