import { Form } from '@base-ui/react/form';
import { useMutation } from '@tanstack/react-query';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { type FormEvent, useState } from 'react';
import { AVISO_DO_SMS } from '../../compartilhado/textos.js';
import { api } from '../api.js';
import { AvisoDeErro, SEM_CONEXAO, Tela } from '../tela.js';
import { Button } from '../ui/button.js';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field.js';
import { CampoDoCodigo } from './campo-do-codigo.js';
import { pedirCodigo, textoDaRecusa } from './pedir-codigo.js';
import { telefonePendente } from './telefone-pendente.js';

const CODIGO_RECUSADO = 'Código errado ou vencido. Confira o SMS ou peça outro.';

async function conferirCodigo(entrada: { telefone: string; codigo: string }) {
  const resposta = await api.codigo.conferir.$post({ json: entrada });
  if (resposta.status !== 200 && resposta.status !== 422) throw new Error('código não conferido');
  return resposta.json();
}

/** +5521999999999 → (21) 99999-9999, para a pessoa ver se errou o número. */
function formatar(telefone: string): string {
  return telefone.replace(/^\+55(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');
}

export function Codigo({
  telefone,
  aoConfirmar,
  aoTrocar,
}: {
  telefone: string;
  aoConfirmar: () => Promise<void>;
  aoTrocar: () => void;
}) {
  const [codigo, setCodigo] = useState('');
  const [erros, setErros] = useState<{ codigo?: string }>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [reenviado, setReenviado] = useState('');
  const conferencia = useMutation({ mutationFn: conferirCodigo });
  const reenvio = useMutation({ mutationFn: pedirCodigo });

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (conferencia.isPending) return;
    setErroGeral(null);
    if (codigo.length < 6) return setErros({ codigo: 'Digite os 6 números do SMS.' });
    conferencia.mutate(
      { telefone, codigo },
      {
        onSuccess: (resultado) => {
          if (!resultado.ok) return setErros({ codigo: CODIGO_RECUSADO });
          aoConfirmar().catch(() => setErroGeral('Código confirmado. Recarregue a página.'));
        },
        onError: () => setErroGeral(SEM_CONEXAO),
      },
    );
  }

  function pedirOutro() {
    setErroGeral(null);
    setReenviado('');
    reenvio.mutate(telefone, {
      onSuccess: (resultado) => {
        if (resultado.ok) {
          telefonePendente.gravar(telefone);
          setCodigo('');
          setReenviado('Pedido feito. O SMS deve chegar em instantes.');
        } else setErroGeral(textoDaRecusa(resultado));
      },
      onError: () => setErroGeral(SEM_CONEXAO),
    });
  }

  return (
    <Tela titulo="Digite o código" focarTitulo={false}>
      <AvisoDeErro>{erroGeral}</AvisoDeErro>
      <Form errors={erros} onSubmit={enviar} className="flex flex-col gap-6">
        <Field name="codigo">
          <FieldLabel>Código de 6 números</FieldLabel>
          <FieldDescription>
            Mandamos por SMS para {formatar(telefone)}. Vale por 10 minutos.
          </FieldDescription>
          <CampoDoCodigo value={codigo} onValueChange={setCodigo} pattern={REGEXP_ONLY_DIGITS} />
          <FieldError role="alert" />
        </Field>
        <Button type="submit" disabled={conferencia.isPending} focusableWhenDisabled>
          Confirmar código
        </Button>
      </Form>
      <section className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">{AVISO_DO_SMS.texto}</p>
        <Button
          variant="outline"
          onClick={pedirOutro}
          disabled={reenvio.isPending}
          focusableWhenDisabled
        >
          Pedir outro código
        </Button>
        <Button variant="ghost" onClick={aoTrocar}>
          Trocar o celular
        </Button>
        {/* Não é Toast: o texto fica na tela. A região existe desde o início; só o texto muda. */}
        <p role="status">{reenviado}</p>
      </section>
    </Tela>
  );
}
