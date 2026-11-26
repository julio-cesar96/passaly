import { and, eq, gt, gte, lt, lte, sql } from 'drizzle-orm';
import { telefoneEmE164 } from '../../compartilhado/telefone.js';
import { AVISO_DO_SMS } from '../../compartilhado/textos.js';
import type { Db } from '../db/cliente.js';
import {
  aceites,
  acessos,
  contas,
  pedidosDeCodigo,
  sessoes,
  telefonesVerificados,
  verificacoesEmCurso,
} from '../db/schema.js';
import { log } from '../log.js';
import { criarToken, hashDoToken } from '../token.js';
import {
  type Aceites,
  type CamposRecusados,
  type Documento,
  validarCampos,
} from './campos-do-cadastro.js';
import type { Dependencias } from './passaly.js';

/** De onde veio a ação, para o log de acesso. Quem chama não tira isto de cabeçalho do cliente. */
export type Origem = { ip: string; porta: number };

export type ResultadoDoPedido =
  | { ok: true }
  | { ok: false; motivo: 'telefone-invalido' | 'aviso-desatualizado' | 'envio-falhou' }
  | { ok: false; motivo: 'aguarde'; minutos: number };

export type SessaoAberta = { token: string; expiraEm: Date };

export type ResultadoDaConferencia =
  | ({ ok: true; tipo: 'sessao' } & SessaoAberta)
  | { ok: true; tipo: 'cadastro'; token: string; expiraEm: Date }
  | { ok: false; motivo: 'codigo-recusado' };

export type ResultadoDoCadastro =
  | ({ ok: true } & SessaoAberta)
  | { ok: false; motivo: 'telefone-nao-verificado' | 'conta-ja-existe' | 'textos-desatualizados' }
  | { ok: false; motivo: 'campos-invalidos'; campos: CamposRecusados };

export type Conta = {
  id: string;
  apelido: string;
  bairro: string;
  papel: 'usuario' | 'fundador';
  aceites: { documento: Documento; versao: string; aceitoEm: Date }[];
};

/** `renovadaAte` vem preenchido quando este uso renovou o prazo: hora de mandar o cookie de novo. */
export type Sessao = { conta: Conta; renovadaAte: Date | null };

export type Acesso = { tipo: 'cadastro' | 'login'; ip: string; porta: number; em: Date };
export type Prova = { telefone: string; pedidoEm: Date; avisoVersao: string };
export type SemPermissao = { ok: false; motivo: 'sem-permissao' };

const MINUTO = 60_000;
/** Igual à Twilio Verify, e contado do primeiro envio: reenvio manda o mesmo código. */
const VALIDADE_DO_CODIGO = 10 * MINUTO;
const MAXIMO_DE_TENTATIVAS = 5;
const CODIGO = /^\d{6}$/;
const PRAZO_DO_CADASTRO = 30 * MINUTO;
const DIA = 24 * 60 * MINUTO;
const PRAZO_DA_SESSAO = 180 * DIA;

type NovaSessao = {
  contaId: string;
  tipo: 'cadastro' | 'login';
  origem: Origem;
  sessaoAnterior?: string | undefined;
};

function inicioMaisAntigoValido(agora: Date): Date {
  return new Date(agora.getTime() - VALIDADE_DO_CODIGO);
}

/** Telefone verificado, cadastro e sessão (spec #2, módulo 2; ADR 0010). */
export function criarIdentidade({ db, relogio, verificador, telefoneDoFundador }: Dependencias) {
  /** Quanto falta para poder pedir de novo, se as tentativas do código em curso acabaram. */
  async function esperaDoEsgotado(telefone: string, agora: Date): Promise<number> {
    const [janela] = await db
      .select()
      .from(verificacoesEmCurso)
      .where(
        and(
          eq(verificacoesEmCurso.telefone, telefone),
          gt(verificacoesEmCurso.iniciadaEm, inicioMaisAntigoValido(agora)),
          gte(verificacoesEmCurso.tentativas, MAXIMO_DE_TENTATIVAS),
        ),
      );
    return janela ? janela.iniciadaEm.getTime() + VALIDADE_DO_CODIGO - agora.getTime() : 0;
  }

  /**
   * Começa a janela do código ou mantém a que está em curso, num comando só. Chamada depois do envio:
   * se ele falha, nenhuma janela começa e nenhuma em curso se perde.
   */
  async function abrirJanela(telefone: string, agora: Date): Promise<void> {
    await db
      .insert(verificacoesEmCurso)
      .values({ telefone, iniciadaEm: agora, tentativas: 0 })
      .onConflictDoUpdate({
        target: verificacoesEmCurso.telefone,
        set: { iniciadaEm: agora, tentativas: 0 },
        setWhere: lte(verificacoesEmCurso.iniciadaEm, inicioMaisAntigoValido(agora)),
      });
  }

  /** Falso se não há código em curso ou se as tentativas acabaram. Incremento atômico. */
  async function gastarTentativa(telefone: string): Promise<boolean> {
    const gastas = await db
      .update(verificacoesEmCurso)
      .set({ tentativas: sql`${verificacoesEmCurso.tentativas} + 1` })
      .where(
        and(
          eq(verificacoesEmCurso.telefone, telefone),
          gt(verificacoesEmCurso.iniciadaEm, inicioMaisAntigoValido(relogio.agora())),
          lt(verificacoesEmCurso.tentativas, MAXIMO_DE_TENTATIVAS),
        ),
      )
      .returning({ tentativas: verificacoesEmCurso.tentativas });
    return gastas.length > 0;
  }

  /** O fornecedor não conferiu: a tentativa não conta. */
  async function devolverTentativa(telefone: string): Promise<void> {
    await db
      .update(verificacoesEmCurso)
      .set({ tentativas: sql`greatest(${verificacoesEmCurso.tentativas} - 1, 0)` })
      .where(eq(verificacoesEmCurso.telefone, telefone));
  }

  /** Abre a sessão e grava o acesso juntos: não há sessão sem log de acesso. */
  async function abrirSessao(
    tx: Pick<Db, 'insert' | 'delete'>,
    { contaId, tipo, origem, sessaoAnterior }: NovaSessao,
  ): Promise<SessaoAberta> {
    const agora = relogio.agora();
    const token = criarToken();
    const expiraEm = new Date(agora.getTime() + PRAZO_DA_SESSAO);
    if (sessaoAnterior) {
      await tx.delete(sessoes).where(eq(sessoes.tokenHash, hashDoToken(sessaoAnterior)));
    }
    await tx
      .insert(sessoes)
      .values({ tokenHash: hashDoToken(token), contaId, expiraEm, renovadaEm: agora });
    await tx
      .insert(acessos)
      .values({ contaId, tipo, ip: origem.ip, porta: origem.porta, em: agora });
    return { token, expiraEm };
  }

  /** Quem é o dono da sessão, ou null se ela não existe, venceu ou foi revogada. Renova o prazo. */
  async function consultarSessao(token: string): Promise<Sessao | null> {
    const agora = relogio.agora();
    const daSessao = eq(sessoes.tokenHash, hashDoToken(token));
    const [achada] = await db
      .select({ conta: contas, renovadaEm: sessoes.renovadaEm })
      .from(sessoes)
      .innerJoin(contas, eq(contas.id, sessoes.contaId))
      .where(and(daSessao, gt(sessoes.expiraEm, agora)));
    if (!achada) return null;

    let renovadaAte: Date | null = null;
    // Uma escrita por dia de uso basta para os 180 dias correrem do último uso.
    if (agora.getTime() - achada.renovadaEm.getTime() >= DIA) {
      renovadaAte = new Date(agora.getTime() + PRAZO_DA_SESSAO);
      await db.update(sessoes).set({ expiraEm: renovadaAte, renovadaEm: agora }).where(daSessao);
    }

    const { id, apelido, bairro, telefone } = achada.conta;
    const aceitesDaConta = await db
      .select({
        documento: aceites.documento,
        versao: aceites.versao,
        aceitoEm: aceites.aceitoEm,
      })
      .from(aceites)
      .where(eq(aceites.contaId, id))
      .orderBy(aceites.documento, aceites.aceitoEm);
    const papel = telefone === telefoneDoFundador ? 'fundador' : 'usuario';
    return { conta: { id, apelido, bairro, papel, aceites: aceitesDaConta }, renovadaAte };
  }

  async function ehFundador(token: string): Promise<boolean> {
    return (await consultarSessao(token))?.conta.papel === 'fundador';
  }

  return {
    async solicitarCodigo({
      telefone,
      avisoVersao,
    }: {
      telefone: string;
      avisoVersao: string;
    }): Promise<ResultadoDoPedido> {
      if (!telefoneEmE164(telefone)) return { ok: false, motivo: 'telefone-invalido' };
      if (avisoVersao !== AVISO_DO_SMS.versao) return { ok: false, motivo: 'aviso-desatualizado' };

      const agora = relogio.agora();
      const espera = await esperaDoEsgotado(telefone, agora);
      if (espera > 0) {
        return { ok: false, motivo: 'aguarde', minutos: Math.ceil(espera / MINUTO) };
      }

      // A prova é gravada antes do envio: nenhum SMS sai sem pedido registrado.
      await db.insert(pedidosDeCodigo).values({ telefone, pedidoEm: agora, avisoVersao });
      try {
        await verificador.enviarCodigo(telefone);
      } catch (erro) {
        log.error('falha ao enviar código', { erro });
        return { ok: false, motivo: 'envio-falhou' };
      }
      await abrirJanela(telefone, agora);
      return { ok: true };
    },

    async conferirCodigo({
      telefone,
      codigo,
      origem,
      sessaoAnterior,
    }: {
      telefone: string;
      codigo: string;
      origem: Origem;
      /** Sessão que este navegador já tinha, para não ficar viva sem dono. */
      sessaoAnterior?: string | undefined;
    }): Promise<ResultadoDaConferencia> {
      // Formato antes do limite: engano de digitação não gasta tentativa.
      const formatoValido = telefoneEmE164(telefone) && CODIGO.test(codigo);
      if (!formatoValido || !(await gastarTentativa(telefone))) {
        return { ok: false, motivo: 'codigo-recusado' };
      }
      const conferencia = await verificador
        .conferirCodigo(telefone, codigo)
        .catch(async (erro: unknown) => {
          await devolverTentativa(telefone);
          throw erro;
        });
      if (conferencia === 'recusado') return { ok: false, motivo: 'codigo-recusado' };
      await db.delete(verificacoesEmCurso).where(eq(verificacoesEmCurso.telefone, telefone));

      const [conta] = await db
        .select({ id: contas.id })
        .from(contas)
        .where(eq(contas.telefone, telefone));
      if (conta) {
        const sessao = await db.transaction((tx) =>
          abrirSessao(tx, { contaId: conta.id, tipo: 'login', origem, sessaoAnterior }),
        );
        return { ok: true, tipo: 'sessao', ...sessao };
      }

      const token = criarToken();
      const expiraEm = new Date(relogio.agora().getTime() + PRAZO_DO_CADASTRO);
      await db
        .insert(telefonesVerificados)
        .values({ tokenHash: hashDoToken(token), telefone, expiraEm });
      return { ok: true, tipo: 'cadastro', token, expiraEm };
    },

    /** Este navegador está no estado "verificado sem conta"? */
    async cadastroPendente(token: string): Promise<boolean> {
      const achados = await db
        .select({ expiraEm: telefonesVerificados.expiraEm })
        .from(telefonesVerificados)
        .where(
          and(
            eq(telefonesVerificados.tokenHash, hashDoToken(token)),
            gt(telefonesVerificados.expiraEm, relogio.agora()),
          ),
        );
      return achados.length > 0;
    },

    async cadastrar({
      token,
      origem,
      sessaoAnterior,
      ...entrada
    }: {
      token: string;
      apelido: string;
      bairro: string;
      aceites: Aceites;
      origem: Origem;
      sessaoAnterior?: string | undefined;
    }): Promise<ResultadoDoCadastro> {
      const campos = validarCampos(entrada);
      if (!campos.ok) return campos;

      return db.transaction(async (tx): Promise<ResultadoDoCadastro> => {
        const agora = relogio.agora();
        // Apagar já reserva a linha: o mesmo token não cadastra duas vezes, nem em paralelo.
        const [verificado] = await tx
          .delete(telefonesVerificados)
          .where(
            and(
              eq(telefonesVerificados.tokenHash, hashDoToken(token)),
              gt(telefonesVerificados.expiraEm, agora),
            ),
          )
          .returning({ telefone: telefonesVerificados.telefone });
        if (!verificado) return { ok: false, motivo: 'telefone-nao-verificado' };

        const { apelido, bairro } = campos;
        // O índice único decide quem chegou primeiro.
        const [conta] = await tx
          .insert(contas)
          .values({ telefone: verificado.telefone, apelido, bairro, criadaEm: agora })
          .onConflictDoNothing({ target: contas.telefone })
          .returning({ id: contas.id });
        if (!conta) return { ok: false, motivo: 'conta-ja-existe' };

        await tx
          .insert(aceites)
          .values(campos.aceites.map((a) => ({ ...a, contaId: conta.id, aceitoEm: agora })));
        const sessao = await abrirSessao(tx, {
          contaId: conta.id,
          tipo: 'cadastro',
          origem,
          sessaoAnterior,
        });
        return { ok: true, ...sessao };
      });
    },

    consultarSessao,

    /** Esquece o telefone verificado deste navegador, que não virou conta. */
    async desistirDoCadastro(token: string): Promise<void> {
      await db
        .delete(telefonesVerificados)
        .where(eq(telefonesVerificados.tokenHash, hashDoToken(token)));
    },

    /** Revoga a sessão no servidor. */
    async sair(token: string): Promise<void> {
      await db.delete(sessoes).where(eq(sessoes.tokenHash, hashDoToken(token)));
    },

    /** Log de acesso de uma conta, para o fundador atender ordem judicial. Sem rota HTTP por ora. */
    async acessosDaConta({
      sessaoDoFundador,
      contaId,
    }: {
      sessaoDoFundador: string;
      contaId: string;
    }): Promise<{ ok: true; acessos: Acesso[] } | SemPermissao> {
      if (!(await ehFundador(sessaoDoFundador))) return { ok: false, motivo: 'sem-permissao' };
      const lista = await db
        .select({ tipo: acessos.tipo, ip: acessos.ip, porta: acessos.porta, em: acessos.em })
        .from(acessos)
        .where(eq(acessos.contaId, contaId))
        .orderBy(acessos.em);
      return { ok: true, acessos: lista };
    },

    /** Pedidos de código de um telefone, para o fundador mostrar a prova à Twilio. Sem rota HTTP por ora. */
    async provasDePedido({
      sessaoDoFundador,
      telefone,
    }: {
      sessaoDoFundador: string;
      telefone: string;
    }): Promise<{ ok: true; provas: Prova[] } | SemPermissao> {
      if (!(await ehFundador(sessaoDoFundador))) return { ok: false, motivo: 'sem-permissao' };
      const provas = await db
        .select({
          telefone: pedidosDeCodigo.telefone,
          pedidoEm: pedidosDeCodigo.pedidoEm,
          avisoVersao: pedidosDeCodigo.avisoVersao,
        })
        .from(pedidosDeCodigo)
        .where(eq(pedidosDeCodigo.telefone, telefone))
        .orderBy(pedidosDeCodigo.pedidoEm);
      return { ok: true, provas };
    },
  };
}
