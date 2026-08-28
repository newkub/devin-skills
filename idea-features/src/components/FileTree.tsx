import { For } from 'solid-js'

function buildTree(paths: string[]) {
  const root: Record<string, any> = {}
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

function TreeNode(props: { name: string; children: Record<string, any> }) {
  const hasChildren = () => Object.keys(props.children).length > 0
  return (
    <li class="my-0.5">
      <span class="font-mono text-xs text-gray-800 dark:text-gray-200">{props.name}</span>
      <Show when={hasChildren()}>
        <ul class="ml-2 border-l border-gray-300 pl-2 dark:border-gray-600">
          <For each={Object.keys(props.children).sort()}>
            {key => <TreeNode name={key} children={props.children[key]} />}
          </For>
        </ul>
      </Show>
    </li>
  )
}

import { Show } from 'solid-js'

export default function FileTree(props: { files: string[] }) {
  const tree = () => buildTree(props.files)
  return (
    <Show when={props.files?.length} fallback={<span class="text-sm text-gray-500">-</span>}>
      <ul class="rounded border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-900">
        <For each={Object.keys(tree()).sort()}>
          {key => <TreeNode name={key} children={tree()[key]} />}
        </For>
      </ul>
    </Show>
  )
}
