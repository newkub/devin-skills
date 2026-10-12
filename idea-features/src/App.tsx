import { createMemo, createSignal, onMount } from "solid-js";
import {
  createSolidTable,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  type ColumnFiltersState,
  type ExpandedState,
  type GroupingState,
  type SortingState,
} from "@tanstack/solid-table";
import { columns } from "./lib/columns";
import { Toolbar } from "./components/Toolbar";
import { IdeaTable } from "./components/IdeaTable";
import { DetailPanel } from "./components/DetailPanel";
import type { Idea, IdeasFile } from "./types";

export default function App() {
  const [payload, setPayload] = createSignal<IdeasFile | null>(null);
  const [search, setSearch] = createSignal("");
  const [sorting, setSorting] = createSignal<SortingState>([]);
  const [grouping, setGrouping] = createSignal<GroupingState>(["group"]);
  const [expanded, setExpanded] = createSignal<ExpandedState>(true);
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>([]);
  const [selected, setSelected] = createSignal<Idea | null>(null);

  onMount(async () => {
    const res = await fetch("/ideas.json");
    setPayload(await res.json());
  });

  const groups = createMemo(() => [
    ...new Set((payload()?.ideas ?? []).map((i) => i.group)),
  ]);

  const allExpanded = createMemo(() => expanded() === true);

  const onToggleAll = () => setExpanded(allExpanded() ? {} : true);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") setSelected(null);
  };
  onMount(() => window.addEventListener("keydown", onKey));

  const table = createSolidTable<Idea>({
    get data() {
      return payload()?.ideas ?? [];
    },
    columns,
    state: {
      get globalFilter() {
        return search();
      },
      get sorting() {
        return sorting();
      },
      get grouping() {
        return grouping();
      },
      get expanded() {
        return expanded();
      },
      get columnFilters() {
        return columnFilters();
      },
    },
    onGlobalFilterChange: setSearch,
    onSortingChange: setSorting,
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: "includesString",
    autoResetExpanded: false,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div class="app">
      <header class="hd">
        <h1>
          idea-features{" "}
          <span class="dim">
            {payload()?.project ?? "loading…"} — {payload()?.ideas.length ?? 0} ideas
          </span>
        </h1>
      </header>
      <Toolbar
        search={search}
        onSearch={setSearch}
        groupBy={() => grouping()[0] ?? ""}
        onGroupBy={(v) => setGrouping(v ? [v] : [])}
        count={() => table.getFilteredRowModel().rows.length}
        total={() => payload()?.ideas.length ?? 0}
        allExpanded={allExpanded}
        onToggleAll={onToggleAll}
      />
      <main classList={{ hasDetail: !!selected() }}>
        <div class="table-wrap">
          <IdeaTable
            table={table}
            groups={groups}
            onSelect={setSelected}
            selected={selected}
          />
        </div>
        <DetailPanel idea={selected} onClose={() => setSelected(null)} />
      </main>
    </div>
  );
}
