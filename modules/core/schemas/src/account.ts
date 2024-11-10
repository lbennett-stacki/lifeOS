import { z } from 'zod';

export const accountSchema = z.object({
  id: z.string(),
  isEmailVerified: z.boolean(),
});

export const accountsSchema = z.array(accountSchema);

export type Account = z.infer<typeof accountSchema>;
