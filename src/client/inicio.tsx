import { useQuery } from '@tanstack/react-query';
import { api } from './api.js';

const formatoDataHora = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

export function Inicio() {
  const tique = useQuery({
    queryKey: ['tique'],
    queryFn: async () => {
      const resposta = await api.tique.$get();
      if (!resposta.ok) throw new Error('Não foi possível consultar o tique');
      return resposta.json();
    },
  });

  return (
    <main className="p-4">
      <h1 className="text-2xl font-semibold">Passaly</h1>
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
    </main>
  );
}
