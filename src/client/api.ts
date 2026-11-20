import { hc } from 'hono/client';
import type { Api } from '../server/app.js';

/** Cliente tipado da API (ADR 0008). Só o tipo vem do servidor. */
export const api = hc<Api>('/').api;
