# Use Case — Data Tables, Charts & Scrollable Lists

> Build datasets UIs: virtualized tables, charts, and scroll containers. Source: https://gpui-kit.com/component/data-table, /component/chart, /component/scrollable (accessed 2026-10-20)

## Scenario table

| Building | Components / APIs |
|---|---|
| Large tabular dataset | `component::table::{DataTable, TableState, TableDelegate, Column, ColumnSort, ColumnFixed, TableEvent}` |
| Trends over time | `component::chart::{LineChart, AreaChart}` |
| Category comparison | `component::chart::BarChart` |
| Composition / distribution | `component::chart::{PieChart, RadarChart, SankeyChart}` |
| OHLC price data | `component::chart::CandlestickChart` |
| Scrollbars on any container | `component::scroll::{ScrollableElement, ScrollbarAxis, ScrollbarMode}` + `StyledExt` |

## DataTable (delegate pattern, verified from docs)

Virtual scrolling, row/column/cell selection, resizable + fixed columns, sorting, keyboard navigation, context menus, infinite loading. You implement `TableDelegate`; `TableState<D>` holds runtime state.

```rust
use gpui_kit::component::table::{DataTable, TableDelegate, Column, ColumnSort};

struct MyTableDelegate { data: Vec<MyData>, columns: Vec<Column> }

impl TableDelegate for MyTableDelegate {
    fn columns_count(&self, _: &App) -> usize { self.columns.len() }
    fn rows_count(&self, _: &App) -> usize { self.data.len() }
    fn column(&self, col_ix: usize, _: &App) -> Column { self.columns[col_ix].clone() }
    fn render_td(&mut self, row_ix: usize, col_ix: usize, _: &mut Window,
                 _: &mut Context<TableState<Self>>) -> impl IntoElement {
        // match on self.columns[col_ix].key to render each cell
        self.data[row_ix].name.clone()
    }
}

let columns = vec![
    Column::new("id", "ID").width(60.),
    Column::new("name", "Name").width(150.).sortable(),
];
```

- `render_td` can return any element — badges, inputs, progress bars, not just strings
- user interactions arrive as `TableEvent` (subscribe on the `TableState` entity)

## Charts (verified from docs)

Charts take data + accessor closures and auto-adapt to the active theme.

```rust
use gpui_kit::component::chart::{LineChart, BarChart};

LineChart::new(data)
    .x(|d| d.month.clone())
    .y(|d| d.value)
    .linear()            // or default curved, .step_after(), .dot()
    .stroke(cx.theme().success);

BarChart::new(data)
    .band(|d| d.category.clone())
    .value(|d| d.value)
    .label(|d| format!("{}", d.value));
```

Axes and guides for `LineChart`/`AreaChart`: `y_axis(true)`, `y_tick_count`, `y_tick_format`, `x_tick_count`, `grid_columns`, `grid_dashed(false)`, `reference_line(value)`, `y_padding`, `y_domain(low, high)`, `point_count`. Label placement via `gpui_kit::component::plot::AxisLabelPlacement::Inside`.

Bar fills: `fill(|d, bar_bounds, chart_bounds, alignment| ...)` returns anything convertible to `Background` (solid, gradient, pattern); `fill_gradient(|d, chart_range, chart_to_bar| [linear_color_stop(c, 0.0), ...])` aligns the gradient to the bar orientation — `fill` and `fill_gradient` are mutually exclusive. Orientation comes from `gpui_kit::component::plot::shape::BarAlignment`; hide the band axis with `label_axis(false)`.

## Scrollable containers (verified from docs)

```rust
use gpui_kit::component::scroll::{ScrollableElement, ScrollbarAxis, ScrollbarMode};

v_flex().id("list").overflow_y_scrollbar().child(items)  // custom scrollbar, not just overflow
```

- `overflow_scrollbar()` both axes, `overflow_x_scrollbar()` / `overflow_y_scrollbar()` single axis — each requires `.id(...)`
- `ScrollbarMode` controls visibility; `DataTable`/`MessageScroller` bring their own virtualization — use `v_virtual_list` directly for plain long lists

## Pitfalls

- no `.id(...)` on a scrollable div — scroll position and state are lost between renders
- rebuilding a `TableDelegate` resets view state — keep it behind the `TableState` entity and mutate its data instead
- gradient tokens only apply to background-capable tokens; top-level `cx.theme().button_primary` stays a solid `Hsla` (use `.tokens.button_primary.background` for the full value)
- chart tick density: default shows every label — set `tick_margin` / `x_tick_count` for long series
