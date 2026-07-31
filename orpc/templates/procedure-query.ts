// Template file - install dependencies first:
// bun add @orpc/server zod

import { orpc } from '@orpc/server';
import { z } from 'zod';

export const exampleQuery = orpc
  .procedure()
  .input(z.object({
    id: z.string()
  }))
  .output(z.object({
    id: z.string(),
    name: z.string()
  }))
  .query(async ({ input }) => {
    // Your query logic here
    return {
      id: input.id,
      name: 'Example'
    };
  });
