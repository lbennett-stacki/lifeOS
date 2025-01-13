import { text, sqliteTable as table, integer } from 'drizzle-orm/sqlite-core';

export const accounts = table('accounts', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  isEmailVerified: integer('is_email_verified', { mode: 'boolean' }).default(
    false,
  ),
});
