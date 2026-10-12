import { createColumnHelper } from "@tanstack/solid-table";
import type { Idea } from "../types";

const col = createColumnHelper<Idea>();

const badge = (cls: string) => (i: { getValue: () => unknown }) => (
  <span class={`badge ${cls}-${i.getValue()}`}>{String(i.getValue())}</span>
);

export const columns = [
  col.accessor("no", {
    header: "No.",
    size: 56,
    enableGrouping: false,
    enableColumnFilter: false,
    cell: (i) => <span class="cell-no">{i.getValue()}</span>,
  }),
  col.accessor("title", {
    header: "Title",
    size: 320,
    enableGrouping: false,
    filterFn: "includesString",
  }),
  col.accessor("kind", {
    header: "Kind",
    filterFn: "equalsString",
    size: 96,
    cell: badge("k"),
  }),
  col.accessor("group", {
    header: "Group",
    filterFn: "equalsString",
    size: 140,
    cell: (i) => <span class="cell-group">{i.getValue()}</span>,
  }),
  col.accessor("phase", {
    header: "Phase",
    filterFn: "equalsString",
    size: 84,
    cell: badge("p"),
  }),
  col.accessor("impact", {
    header: "Impact",
    filterFn: "equalsString",
    size: 92,
    cell: badge("i"),
  }),
  col.accessor("effort", {
    header: "Effort",
    filterFn: "equalsString",
    size: 76,
    cell: badge("e"),
  }),
  col.accessor("mvp", {
    header: "MVP",
    size: 60,
    enableGrouping: false,
    enableColumnFilter: false,
    cell: (i) => (
      <span class={`mvp-score mvp-${i.getValue() >= 8 ? "hi" : i.getValue() >= 5 ? "mid" : "lo"}`}>
        {i.getValue()}
      </span>
    ),
  }),
  col.accessor("tags", {
    header: "Tags",
    cell: (i) => (
      <span class="cell-tags">
        {i.getValue().map((t) => `#${t}`).join(" ")}
      </span>
    ),
    enableSorting: false,
    enableGrouping: false,
    filterFn: (row, _id, v) =>
      row.original.tags
        .join(" ")
        .toLowerCase()
        .includes(String(v).toLowerCase()),
  }),
];
