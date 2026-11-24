import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { html } from 'hono/html';
import type { SmsFalso } from '../sms/sms-falso.js';

/**
 * Onde ler o código em desenvolvimento, no lugar do celular. Só memória e só 127.0.0.1: nada no
 * terminal nem em arquivo. Do telefone, só os 4 últimos dígitos. Não existe no build de produção.
 */
export function servirCaixaDeSms(sms: SmsFalso, porta: number, pronta: () => void): void {
  const app = new Hono().get('/', (c) => {
    c.header('Cache-Control', 'no-store');
    const ultimos = sms.enviados.slice(-20).reverse();
    return c.html(html`<!doctype html>
      <html lang="pt-BR">
        <meta charset="UTF-8" />
        <meta http-equiv="refresh" content="3" />
        <title>SMS falso</title>
        <h1>SMS falso (só desenvolvimento)</h1>
        <ul>
          ${ultimos.map(({ telefone, texto }) => html`<li>final ${telefone.slice(-4)}: ${texto}</li>`)}
        </ul>
      </html>`);
  });
  serve({ fetch: app.fetch, port: porta, hostname: '127.0.0.1' }, pronta);
}
