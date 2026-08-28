import { For, Show } from 'solid-js'

interface TreeNode {
  [key: string]: TreeNode
}

function buildTree(paths: string[]): TreeNode {
  const root: TreeNode = {}
  for (const p of paths) {
    const parts = p.split('/')
    let node = root
    for (const part of parts) {
      if (!node[part]) node[part] = {}
      node = node[part]
    }
  }
  return root
}

function TreeNodeView(props: { name: string; children: TreeNode }) {
  const hasChildren = () => Object.keys(props.children).length > 0
  return (
    <li class="my-0.5">
      <span class="font-mono text-xs text-slate-700 dark:text-slate-200">{props.name}</span>
      <Show when={hasChildren()}>
        <ul class="ml-3 border-l border-slate-300 pl-2 dark:border-slate-600">
          <For each={Object.keys(props.children).sort()}>
            {key => <TreeNodeView name={key} children={props.children[key]} />}
          </For>
        </ul>
      </Show>
    </li>
  )
}

export default function FileTree(props: { files: string[] }) {
  const tree = () => buildTree(props.files)
  return (
    <Show when={props.files?.length} fallback={<span class="text-sm text-slate-500">-</span>}>
      <ul class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
        <For each={Object.keys(tree()).sort()}>
          {key => <TreeNodeView name={key} children={tree()[key]} />}
        </For>
      </ul>
    </Show>
  )
}
