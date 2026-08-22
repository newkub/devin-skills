// @refresh reload
import { hydrateStart, StartClient } from "@tanstack/solid-start/client"
import { hydrate } from "solid-js/web"
import "virtual:uno.css"

import { getRouter } from "./router"

hydrateStart(() => {
  hydrate(() => <StartClient router={getRouter()} />, document.getElementById("app")!)
})
