import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';

export type Db = NodePgDatabase<typeof schema>;

export function conectar(url: string): { db: Db; fechar: () => Promise<void> } {
  const pool = new pg.Pool({ connectionString: url });
  return { db: drizzle(pool, { schema }), fechar: () => pool.end() };
}
