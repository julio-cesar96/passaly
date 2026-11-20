import { pgTable, timestamp } from 'drizzle-orm/pg-core';

/** Cada execução do caso de uso "o relógio avançou" (ADR 0011). O instante é a chave: repetir não duplica. */
export const execucoesDoTique = pgTable('execucoes_do_tique', {
  instante: timestamp('instante', { withTimezone: true, mode: 'date' }).primaryKey(),
});
