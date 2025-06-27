import { z } from 'zod';

export const searchSchema = z.object({
  search: z.string().trim().min(1).optional(),
});
