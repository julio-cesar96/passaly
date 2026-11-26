/**
 * Logger do Passaly. Escreve JSON de uma linha no stdout, que o Cloud Run leva para o log da
 * plataforma (ADR 0008: sem monitoramento de terceiro).
 *
 * REGRA: TELEFONE NUNCA VAI PARA LOG (AGENTS.md, ADR 0008, LGPD).
 * - Não passe telefone, código de SMS ou corpo de requisição para o logger. Logue ids internos.
 * - Como rede de segurança, campos com nome de telefone/código são trocados por "[removido]" e
 *   qualquer sequência que pareça número de telefone vira "[telefone removido]".
 * - De um erro vão nome, mensagem e código: o Drizzle põe os parâmetros da consulta (telefone, token,
 *   apelido) na mensagem, e eles são cortados. Seis dígitos soltos viram "[código removido]".
 * - Log de requisição registra só método, caminho (sem query string) e status.
 */

type Nivel = 'info' | 'warn' | 'error';
type Campos = Record<string, unknown>;

const CAMPO_PROIBIDO = /telefone|phone|celular|^codigo$|^code$|^to$/i;
// Trecho de dígitos com espaço, ponto, hífen ou parêntese: +55 (21) 99999-9999, 21999999999 etc.
const TRECHO_NUMERICO = /\+?\d[\d\s().-]*\d/g;
// Telefone brasileiro tem de 10 a 13 dígitos; datas como 2026-11-20 têm 8 e passam.
const MINIMO_DE_DIGITOS_DE_TELEFONE = 10;

function semTelefone(texto: string): string {
  return texto.replace(TRECHO_NUMERICO, (trecho) =>
    trecho.replace(/\D/g, '').length >= MINIMO_DE_DIGITOS_DE_TELEFONE
      ? '[telefone removido]'
      : trecho,
  );
}

const CODIGO_DE_SMS = /(?<!\d)\d{6}(?!\d)/g;

function limparErro(erro: Error, profundidade: number): Campos {
  const [mensagem = ''] = erro.message.split('\nparams:');
  const codigo = (erro as { code?: unknown }).code;
  return {
    nome: erro.name,
    mensagem: semTelefone(mensagem).replace(CODIGO_DE_SMS, '[código removido]'),
    ...(typeof codigo === 'string' ? { codigoDoErro: codigo } : {}),
    ...(erro.cause instanceof Error && profundidade < 4
      ? { causa: limparErro(erro.cause, profundidade + 1) }
      : {}),
  };
}

function limpar(valor: unknown, profundidade = 0): unknown {
  if (typeof valor === 'string') return semTelefone(valor);
  if (valor instanceof Error) return limparErro(valor, profundidade);
  if (profundidade > 4 || valor === null || typeof valor !== 'object') return valor;
  if (Array.isArray(valor)) return valor.map((v) => limpar(v, profundidade + 1));
  return Object.fromEntries(
    Object.entries(valor).map(([chave, v]) => [
      chave,
      CAMPO_PROIBIDO.test(chave) ? '[removido]' : limpar(v, profundidade + 1),
    ]),
  );
}

function escrever(nivel: Nivel, mensagem: string, campos: Campos = {}): void {
  const linha = JSON.stringify({
    severity: nivel.toUpperCase(),
    time: new Date().toISOString(),
    message: limpar(mensagem),
    ...(limpar(campos) as Campos),
  });
  (nivel === 'error' ? process.stderr : process.stdout).write(`${linha}\n`);
}

export const log = {
  info: (mensagem: string, campos?: Campos) => escrever('info', mensagem, campos),
  warn: (mensagem: string, campos?: Campos) => escrever('warn', mensagem, campos),
  error: (mensagem: string, campos?: Campos) => escrever('error', mensagem, campos),
};
