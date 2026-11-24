import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { consultaDaSessao, sair } from '../sessao.js';
import { Cadastro } from './cadastro.js';
import { Celular } from './celular.js';
import { Codigo } from './codigo.js';
import { telefonePendente } from './telefone-pendente.js';

/** Celular → código → sessão ou cadastro. Quem decide a etapa do cadastro é o servidor. */
export function Entrar() {
  const queryClient = useQueryClient();
  const navegar = useNavigate();
  const { data: sessao } = useSuspenseQuery(consultaDaSessao);
  const [telefone, setTelefone] = useState(() => telefonePendente.ler());
  const [aviso, setAviso] = useState<string | null>(null);

  async function atualizarSessao() {
    const nova = await queryClient.fetchQuery({ ...consultaDaSessao, staleTime: 0, retry: 2 });
    if (nova.estado === 'sessao') await navegar({ to: '/' });
  }

  function esquecerTelefone() {
    telefonePendente.apagar();
    setTelefone(null);
  }

  async function recomecar(motivo: string | null) {
    await sair();
    setAviso(motivo);
    await atualizarSessao();
  }

  if (sessao.estado === 'cadastro') {
    return <Cadastro aoCadastrar={atualizarSessao} aoRecomecar={recomecar} />;
  }
  if (telefone) {
    return (
      <Codigo
        telefone={telefone}
        aoConfirmar={async () => {
          await atualizarSessao();
          esquecerTelefone();
        }}
        aoTrocar={esquecerTelefone}
      />
    );
  }
  return (
    <Celular
      aviso={aviso}
      aoPedir={(novo) => {
        setAviso(null);
        telefonePendente.gravar(novo);
        setTelefone(novo);
      }}
    />
  );
}
