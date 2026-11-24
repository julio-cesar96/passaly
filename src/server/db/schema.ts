import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

const instante = (nome: string) => timestamp(nome, { withTimezone: true, mode: 'date' });

/** Cada execução do caso de uso "o relógio avançou" (ADR 0011). O instante é a chave: repetir não duplica. */
export const execucoesDoTique = pgTable('execucoes_do_tique', {
  instante: instante('instante').primaryKey(),
});

/** Toda conta tem Telefone verificado. O papel de fundador não é coluna: vem da configuração. */
export const contas = pgTable(
  'contas',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    telefone: text('telefone').notNull().unique(),
    apelido: text('apelido').notNull(),
    bairro: text('bairro').notNull(),
    criadaEm: instante('criada_em').notNull(),
  },
  (t) => [check('contas_telefone_e164', sql`${t.telefone} ~ '^\\+[1-9][0-9]{7,14}$'`)],
);

/** Versão de cada documento aceito. Um aceite novo, com outra versão, não apaga o antigo. */
export const aceites = pgTable(
  'aceites',
  {
    contaId: uuid('conta_id')
      .notNull()
      .references(() => contas.id, { onDelete: 'cascade' }),
    documento: text('documento', { enum: ['termos', 'politica', 'autodeclaracao'] }).notNull(),
    versao: text('versao').notNull(),
    aceitoEm: instante('aceito_em').notNull(),
  },
  (t) => [primaryKey({ columns: [t.contaId, t.documento, t.versao] })],
);

/**
 * Prova de que a pessoa pediu o código, exigida pela Twilio. Não é consentimento da LGPD.
 * Sem FK: existe antes da conta. A eliminação por prazo é da #24.
 */
export const pedidosDeCodigo = pgTable(
  'pedidos_de_codigo',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    telefone: text('telefone').notNull(),
    pedidoEm: instante('pedido_em').notNull(),
    avisoVersao: text('aviso_versao').notNull(),
  },
  (t) => [index('pedidos_de_codigo_telefone_pedido_em').on(t.telefone, t.pedidoEm)],
);

/** Janela do código de um telefone e tentativas gastas nela. Some quando o código é aprovado; a vencida, na #24. */
export const verificacoesEmCurso = pgTable('verificacoes_em_curso', {
  telefone: text('telefone').primaryKey(),
  iniciadaEm: instante('iniciada_em').notNull(),
  tentativas: integer('tentativas').notNull(),
});

/**
 * "Telefone verificado sem conta": não é uma conta e vence logo. Só o hash do token do navegador.
 * Some ao criar a conta ou desistir; a vencida, na #24.
 */
export const telefonesVerificados = pgTable('telefones_verificados', {
  tokenHash: text('token_hash').primaryKey(),
  telefone: text('telefone').notNull(),
  expiraEm: instante('expira_em').notNull(),
});

/** Sessão longa. Revogar é apagar a linha. Só o hash do token. */
export const sessoes = pgTable(
  'sessoes',
  {
    tokenHash: text('token_hash').primaryKey(),
    contaId: uuid('conta_id')
      .notNull()
      .references(() => contas.id, { onDelete: 'cascade' }),
    expiraEm: instante('expira_em').notNull(),
    renovadaEm: instante('renovada_em').notNull(),
  },
  (t) => [index('sessoes_conta_id').on(t.contaId)],
);

/**
 * Log de acesso (spec #2): separado do log da aplicação e sem telefone. `conta_id` não tem FK de
 * propósito: excluir a conta não apaga o log, que vive 6 meses (#24).
 */
export const acessos = pgTable(
  'acessos',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    contaId: uuid('conta_id').notNull(),
    tipo: text('tipo', { enum: ['cadastro', 'login'] }).notNull(),
    ip: text('ip').notNull(),
    porta: integer('porta').notNull(),
    em: instante('em').notNull(),
  },
  (t) => [index('acessos_conta_id_em').on(t.contaId, t.em), index('acessos_em').on(t.em)],
);
