import { z } from 'zod';

export const csrfSchema = z.object({
  token: z.string(),
});

export type Csrf = z.infer<typeof csrfSchema>;
