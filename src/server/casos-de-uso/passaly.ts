import { count, max } from 'drizzle-orm';
import type { Db } from '../db/cliente.js';
import { execucoesDoTique } from '../db/schema.js';
import type { Relogio } from '../relogio.js';
import type { Verificador } from '../sms/verificador.js';

export type Dependencias = { db: Db; relogio: Relogio; verificador: Verificador };

export type EstadoDoTique = { ultimaExecucao: Date | null; execucoes: number };

/** Interface de casos de uso do Passaly: o único ponto de teste da spec (#2). A API é um adaptador fino sobre ela. */
export function criarPassaly({ db, relogio }: Dependencias) {
  return {
    /**
     * "O relógio avançou (agora)" (ADR 0011). Idempotente: no mesmo instante, não muda nada.
     * A chave primária só cobre o registro da execução. As varreduras que chegarem (validade,
     * prazo de 24 h, retenção) precisam ser idempotentes por conta própria, porque um retry do
     * Scheduler chega em outro instante.
     */
    async relogioAvancou(): Promise<void> {
      await db.insert(execucoesDoTique).values({ instante: relogio.agora() }).onConflictDoNothing();
    },

    async estadoDoTique(): Promise<EstadoDoTique> {
      const [linha] = await db
        .select({ ultimaExecucao: max(execucoesDoTique.instante), execucoes: count() })
        .from(execucoesDoTique);
      return { ultimaExecucao: linha?.ultimaExecucao ?? null, execucoes: linha?.execucoes ?? 0 };
    },
  };
}

export type Passaly = ReturnType<typeof criarPassaly>;
