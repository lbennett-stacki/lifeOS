import { defineConfig } from 'drizzle-kit';
import { config } from '@lifeos/health-workout-db';

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.url,
  },
});
