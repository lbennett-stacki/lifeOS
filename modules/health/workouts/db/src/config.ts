import { configSchema } from '@lifeos/db';

export const config = configSchema.parse({
  url: process.env.HEALTH_WORKOUTS_DATABASE_URL,
});
