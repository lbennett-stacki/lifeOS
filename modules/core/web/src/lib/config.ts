import { z } from "zod";

const apiConfigSchema = z.object({
  baseUrl: z.string().url(),
});

export const api = apiConfigSchema.parse({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
});
