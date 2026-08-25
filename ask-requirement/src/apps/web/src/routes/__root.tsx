import { Outlet, createFileRoute } from "@tanstack/solid-router"
import { Suspense } from "solid-js"

export const Route = createFileRoute("/__root")({
  component: RootComponent,
})

function RootComponent() {
  return (
    <Suspense>
      <Outlet />
    </Suspense>
  )
}
