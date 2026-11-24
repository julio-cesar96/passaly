import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { criarApi } from './app.js';
import type { Passaly } from './casos-de-uso/passaly.js';
import { mandarCsp } from './csp.js';
import { log } from './log.js';
import { origemDoSocket } from './origem.js';

type Opcoes = { porta: number; producao: boolean; servirSpa: boolean };

export function subirServidor(passaly: Passaly, { porta, producao, servirSpa }: Opcoes): void {
  const app = new Hono()
    .use(mandarCsp)
    .route('/', criarApi(passaly, { producao, lerOrigem: origemDoSocket }));

  if (servirSpa) {
    // SPA estático (ADR 0008): arquivos do build e, para qualquer outra rota, o index.html.
    app.use('*', serveStatic({ root: './dist/client' }));
    app.get('*', serveStatic({ path: './dist/client/index.html' }));
  }

  serve({ fetch: app.fetch, port: porta }, (info) => {
    log.info('servidor no ar', { porta: info.port });
  });
}
