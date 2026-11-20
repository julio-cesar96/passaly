import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { criarApi } from './app.js';
import { lerConfig } from './config.js';
import { conectar } from './db/cliente.js';
import { log } from './log.js';
import { montarPassalyDeProducao } from './montagem.js';

const config = lerConfig();
const { db } = conectar(config.databaseUrl);
const passaly = montarPassalyDeProducao(db);

const app = new Hono().route('/', criarApi(passaly));

if (config.producao) {
  // SPA estático (ADR 0008): arquivos do build e, para qualquer outra rota, o index.html.
  app.use('*', serveStatic({ root: './dist/client' }));
  app.get('*', serveStatic({ path: './dist/client/index.html' }));
}

serve({ fetch: app.fetch, port: config.porta }, ({ port }) => {
  log.info('servidor no ar', { porta: port });
});
