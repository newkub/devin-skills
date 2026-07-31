// Template file - install dependencies first:
// bun add @orpc/server zod

import { orpc } from '@orpc/server';
import { z } from 'zod';

export const exampleMutation = orpc
  .procedure()
  .input(z.object({
    name: z.string().min(1)
  }))
  .output(z.object({
    id: z.string(),
    name: z.string()
  }))
  .mutation(async ({ input }) => {
    // Your mutation logic here
    return {
      id: crypto.randomUUID(),
      name: input.name
    };
  });
