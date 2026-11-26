// Dispara "o relógio avançou (agora)" uma vez, à mão: `pnpm tique`.
// Em produção quem chama é o Cloud Scheduler, por endpoint com OIDC (#28).
import { lerConfig } from '../config.js';
import { conectar } from '../db/cliente.js';
import { log } from '../log.js';
import { montarPassalyLocal } from './montagem.js';

const config = lerConfig();
const { db, fechar } = conectar(config.databaseUrl);
try {
  const { passaly } = montarPassalyLocal(db, config);
  await passaly.relogioAvancou();
  const { ultimaExecucao } = await passaly.estadoDoTique();
  log.info('tique executado', { ultimaExecucao: ultimaExecucao?.toISOString() });
} finally {
  await fechar();
}
