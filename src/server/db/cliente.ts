import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { log } from '../log.js';
import * as schema from './schema.js';

export type Db = NodePgDatabase<typeof schema>;

export function conectar(url: string): { db: Db; fechar: () => Promise<void> } {
  const pool = new pg.Pool({ connectionString: url });
  // Sem quem ouça 'error', uma conexão fechada pelo banco derruba o processo. O Neon suspende por
  // inatividade, então é rotina: registra, e o pool abre outra no próximo uso. O ouvinte fica em cada
  // conexão porque o do pool só cobre a ociosa; parada no meio de uma transação também conta.
  pool.on('connect', (conexao) => {
    conexao.on('error', (erro) => log.warn('conexão com o banco perdida', { erro }));
  });
  pool.on('error', () => {});
  return { db: drizzle(pool, { schema }), fechar: () => pool.end() };
}
