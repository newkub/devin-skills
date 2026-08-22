import { createSignal, Show } from "solid-js";
import { Graph } from "../Graph";

export function GraphPage() {
  const [search, setSearch] = createSignal("");
  const [prefix, setPrefix] = createSignal("all");
  const [selected, setSelected] = createSignal<{ id: string; title: string } | null>(null);
  const [loading, setLoading] = createSignal(true);

  return (
    <div class="app">
      <aside class="sidebar">
        <h1>Devin Skills</h1>
        <input
          type="text"
          placeholder="search..."
          value={search()}
          onInput={(e) => setSearch(e.currentTarget.value)}
        />
        <select value={prefix()} onChange={(e) => setPrefix(e.currentTarget.value)}>
          <option value="all">all prefixes</option>
          <option value="follow">follow</option>
          <option value="run">run</option>
          <option value="check">check</option>
          <option value="report">report</option>
          <option value="idea">idea</option>
        </select>
        <Show when={selected()}>
          <div class="detail">
            <h3>{selected()!.id}</h3>
            <p>{selected()!.title}</p>
          </div>
        </Show>
      </aside>
      <main class="canvas-wrap">
        <Show when={loading()} fallback={null}>
          <div class="skeleton" />
        </Show>
        <Graph
          search={search()}
          prefix={prefix()}
          onSelect={setSelected}
          onReady={() => setLoading(false)}
        />
      </main>
    </div>
  );
}
