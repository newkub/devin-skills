import { createMemo } from 'solid-js'
import { marked, type Tokens, type RendererObject } from 'marked'
import hljs from 'highlight.js/lib/common'
import 'highlight.js/styles/github-dark.css'

const renderer: RendererObject = {
  code({ text, lang }: Tokens.Code) {
    const language = lang || 'plaintext'
    const valid = lang && hljs.getLanguage(lang)
    const html = valid ? hljs.highlight(text, { language: lang }).value : hljs.highlightAuto(text).value
    return `<pre class="hljs rounded-lg p-3 overflow-x-auto bg-slate-900"><code class="language-${language}">${html}</code></pre>`
  },
}

marked.use({ renderer })

interface MarkdownProps {
  content: string
  class?: string
}

export default function Markdown(props: MarkdownProps) {
  const html = createMemo(() => marked.parse(props.content || '') as string)
  return (
    <div
      class={`markdown-body leading-relaxed text-slate-700 dark:text-slate-300 ${props.class || ''}`}
      innerHTML={html()}
    />
  )
}
