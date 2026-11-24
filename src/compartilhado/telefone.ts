/** E.164: "+", país sem zero à esquerda e até 15 dígitos no total. A recusa de não +55 é da #8. */
const E164 = /^\+[1-9]\d{7,14}$/;

export function telefoneEmE164(texto: string): boolean {
  return E164.test(texto);
}

/**
 * O que a pessoa digita vira E.164: "(21) 99999-9999" → "+5521999999999". Quem digita "+" informa o
 * país. Serve à tela; o servidor só aceita E.164 pronto.
 */
export function paraE164(digitado: string): string | null {
  const limpo = digitado.replace(/[\s().-]/g, '');
  const candidato = limpo.startsWith('+') ? limpo : `+55${limpo.replace(/^0/, '')}`;
  const nacionalCompleto = limpo.startsWith('+') || /^\+55\d{10,11}$/.test(candidato);
  return nacionalCompleto && telefoneEmE164(candidato) ? candidato : null;
}
