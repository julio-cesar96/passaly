import { sql } from 'drizzle-orm';
import { expect, it } from 'vitest';
import { conectar } from '../db/cliente.js';
import { urlDoBancoDeTestes, usarBancoDeTestes } from '../testes/banco.js';
import { montarCenario } from '../testes/cenario.js';

const db = usarBancoDeTestes();

it('quando o banco fecha a conexão ociosa, o próximo caso de uso conecta de novo (Neon suspende)', async () => {
  const { passaly, pedirCodigo, conferir } = montarCenario(db);
  await passaly.estadoDoTique();

  const outra = conectar(urlDoBancoDeTestes());
  const { rowCount } = await outra.db.execute(
    sql`select pg_terminate_backend(pid) from pg_stat_activity
        where datname = current_database() and pid <> pg_backend_pid()`,
  );
  await outra.fechar();
  expect(rowCount).toBeGreaterThan(0);
  await new Promise((resolver) => setTimeout(resolver, 100));

  expect(await pedirCodigo()).toEqual({ ok: true });
  expect(await conferir()).toMatchObject({ ok: true });
});
