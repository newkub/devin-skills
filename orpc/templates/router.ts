// Template file - install dependencies first:
// bun add @orpc/server zod

import { orpc } from '@orpc/server';
import { z } from 'zod';

export const appRouter = orpc.router({
  // Add your procedures here
  hello: orpc
    .procedure()
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return { message: `Hello ${input.name}!` };
    })
});

export type AppRouter = typeof appRouter;
