import { z } from 'zod';

export const updateInvoiceSchema = z.object({
  status: z.enum(['open', 'paid']),
});
