import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/solid-start/server"

const fetch = createStartHandler(defaultStreamHandler)

export default { fetch }
