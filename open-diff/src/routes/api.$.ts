import { createFileRoute } from '@tanstack/solid-router';
import { handleApi } from '../server/api';

export const Route = createFileRoute('/api/$')({
  server: {
    handlers: {
      GET: ({ request }) => handleApi(request),
      POST: ({ request }) => handleApi(request),
    },
  },
});
