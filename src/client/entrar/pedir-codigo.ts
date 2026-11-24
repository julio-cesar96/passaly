import { AVISO_DO_SMS } from '../../compartilhado/textos.js';
import { api } from '../api.js';

/** Pede o código mandando a versão do aviso que está na tela. */
export async function pedirCodigo(telefone: string) {
  const resposta = await api.codigo.$post({
    json: { telefone, avisoVersao: AVISO_DO_SMS.versao },
  });
  if (resposta.status !== 200 && resposta.status !== 422) throw new Error('pedido não atendido');
  return resposta.json();
}

type Recusa = Exclude<Awaited<ReturnType<typeof pedirCodigo>>, { ok: true }>;

export function textoDaRecusa(recusa: Recusa): string {
  switch (recusa.motivo) {
    case 'telefone-invalido':
      return 'Confira o número. Use o DDD e o celular, como (21) 99999-9999.';
    case 'aguarde': {
      const { minutos } = recusa;
      return `Muitas tentativas. Peça outro código em ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}.`;
    }
    case 'envio-falhou':
      return 'Não conseguimos mandar o SMS. Tente de novo em alguns minutos.';
    case 'aviso-desatualizado':
      return 'O aviso desta tela mudou. Recarregue a página para ler a versão nova.';
  }
}
