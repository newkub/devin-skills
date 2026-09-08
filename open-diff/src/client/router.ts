import { createRouter, createRootRoute } from '@tanstack/solid-router';
import App from './App';

const rootRoute = createRootRoute({
  component: App,
});

const routeTree = rootRoute.addChildren([]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

declare module '@tanstack/solid-router' {
  interface Register {
    router: typeof router;
  }
}
