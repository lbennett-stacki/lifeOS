import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema/index.js';
import { config } from './config.js';

export type * from '@libsql/client';

export const drizzleClient = drizzle(config.url, { schema });
