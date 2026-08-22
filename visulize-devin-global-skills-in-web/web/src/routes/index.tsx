import { createSignal, Show } from "solid-js";
import { Graph, type SelectedNode } from "../Graph";

export function GraphPage() {
  const [search, setSearch] = createSignal("");
  const [prefix, setPrefix] = createSignal("all");
  const [selected, setSelected] = createSignal<SelectedNode | null>(null);
  const [loading, setLoading] = createSignal(true);
  const [counts, setCounts] = createSignal({ nodes: 0, edges: 0 });
  const [dark, setDark] = createSignal(true);
  const [physics, setPhysics] = createSignal(true);
  const [reset, setReset] = createSignal(0);
  const [focus, setFocus] = createSignal<string | null>(null);

  const doReset = () => setReset((v) => v + 1);
  const doFocus = () => { if (selected()) setFocus(selected()!.id); };

  return (
    <div class="app" classList={{ light: !dark() }}>
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
        <div class="controls">
          <button onClick={() => setDark((v) => !v)}>{dark() ? "light" : "dark"}</button>
          <button onClick={() => setPhysics((v) => !v)}>{physics() ? "stop physics" : "start physics"}</button>
          <button onClick={doReset}>reset zoom</button>
        </div>
        <Show when={selected()}>
          <div class="detail">
            <h3>{selected()!.id}</h3>
            <p class="desc">{selected()!.title}</p>
            <p class="meta">incoming {selected()!.incoming} · outgoing {selected()!.outgoing}</p>
            <div class="controls small">
              <button onClick={doFocus}>focus</button>
              <button onClick={() => setSelected(null)}>clear</button>
            </div>
          </div>
        </Show>
        <div class="status">{counts().nodes} nodes · {counts().edges} edges</div>
      </aside>
      <main class="canvas-wrap">
        <Show when={loading()}>
          <div class="skeleton" />
        </Show>
        <Graph
          search={search()}
          prefix={prefix()}
          dark={dark()}
          physics={physics()}
          reset={reset()}
          focus={focus()}
          onSelect={setSelected}
          onReady={(c) => { setLoading(false); setCounts(c); }}
        />
      </main>
    </div>
  );
}
