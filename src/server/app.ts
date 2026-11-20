import { Hono } from 'hono';
import type { Passaly } from './casos-de-uso/passaly.js';
import { log } from './log.js';

/** API: adaptador fino sobre a interface de casos de uso (ADR 0008). */
export function criarApi(passaly: Passaly) {
  return new Hono()
    .basePath('/api')
    .use(async (c, next) => {
      const inicio = performance.now();
      await next();
      // Só método, caminho sem query string e status: nada de dado pessoal no log.
      log.info('requisição', {
        metodo: c.req.method,
        caminho: c.req.path,
        status: c.res.status,
        ms: Math.round(performance.now() - inicio),
      });
    })
    .onError((erro, c) => {
      log.error('erro na API', { caminho: c.req.path, erro });
      return c.json({ erro: 'Erro interno' }, 500);
    })
    .get('/tique', async (c) => {
      const { ultimaExecucao } = await passaly.estadoDoTique();
      return c.json({ ultimaExecucao: ultimaExecucao?.toISOString() ?? null });
    });
}

export type Api = ReturnType<typeof criarApi>;
