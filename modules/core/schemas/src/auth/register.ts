import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email must be a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .regex(/[a-z]/, 'Password must have at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must have at least one capital letter')
    .regex(/[0-9]/, 'Password must have at least one number')
    .regex(/[\W_]/, 'Password must have at least one symbol'),
});

export type Register = z.infer<typeof registerSchema>;
