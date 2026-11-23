import { createMiddleware } from 'hono/factory';

/**
 * Nada de terceiro no navegador (ADR 0013). O host do link assinado de foto entra em `img-src`
 * junto com a foto. Toda nova origem aqui é uma decisão, revista contra a política de privacidade.
 */
const CSP = ["default-src 'self'", "img-src 'self'", "connect-src 'self'"].join('; ');

export const mandarCsp = createMiddleware(async (c, next) => {
  await next();
  c.header('Content-Security-Policy', CSP);
});
