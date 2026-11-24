import type { ChangeEvent } from 'react';
import { mascararTelefone } from '../../compartilhado/telefone.js';
import { Input } from '../ui/field.js';

const contarDigitos = (texto: string) => texto.replace(/\D/g, '').length;

/** Onde o cursor fica para ter `antes` dígitos à esquerda; `pular` passa dos separadores seguintes. */
function posicaoDoCursor(texto: string, antes: number, pular: boolean): number {
  let posicao = 0;
  for (let vistos = 0; vistos < antes && posicao < texto.length; posicao++) {
    if (/\d/.test(texto.charAt(posicao))) vistos++;
  }
  while (pular && /\D/.test(texto.charAt(posicao))) posicao++;
  return posicao;
}

/** Aplica a máscara mantendo o cursor no mesmo dígito, para corrigir um número no meio. */
function mascarar(evento: ChangeEvent<HTMLInputElement>): void {
  const campo = evento.currentTarget;
  const { value, selectionStart } = campo;
  const mascarado = mascararTelefone(value);
  if (mascarado === value) return;

  const cursor = selectionStart ?? value.length;
  const noFim = cursor === value.length;
  // Se o país ou o 0 saiu da frente, conta a partir do fim.
  const depois = contarDigitos(value.slice(cursor));
  const antes = Math.max(0, contarDigitos(mascarado) - depois);
  const { inputType } = evento.nativeEvent as InputEvent;
  campo.value = mascarado;
  if (document.activeElement !== campo) return;
  const posicao = noFim
    ? mascarado.length
    : posicaoDoCursor(mascarado, antes, inputType === 'deleteContentForward');
  campo.setSelectionRange(posicao, posicao);
}

export function CampoDoCelular() {
  return <Input type="tel" inputMode="tel" autoComplete="tel" onChange={mascarar} />;
}
