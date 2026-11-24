import { ehBairro } from '../../compartilhado/bairros.js';
import {
  AUTODECLARACAO,
  POLITICA_DE_PRIVACIDADE,
  TERMOS_DE_USO,
} from '../../compartilhado/textos.js';

export type Documento = 'termos' | 'politica' | 'autodeclaracao';

/** Versão que a pessoa viu ao marcar; null se não marcou. */
export type Aceites = Record<Documento, string | null>;

export type CamposRecusados = {
  apelido?: 'tamanho' | 'caracteres' | 'digitos';
  bairro?: 'fora-da-lista';
} & { [documento in Documento]?: 'falta' };

const VERSOES: Record<Documento, string> = {
  termos: TERMOS_DE_USO.versao,
  politica: POLITICA_DE_PRIVACIDADE.versao,
  autodeclaracao: AUTODECLARACAO.versao,
};
const DOCUMENTOS = Object.keys(VERSOES) as Documento[];

// Letra, número, espaço e ponto, hífen ou apóstrofo. Sem @, barra ou sinal de tag.
const APELIDO = /^[\p{L}\p{M}\p{N} .'’-]+$/u;
// Apelido não é canal de contato: 4 dígitos bastam para um ano, e telefone não cabe.
const MAXIMO_DE_DIGITOS = 4;

function recusarApelido(apelido: string): CamposRecusados['apelido'] {
  const tamanho = [...apelido].length;
  if (tamanho < 2 || tamanho > 30) return 'tamanho';
  if (!APELIDO.test(apelido) || !/\p{L}/u.test(apelido)) return 'caracteres';
  if ((apelido.match(/\p{N}/gu)?.length ?? 0) > MAXIMO_DE_DIGITOS) return 'digitos';
  return undefined;
}

export function validarCampos(entrada: { apelido: string; bairro: string; aceites: Aceites }) {
  const apelido = entrada.apelido.normalize('NFC').trim().replace(/\s+/g, ' ');
  const campos: CamposRecusados = {};

  const apelidoRecusado = recusarApelido(apelido);
  if (apelidoRecusado) campos.apelido = apelidoRecusado;
  if (!ehBairro(entrada.bairro)) campos.bairro = 'fora-da-lista';
  for (const documento of DOCUMENTOS) if (!entrada.aceites[documento]) campos[documento] = 'falta';
  if (Object.keys(campos).length > 0) {
    return { ok: false, motivo: 'campos-invalidos', campos } as const;
  }

  if (DOCUMENTOS.some((documento) => entrada.aceites[documento] !== VERSOES[documento])) {
    return { ok: false, motivo: 'textos-desatualizados' } as const;
  }
  const aceites = DOCUMENTOS.map((documento) => ({ documento, versao: VERSOES[documento] }));
  return { ok: true, apelido, bairro: entrada.bairro, aceites } as const;
}
