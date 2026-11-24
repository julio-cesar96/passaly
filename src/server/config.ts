import { telefoneEmE164 } from '../compartilhado/telefone.js';

const URL_LOCAL = 'postgres://passaly:passaly@localhost:5432/passaly';

export type Config = ReturnType<typeof lerConfig>;

/** Lê a configuração do ambiente. Fora de produção, cai no Postgres do docker-compose.yml. */
export function lerConfig() {
  const producao = process.env.NODE_ENV === 'production';
  const databaseUrl = process.env.DATABASE_URL ?? (producao ? undefined : URL_LOCAL);
  if (!databaseUrl) throw new Error('DATABASE_URL não definida');

  const telefoneDoFundador = process.env.FUNDADOR_TELEFONE || undefined;
  // A mensagem não repete o valor: telefone nunca vai para log.
  if (telefoneDoFundador && !telefoneEmE164(telefoneDoFundador)) {
    throw new Error('FUNDADOR_TELEFONE precisa estar em E.164 (+55 seguido de DDD e número)');
  }
  return { databaseUrl, porta: Number(process.env.PORT ?? 3000), producao, telefoneDoFundador };
}
