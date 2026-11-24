import { getConnInfo } from '@hono/node-server/conninfo';
import type { Context } from 'hono';
import type { Origem } from './casos-de-uso/identidade.js';

/**
 * IP e porta da conexão, nunca de cabeçalho: o cliente escreve o que quiser em X-Forwarded-For.
 * Atrás do proxy do Cloud Run isto é o endereço do proxy; obter o do usuário é da #27.
 */
export function origemDoSocket(c: Context): Origem {
  const { address, port } = getConnInfo(c).remote;
  if (!address || !port) throw new Error('conexão sem endereço de origem');
  return { ip: address.replace(/^::ffff:(?=\d+\.)/, ''), porta: port };
}
