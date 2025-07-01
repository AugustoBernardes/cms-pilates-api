import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().trim().min(1),
  phone: z.string().trim().min(1).optional().default(''),
  cpf: z.string().trim().optional().default(''),
  birth_date: z.string(),
  current_invoice_price: z.number().min(0),
});
