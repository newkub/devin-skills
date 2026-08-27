import { createSignal } from 'solid-js';
import GraphView from './components/GraphView';

export default function App() {
  const [query, setQuery] = createSignal('');
  const [filter, setFilter] = createSignal('all');

  return (
    <div class="h-screen w-screen flex flex-col bg-zinc-900 text-zinc-100">
      <header class="h-14 flex items-center justify-between px-4 border-b border-zinc-700">
        <h1 class="text-lg font-semibold">Repo Graph</h1>
        <div class="flex gap-3">
          <input
            class="px-3 py-1 rounded bg-zinc-800 border border-zinc-600"
            type="text"
            placeholder="Search node..."
            value={query()}
            onInput={(e) => setQuery(e.currentTarget.value)}
          />
          <select
            class="px-3 py-1 rounded bg-zinc-800 border border-zinc-600"
            value={filter()}
            onChange={(e) => setFilter(e.currentTarget.value)}
          >
            <option value="all">All</option>
            <option value="directory">Directory</option>
            <option value="file">File</option>
          </select>
        </div>
      </header>
      <main class="flex-1 overflow-hidden">
        <GraphView query={query()} filter={filter()} />
      </main>
    </div>
  );
}
