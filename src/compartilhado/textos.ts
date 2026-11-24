/**
 * Textos que a pessoa vê e cuja versão o servidor grava como prova. Mudou o texto, muda a versão:
 * o histórico do git mostra o que cada versão dizia.
 */

/** Aviso mostrado antes do botão "Receber código". É a prova que a Twilio exige, não consentimento da LGPD. */
export const AVISO_DO_SMS = {
  versao: '2026-11-24',
  texto:
    'O Passaly vai mandar um SMS com um código para confirmar que este número é seu. Enviamos só quando você pede. Se não quiser receber, não peça o código.',
} as const;

export const AUTODECLARACAO = {
  versao: '2026-11-24',
  texto: 'Sou pessoa física, tenho 18 anos ou mais e uso para fins pessoais.',
} as const;

export type DocumentoLegal = {
  versao: string;
  titulo: string;
  secoes: readonly { titulo: string; paragrafos: readonly string[] }[];
};

/** Rascunho. O texto final é da #25. */
export const TERMOS_DE_USO: DocumentoLegal = {
  versao: 'rascunho-2026-11-24',
  titulo: 'Termos de uso',
  secoes: [
    {
      titulo: 'Quem pode usar',
      paragrafos: [
        'O Passaly é para pessoas físicas com 18 anos ou mais, para uso pessoal. Uso por empresa ou loja conta como Revenda.',
      ],
    },
    {
      titulo: 'O que pode oferecer',
      paragrafos: [
        'Por enquanto, só pacote de fralda descartável fechado e dentro da validade, para Doação ou Troca. Revenda é proibida.',
        'A foto mostra só o pacote, sem pessoas.',
      ],
    },
    {
      titulo: 'Estado e validade',
      paragrafos: [
        'O estado e a validade do pacote são declarados pelo Anunciante. O Passaly não confere o pacote. Confira antes de usar.',
      ],
    },
  ],
};

/** Rascunho. O texto final é da #25. */
export const POLITICA_DE_PRIVACIDADE: DocumentoLegal = {
  versao: 'rascunho-2026-11-24',
  titulo: 'Política de privacidade',
  secoes: [
    {
      titulo: 'O que guardamos',
      paragrafos: [
        'Seu celular, seu apelido e seu bairro, enquanto a conta existir.',
        'A cada código pedido: o celular, o instante e a versão do aviso mostrado na tela.',
        'No cadastro e em cada entrada com código: endereço IP, porta, data e hora.',
      ],
    },
    {
      titulo: 'O que não pedimos',
      paragrafos: [
        'Documento, CPF, data de nascimento, localização ou qualquer dado do seu filho.',
      ],
    },
    {
      titulo: 'Como parar de receber SMS',
      paragrafos: ['O SMS só sai quando você pede um código. Se não quiser receber, não peça.'],
    },
  ],
};
