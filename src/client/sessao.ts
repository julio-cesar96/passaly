import { queryOptions } from '@tanstack/react-query';
import { api } from './api.js';

/** Quem volta da aba dos termos não pode perder o formulário: se o prazo venceu, o envio é que avisa. */
function foraDoCadastro(consulta: { state: { data?: unknown } }) {
  return (consulta.state.data as { estado?: string } | undefined)?.estado !== 'cadastro';
}

export const consultaDaSessao = queryOptions({
  queryKey: ['sessao'],
  queryFn: async () => {
    const resposta = await api.sessao.$get();
    if (!resposta.ok) throw new Error('Não foi possível consultar a sessão');
    return resposta.json();
  },
  staleTime: 60_000,
  refetchOnWindowFocus: foraDoCadastro,
  refetchOnReconnect: foraDoCadastro,
});

/** Revoga a sessão e o cadastro pela metade deste navegador. */
export async function sair(): Promise<void> {
  const resposta = await api.sessao.$delete();
  if (!resposta.ok) throw new Error('Não foi possível sair');
}
