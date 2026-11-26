/** Bairros da Ilha do Governador aceitos na fase 1 (spec #2). Lista única: a tela mostra, o servidor valida. */
export const BAIRROS = [
  'Bancários',
  'Cacuia',
  'Cocotá',
  'Freguesia',
  'Galeão',
  'Jardim Carioca',
  'Jardim Guanabara',
  'Moneró',
  'Pitangueiras',
  'Portuguesa',
  'Praia da Bandeira',
  'Ribeira',
  'Tauá',
  'Zumbi',
] as const;

export type Bairro = (typeof BAIRROS)[number];

export function ehBairro(texto: string): texto is Bairro {
  return (BAIRROS as readonly string[]).includes(texto);
}
