import { criarPassaly } from '../casos-de-uso/passaly.js';
import type { Db } from '../db/cliente.js';
import { SmsFalso } from '../sms/sms-falso.js';
import { RelogioControlavel } from './relogio-controlavel.js';

// Números fictícios: nenhum telefone real em código ou commit.
export const TELEFONE = '+5521900000001';
export const OUTRO_TELEFONE = '+5521900000002';
export const TELEFONE_DO_FUNDADOR = '+5521900000099';

export const ORIGEM = { ip: '203.0.113.7', porta: 51234 };
export const AVISO = '2026-11-24';

const CADASTRO = {
  apelido: 'Ana da Ilha',
  bairro: 'Cocotá',
  aceites: {
    termos: 'rascunho-2026-11-24',
    politica: 'rascunho-2026-11-24',
    autodeclaracao: '2026-11-24',
  },
  origem: ORIGEM,
};

/** Campos válidos de um cadastro; cada teste troca só o que interessa. */
export const cadastroValido = (token: string) => ({ ...CADASTRO, token });

type Cadastro = typeof CADASTRO;

/** O Passaly com relógio controlável e SMS falso, pronto para um cenário. */
export function montarCenario(db: Db) {
  const relogio = new RelogioControlavel(new Date('2026-12-01T10:00:00-03:00'));
  const sms = new SmsFalso(relogio);
  const passaly = criarPassaly({
    db,
    relogio,
    verificador: sms,
    telefoneDoFundador: TELEFONE_DO_FUNDADOR,
  });

  /** O código do último SMS, como a pessoa leria no celular. */
  function codigoRecebido(telefone = TELEFONE): string {
    const ultimo = sms.enviados.findLast((enviado) => enviado.telefone === telefone);
    const codigo = ultimo?.texto.match(/\d{6}$/)?.[0];
    if (!codigo) throw new Error('nenhum SMS enviado');
    return codigo;
  }

  const pedirCodigo = (telefone = TELEFONE) =>
    passaly.solicitarCodigo({ telefone, avisoVersao: AVISO });

  const conferir = (codigo = codigoRecebido(), telefone = TELEFONE) =>
    passaly.conferirCodigo({ telefone, codigo, origem: ORIGEM });

  /** Confirma o telefone até o estado "verificado sem conta" e devolve o token dele. */
  async function verificarSemConta(telefone = TELEFONE): Promise<string> {
    await pedirCodigo(telefone);
    const conferencia = await conferir(codigoRecebido(telefone), telefone);
    if (!conferencia.ok || conferencia.tipo !== 'cadastro') throw new Error('esperava cadastro');
    return conferencia.token;
  }

  /** Cria a conta do começo ao fim e devolve o token da sessão. */
  async function cadastrar(telefone = TELEFONE, campos: Partial<Cadastro> = {}): Promise<string> {
    const resultado = await passaly.cadastrar({
      ...CADASTRO,
      ...campos,
      token: await verificarSemConta(telefone),
    });
    if (!resultado.ok) throw new Error(`cadastro recusado: ${resultado.motivo}`);
    return resultado.token;
  }

  return {
    relogio,
    sms,
    passaly,
    pedirCodigo,
    codigoRecebido,
    conferir,
    verificarSemConta,
    cadastrar,
  };
}

/** Um código de seis dígitos com certeza diferente do recebido. */
export function codigoErrado(certo: string): string {
  return certo === '000000' ? '111111' : '000000';
}
