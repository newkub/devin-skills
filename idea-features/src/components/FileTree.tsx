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
      <span class="font-mono text-xs text-surface-foreground">{props.name}</span>
      <Show when={hasChildren()}>
        <ul class="ml-3 border-l border-border pl-2">
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
    <Show when={props.files?.length} fallback={<span class="text-sm text-muted-foreground">-</span>}>
      <ul class="rounded-xl border border-border bg-surface-elevated p-3">
        <For each={Object.keys(tree()).sort()}>
          {key => <TreeNodeView name={key} children={tree()[key]} />}
        </For>
      </ul>
    </Show>
  )
}
