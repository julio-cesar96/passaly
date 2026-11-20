// Dispara "o relógio avançou (agora)" uma vez, à mão: `pnpm tique`.
// Em produção quem chama é o Cloud Scheduler, por endpoint com OIDC (#28).
import { lerConfig } from './config.js';
import { conectar } from './db/cliente.js';
import { log } from './log.js';
import { montarPassalyDeProducao } from './montagem.js';

const { db, fechar } = conectar(lerConfig().databaseUrl);
try {
  const passaly = montarPassalyDeProducao(db);
  await passaly.relogioAvancou();
  const { ultimaExecucao } = await passaly.estadoDoTique();
  log.info('tique executado', { ultimaExecucao: ultimaExecucao?.toISOString() });
} finally {
  await fechar();
}
