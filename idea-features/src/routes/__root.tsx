import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/solid-router'
import type { JSX } from 'solid-js'
import 'virtual:uno.css'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [{ title: 'Idea Features' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    links: [{ rel: 'stylesheet', href: appCss }],
    scripts: [
      {
        children:
          "try{if(localStorage.getItem('iv-theme')==='light')document.documentElement.classList.add('light')}catch(e){}",
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootComponent,
})

function RootDocument(props: { children: JSX.Element }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {props.children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  return <Outlet />
}
