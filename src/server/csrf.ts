import { createMiddleware } from 'hono/factory';

const NAO_MUDA_ESTADO = new Set(['GET', 'HEAD', 'OPTIONS']);

function mesmaOrigem(secFetchSite: string | undefined, origin: string | undefined, host?: string) {
  if (secFetchSite !== undefined) return secFetchSite === 'same-origin';
  // Navegador sem Sec-Fetch-Site: compara o Origin, que a página atacante não controla.
  return !!origin && !!host && URL.canParse(origin) && new URL(origin).host === host;
}

/**
 * Toda rota que muda estado só aceita pedido da própria origem, além do SameSite=Lax do cookie. O
 * corpo tem que ser JSON, que outra origem não manda sem preflight (e não há CORS).
 */
export const barrarCsrf = createMiddleware(async (c, next) => {
  if (NAO_MUDA_ESTADO.has(c.req.method)) return next();
  const daMesmaOrigem = mesmaOrigem(
    c.req.header('sec-fetch-site'),
    c.req.header('origin'),
    c.req.header('host'),
  );
  if (!daMesmaOrigem) return c.json({ erro: 'Origem recusada' }, 403);
  const tipo = c.req.header('content-type');
  if (c.req.method !== 'DELETE' && !/^application\/json\b/i.test(tipo ?? '')) {
    return c.json({ erro: 'Corpo precisa ser JSON' }, 415);
  }
  return next();
});
