import { queryOptions } from '@tanstack/react-query';
import { api } from './api.js';

export const consultaDaSessao = queryOptions({
  queryKey: ['sessao'],
  queryFn: async () => {
    const resposta = await api.sessao.$get();
    if (!resposta.ok) throw new Error('Não foi possível consultar a sessão');
    return resposta.json();
  },
  staleTime: 60_000,
});

/** Revoga a sessão e o cadastro pela metade deste navegador. */
export async function sair(): Promise<void> {
  const resposta = await api.sessao.$delete();
  if (!resposta.ok) throw new Error('Não foi possível sair');
}
