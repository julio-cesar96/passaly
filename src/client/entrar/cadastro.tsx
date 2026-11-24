import { Form } from '@base-ui/react/form';
import { useMutation } from '@tanstack/react-query';
import { type FormEvent, useState } from 'react';
import { BAIRROS } from '../../compartilhado/bairros.js';
import {
  AUTODECLARACAO,
  POLITICA_DE_PRIVACIDADE,
  TERMOS_DE_USO,
} from '../../compartilhado/textos.js';
import { api } from '../api.js';
import { AvisoDeErro, SEM_CONEXAO, Tela } from '../tela.js';
import { Button } from '../ui/button.js';
import {
  CheckboxField,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
  NativeSelect,
} from '../ui/field.js';

const APELIDO = {
  tamanho: 'Use de 2 a 30 caracteres.',
  caracteres: 'Use só letras, números, espaço, ponto, hífen e apóstrofo.',
  digitos: 'Use no máximo 4 números. O apelido não é lugar para telefone.',
} as const;

type Campo = 'apelido' | 'bairro' | 'autodeclaracao' | 'aceite';

async function cadastrar(dados: FormData) {
  const marcado = (nome: Campo) => dados.get(nome) !== null;
  const resposta = await api.cadastro.$post({
    json: {
      apelido: String(dados.get('apelido') ?? ''),
      bairro: String(dados.get('bairro') ?? ''),
      aceites: {
        autodeclaracao: marcado('autodeclaracao') ? AUTODECLARACAO.versao : null,
        termos: marcado('aceite') ? TERMOS_DE_USO.versao : null,
        politica: marcado('aceite') ? POLITICA_DE_PRIVACIDADE.versao : null,
      },
    },
  });
  if (resposta.status !== 200 && resposta.status !== 422) throw new Error('cadastro não atendido');
  return resposta.json();
}

export function Cadastro({
  aoCadastrar,
  aoRecomecar,
}: {
  aoCadastrar: () => Promise<void>;
  /** Volta ao celular, com o motivo se não foi escolha da pessoa. */
  aoRecomecar: (motivo: string | null) => Promise<void>;
}) {
  const [erros, setErros] = useState<Partial<Record<Campo, string>>>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const cadastro = useMutation({ mutationFn: cadastrar });

  function recomecar(motivo: string | null) {
    aoRecomecar(motivo).catch(() => setErroGeral(SEM_CONEXAO));
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (cadastro.isPending) return;
    setErroGeral(null);
    cadastro.mutate(new FormData(evento.currentTarget), {
      onSuccess: (resultado) => {
        if (resultado.ok) {
          return aoCadastrar().catch(() => setErroGeral('Conta criada. Recarregue a página.'));
        }
        switch (resultado.motivo) {
          case 'campos-invalidos': {
            const { apelido, bairro, autodeclaracao, termos, politica } = resultado.campos;
            return setErros({
              ...(apelido && { apelido: APELIDO[apelido] }),
              ...(bairro && { bairro: 'Escolha seu bairro da Ilha.' }),
              ...(autodeclaracao && { autodeclaracao: 'Marque para criar a conta.' }),
              ...((termos || politica) && { aceite: 'Marque para criar a conta.' }),
            });
          }
          case 'textos-desatualizados':
            return setErroGeral('Os textos mudaram. Recarregue a página para ler a versão nova.');
          case 'telefone-nao-verificado':
            return recomecar('A confirmação do celular venceu. Peça outro código.');
          case 'conta-ja-existe':
            return recomecar('Este celular já tem conta. Entre com um código.');
        }
      },
      onError: () => setErroGeral(SEM_CONEXAO),
    });
  }

  return (
    <Tela titulo="Criar conta">
      <p>Celular confirmado. Preencha todos os campos em até 30 minutos para criar a conta.</p>
      <AvisoDeErro>{erroGeral}</AvisoDeErro>
      <Form errors={erros} onSubmit={enviar} className="flex flex-col gap-6">
        <Field name="apelido">
          <FieldLabel>Apelido</FieldLabel>
          <FieldDescription>
            É o que os outros veem. Não precisa ser seu nome completo.
          </FieldDescription>
          <Input autoComplete="nickname" />
          <FieldError />
        </Field>
        <Field name="bairro">
          <FieldLabel>Bairro da Ilha</FieldLabel>
          <NativeSelect defaultValue="" autoComplete="address-level3">
            <option value="">Escolha o bairro</option>
            {BAIRROS.map((bairro) => (
              <option key={bairro}>{bairro}</option>
            ))}
          </NativeSelect>
          <FieldError />
        </Field>
        <CheckboxField name="autodeclaracao">{AUTODECLARACAO.texto}</CheckboxField>
        <div className="flex flex-col">
          <LinkEmOutraAba href="/termos">Ler os termos de uso</LinkEmOutraAba>
          <LinkEmOutraAba href="/privacidade">Ler a política de privacidade</LinkEmOutraAba>
        </div>
        <CheckboxField name="aceite">
          Li e aceito os termos de uso e a política de privacidade.
        </CheckboxField>
        <Button type="submit" disabled={cadastro.isPending} focusableWhenDisabled>
          Criar conta
        </Button>
      </Form>
      <Button variant="ghost" onClick={() => recomecar(null)}>
        Usar outro celular
      </Button>
    </Tela>
  );
}

/** Em outra aba, para não perder o que já foi preenchido. */
function LinkEmOutraAba({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex min-h-alvo-toque items-center text-primary underline focus-visible:outline-2 focus-visible:outline-ring"
    >
      {children} (abre em outra aba)
    </a>
  );
}
