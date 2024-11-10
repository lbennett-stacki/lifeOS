import { accountSchema } from '@/account';
import { csrfSchema } from '@/auth/csrf';
import { z } from 'zod';

export const newSessionSchema = z.object({
  account: accountSchema,
  csrf: csrfSchema,
});

export type NewSession = z.infer<typeof newSessionSchema>;
