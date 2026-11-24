import { Form } from '@base-ui/react/form';
import { useMutation } from '@tanstack/react-query';
import { type FormEvent, useState } from 'react';
import { paraE164 } from '../../compartilhado/telefone.js';
import { AVISO_DO_SMS } from '../../compartilhado/textos.js';
import { AvisoDeErro, SEM_CONEXAO, Tela } from '../tela.js';
import { Button } from '../ui/button.js';
import { Field, FieldDescription, FieldError, FieldLabel, Input } from '../ui/field.js';
import { pedirCodigo, textoDaRecusa } from './pedir-codigo.js';

const TELEFONE_INVALIDO = textoDaRecusa({ ok: false, motivo: 'telefone-invalido' });

export function Celular({
  aviso,
  aoPedir,
}: {
  aviso: string | null;
  aoPedir: (telefone: string) => void;
}) {
  const [erros, setErros] = useState<{ telefone?: string }>({});
  const [erroGeral, setErroGeral] = useState(aviso);
  const pedido = useMutation({ mutationFn: pedirCodigo });

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (pedido.isPending) return;
    setErroGeral(null);
    const telefone = paraE164(String(new FormData(evento.currentTarget).get('telefone') ?? ''));
    if (!telefone) return setErros({ telefone: TELEFONE_INVALIDO });
    pedido.mutate(telefone, {
      onSuccess: (resultado) => {
        if (resultado.ok) return aoPedir(telefone);
        const texto = textoDaRecusa(resultado);
        if (resultado.motivo === 'telefone-invalido') setErros({ telefone: texto });
        else setErroGeral(texto);
      },
      onError: () => setErroGeral(SEM_CONEXAO),
    });
  }

  return (
    <Tela titulo="Entrar com o celular">
      <AvisoDeErro>{erroGeral}</AvisoDeErro>
      <Form errors={erros} onSubmit={enviar} className="flex flex-col gap-6">
        <Field name="telefone">
          <FieldLabel>Celular</FieldLabel>
          <FieldDescription>Com DDD, como (21) 99999-9999.</FieldDescription>
          <Input type="tel" inputMode="tel" autoComplete="tel" />
          <FieldError role="alert" />
        </Field>
        <p>{AVISO_DO_SMS.texto}</p>
        <Button type="submit" disabled={pedido.isPending} focusableWhenDisabled>
          Receber código
        </Button>
      </Form>
    </Tela>
  );
}
