import { text, sqliteTable as table } from 'drizzle-orm/sqlite-core';

export const workouts = table('workouts', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
});
