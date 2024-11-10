import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import { config } from './config';

export type * from '@libsql/client';

export const drizzleClient = drizzle(config.url, { schema });
