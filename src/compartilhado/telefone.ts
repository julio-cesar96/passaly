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

/**
 * Máscara para digitar e para mostrar: "21999999999" ou "+5521999999999" → "(21) 99999-9999". Número
 * de outro país, com 0 na frente ou comprido demais fica como está, para a pessoa ver o que digitou.
 */
export function mascararTelefone(texto: string): string {
  const digitos = texto.replace(/\D/g, '');
  const comPais = texto.trimStart().startsWith('+');
  const brasileiro = comPais
    ? /^55(\d{10,11})$/.exec(digitos)?.[1]
    : (/^(?:55|0)(\d{11})$/.exec(digitos)?.[1] ?? digitos);
  if (brasileiro === undefined) return `+${digitos}`;
  if (brasileiro.length > 11 || brasileiro.startsWith('0')) return brasileiro;

  const ddd = brasileiro.slice(0, 2);
  const numero = brasileiro.slice(2);
  if (!numero) return ddd && `(${ddd}`;
  const corte = numero.startsWith('9') || numero.length > 8 ? 5 : 4;
  const resto = numero.slice(corte);
  return `(${ddd}) ${numero.slice(0, corte)}${resto && `-${resto}`}`;
}
