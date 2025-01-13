import { accountSchema } from '@/account.js';
import { csrfSchema } from '@/auth/csrf.js';
import { z } from 'zod';

export const newSessionSchema = z.object({
  account: accountSchema,
  csrf: csrfSchema,
});

export type NewSession = z.infer<typeof newSessionSchema>;
