import { sqliteTable as table, text } from 'drizzle-orm/sqlite-core';

export const sessions = table('sessions', {
  sid: text('sid').primaryKey(),
});
