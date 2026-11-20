const URL_LOCAL = 'postgres://passaly:passaly@localhost:5432/passaly';

/** Lê a configuração do ambiente. Fora de produção, cai no Postgres do docker-compose.yml. */
export function lerConfig() {
  const producao = process.env.NODE_ENV === 'production';
  const databaseUrl = process.env.DATABASE_URL ?? (producao ? undefined : URL_LOCAL);
  if (!databaseUrl) throw new Error('DATABASE_URL não definida');
  return { databaseUrl, porta: Number(process.env.PORT ?? 3000), producao };
}
