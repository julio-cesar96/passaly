// Entrada de desenvolvimento, com SMS falso: `pnpm dev` e `pnpm start:local`. Fora do build.
import { lerConfig } from '../config.js';
import { conectar } from '../db/cliente.js';
import { log } from '../log.js';
import { subirServidor } from '../servidor.js';
import { servirCaixaDeSms } from './caixa-de-sms.js';
import { montarPassalyLocal } from './montagem.js';

const PORTA_DA_CAIXA_DE_SMS = 3001;

const config = lerConfig();
const { db } = conectar(config.databaseUrl);
const { passaly, sms } = montarPassalyLocal(db, config);

// SERVIR_SPA=1: o build do SPA pelo mesmo Hono da produção, para conferir o CSP.
subirServidor(passaly, { ...config, servirSpa: process.env.SERVIR_SPA === '1' });
servirCaixaDeSms(sms, PORTA_DA_CAIXA_DE_SMS, () => {
  log.info(`SMS falso em http://127.0.0.1:${PORTA_DA_CAIXA_DE_SMS}`);
});
