import { sql } from 'drizzle-orm';
import { afterAll, beforeEach } from 'vitest';
import { conectar } from '../db/cliente.js';

export function urlDoBancoDeTestes(): string {
  return process.env.DATABASE_URL_TEST ?? 'postgres://passaly:passaly@localhost:5432/passaly_test';
}

/** Banco de testes (Postgres real), limpo antes de cada teste. */
export function usarBancoDeTestes() {
  const conexao = conectar(urlDoBancoDeTestes());

  beforeEach(async () => {
    const { rows } = await conexao.db.execute<{ tablename: string }>(
      sql`select tablename from pg_tables where schemaname = 'public'`,
    );
    if (rows.length === 0) return;
    const tabelas = rows.map((r) => `"${r.tablename}"`).join(', ');
    await conexao.db.execute(sql.raw(`truncate ${tabelas} restart identity cascade`));
  });

  afterAll(async () => {
    await conexao.fechar();
  });

  return conexao.db;
}
