import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { api } from './api.js';
import { consultaDaSessao, sair } from './sessao.js';
import { AvisoDeErro, SEM_CONEXAO, Tela } from './tela.js';
import { Button } from './ui/button.js';

const formatoDataHora = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

/** Provisória: a lista de Posts e a landing vêm em outros tickets. */
export function Inicio() {
  const queryClient = useQueryClient();
  const navegar = useNavigate();
  const { data: sessao } = useSuspenseQuery(consultaDaSessao);
  const tique = useQuery({
    queryKey: ['tique'],
    queryFn: async () => {
      const resposta = await api.tique.$get();
      if (!resposta.ok) throw new Error('Não foi possível consultar o tique');
      return resposta.json();
    },
  });
  const saida = useMutation({
    mutationFn: sair,
    onSuccess: async () => {
      await queryClient.fetchQuery({ ...consultaDaSessao, staleTime: 0 });
      await navegar({ to: '/entrar' });
      queryClient.removeQueries({ queryKey: ['tique'] });
    },
  });

  if (sessao.estado !== 'sessao') return null;
  const { apelido, bairro, papel } = sessao.conta;
  return (
    <Tela titulo={`Olá, ${apelido}`}>
      <p>
        Você entrou. Bairro: {bairro}.{papel === 'fundador' && ' Conta do fundador.'}
      </p>
      <p>
        Último tique:{' '}
        {tique.isPending
          ? 'carregando…'
          : tique.isError
            ? 'não foi possível consultar'
            : tique.data.ultimaExecucao
              ? formatoDataHora.format(new Date(tique.data.ultimaExecucao))
              : 'ainda não rodou'}
      </p>
      <AvisoDeErro>{saida.isError && SEM_CONEXAO}</AvisoDeErro>
      <Button
        variant="outline"
        onClick={() => saida.mutate()}
        disabled={saida.isPending}
        focusableWhenDisabled
      >
        Sair
      </Button>
    </Tela>
  );
}
