import { For, type Accessor } from "solid-js";

export interface ToolbarProps {
  search: Accessor<string>;
  onSearch: (v: string) => void;
  groupBy: Accessor<string>;
  onGroupBy: (v: string) => void;
  count: Accessor<number>;
  total: Accessor<number>;
  allExpanded: Accessor<boolean>;
  onToggleAll: () => void;
}

const GROUP_OPTS = [
  ["", "group: none"],
  ["group", "group (routes/commands/api)"],
  ["kind", "kind"],
  ["phase", "phase"],
  ["impact", "impact"],
  ["effort", "effort"],
] as const;

export function Toolbar(p: ToolbarProps) {
  return (
    <div class="toolbar">
      <div class="search-wrap">
        <span class="search-icon">⌕</span>
        <input
          class="search"
          type="search"
          placeholder="Search title, description, tags…"
          value={p.search()}
          onInput={(e) => p.onSearch(e.currentTarget.value)}
        />
      </div>
      <select
        class="sel"
        value={p.groupBy()}
        onChange={(e) => p.onGroupBy(e.currentTarget.value)}
        title="Group rows by"
      >
        <For each={[...GROUP_OPTS]}>
          {(o) => <option value={o[0]}>{o[1]}</option>}
        </For>
      </select>
      <button
        class="btn"
        onClick={p.onToggleAll}
        disabled={!p.groupBy()}
        title={p.allExpanded() ? "Collapse all groups" : "Expand all groups"}
      >
        {p.allExpanded() ? "Collapse all" : "Expand all"}
      </button>
      <span class="count">
        {p.count() === p.total()
          ? `${p.total()} ideas`
          : `${p.count()} / ${p.total()} ideas`}
      </span>
    </div>
  );
}
