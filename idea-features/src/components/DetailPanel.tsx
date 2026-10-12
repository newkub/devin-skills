import { For, Show, type Accessor } from "solid-js";
import type { Idea } from "../types";

const ARTIFACTS = [
  ["Routes/Cmd", "routes"],
  ["Components", "comps"],
  ["Store", "store"],
  ["Schema", "schema"],
  ["Types", "types"],
  ["Fns/API", "fns"],
  ["Deps", "deps"],
  ["Pkgs", "pkgs"],
  ["Cfg", "cfg"],
  ["Tests", "tests"],
  ["Files", "files"],
] as const;

export function DetailPanel(p: {
  idea: Accessor<Idea | null>;
  onClose: () => void;
}) {
  return (
    <Show when={p.idea()}>
      {(idea) => (
        <aside class="detail">
          <div class="d-head">
            <div>
              <span class="no">#{idea().no}</span>
              <h2>{idea().title}</h2>
            </div>
            <button class="close" onClick={p.onClose}>×</button>
          </div>
          <div class="badges">
            <span class={`badge k-${idea().kind}`}>{idea().kind}</span>
            <span class="badge">{idea().group}</span>
            <span class={`badge p-${idea().phase}`}>{idea().phase}</span>
            <span class={`badge i-${idea().impact}`}>{idea().impact}</span>
            <span class="badge">effort {idea().effort}</span>
            <span class="badge mvp">mvp {idea().mvp}/10</span>
          </div>
          <div class="tags">
            <For each={idea().tags}>{(t) => <span class="tag">#{t}</span>}</For>
          </div>
          <section>
            <h3>Description</h3>
            <p>{idea().description}</p>
          </section>
          <section>
            <h3>Why</h3>
            <p>{idea().why}</p>
          </section>
          <section>
            <h3>Benefit</h3>
            <p>{idea().benefit}</p>
          </section>
          <section>
            <h3>Usage</h3>
            <p>{idea().usage}</p>
          </section>
          <section>
            <h3>Risk</h3>
            <p class="risk">{idea().risk}</p>
          </section>
          <section>
            <h3>Features</h3>
            <ul>
              <For each={idea().features}>{(f) => <li>{f}</li>}</For>
            </ul>
          </section>
          <section>
            <h3>Artifacts</h3>
            <table class="kv">
              <tbody>
                <For each={ARTIFACTS}>
                  {([label, key]) => (
                    <tr>
                      <td class="k">{label}</td>
                      <td>{idea()[key]}</td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </section>
        </aside>
      )}
    </Show>
  );
}
