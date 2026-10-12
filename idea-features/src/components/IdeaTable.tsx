import {
  flexRender,
  type Column,
  type Table,
} from "@tanstack/solid-table";
import { For, type Accessor } from "solid-js";
import type { Idea } from "../types";

const ENUM_OPTS: Record<string, string[]> = {
  kind: ["extends", "new", "platform"],
  phase: ["mvp", "v2", "v3"],
  impact: ["high", "medium", "low"],
  effort: ["s", "m", "l", "xl"],
};

function ColFilter(p: { col: Column<Idea, unknown>; groups: Accessor<string[]> }) {
  const id = p.col.id;
  const v = () => (p.col.getFilterValue() as string) ?? "";
  const set = (nv: string) => p.col.setFilterValue(nv || undefined);
  if (id in ENUM_OPTS) {
    return (
      <select class="fsel" value={v()} onChange={(e) => set(e.currentTarget.value)}>
        <option value="">all</option>
        <For each={ENUM_OPTS[id]}>{(o) => <option value={o}>{o}</option>}</For>
      </select>
    );
  }
  if (id === "group") {
    return (
      <select class="fsel" value={v()} onChange={(e) => set(e.currentTarget.value)}>
        <option value="">all</option>
        <For each={p.groups()}>{(o) => <option value={o}>{o}</option>}</For>
      </select>
    );
  }
  return (
    <input
      class="fin"
      placeholder="filter…"
      value={v()}
      onInput={(e) => set(e.currentTarget.value)}
    />
  );
}

export function IdeaTable(props: {
  table: Table<Idea>;
  groups: Accessor<string[]>;
  onSelect: (idea: Idea) => void;
  selected: () => Idea | null;
}) {
  return (
    <table class="tbl">
      <thead>
        <For each={props.table.getHeaderGroups()}>
          {(hg) => (
            <>
              <tr>
                <For each={hg.headers}>
                  {(h) => (
                    <th
                      classList={{ sortable: h.column.getCanSort(), "col-no": h.column.id === "no" }}
                      style={{ width: `${h.getSize()}px` }}
                      onClick={
                        h.column.getCanSort()
                          ? h.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      <div class="th">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        <span class="sort">
                          {h.column.getIsSorted() === "asc"
                            ? "▲"
                            : h.column.getIsSorted() === "desc"
                              ? "▼"
                              : "↕"}
                        </span>
                      </div>
                    </th>
                  )}
                </For>
              </tr>
              <tr class="filter-row">
                <For each={hg.headers}>
                  {(h) => (
                    <th classList={{ fcell: true, "col-no": h.column.id === "no" }}>
                      {h.column.getCanFilter() ? (
                        <ColFilter col={h.column} groups={props.groups} />
                      ) : null}
                    </th>
                  )}
                </For>
              </tr>
            </>
          )}
        </For>
      </thead>
      <tbody>
        <For each={props.table.getRowModel().rows}>
          {(row) =>
            row.getIsGrouped() ? (
              <tr class="group-row" onClick={row.getToggleExpandedHandler()}>
                <td colSpan={props.table.getVisibleLeafColumns().length}>
                  <span class="group-caret">{row.getIsExpanded() ? "▾" : "▸"}</span>
                  <span class="group-key">{row.groupingColumnId}</span>
                  <span class="group-val">{String(row.groupingValue)}</span>
                  <span class="group-count">{row.subRows.length}</span>
                </td>
              </tr>
            ) : (
              <tr
                classList={{ sel: props.selected()?.no === row.original.no }}
                onClick={() => props.onSelect(row.original)}
              >
                <For each={row.getVisibleCells()}>
                  {(cell) => (
                    <td
                      classList={{
                        [`c-${cell.column.id}`]: true,
                        "col-no": cell.column.id === "no",
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  )}
                </For>
              </tr>
            )
          }
        </For>
      </tbody>
    </table>
  );
}
