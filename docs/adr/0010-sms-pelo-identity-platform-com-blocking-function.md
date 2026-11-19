---
status: accepted
---

# SMS pelo Google Identity Platform, com os limites do Passaly numa blocking function

O fornecedor de SMS é o Google Identity Platform, preferido pelo ADR 0007 e com custo de ~R$ 0 nesta escala (US$ 0,02/SMS, 10 grátis por dia). Ele não deixa o servidor disparar o SMS: o envio sai do navegador pelo SDK do Firebase, com reCAPTCHA obrigatório. Por isso, os limites da spec (3 por número por hora, 5 por dia, teto global de 30 por dia, só +55, hash de banido) ficam num caso de uso do Passaly, **"autorizar envio de código"**. A blocking function `beforeSmsSent` (Cloud Functions em `southamerica-east1`) é só um adaptador que chama esse caso de uso e devolve `BLOCK` quando ele recusa. A política de regiões de SMS libera só o Brasil. Depois da verificação, o servidor confere o ID token, cria a sessão do Passaly e apaga o usuário no Firebase. Ver [pesquisa-stack.md](../descoberta/pesquisa-stack.md), seção A.

**Condição:** antes da implementação, um protótipo descartável confirma três coisas:

1. o `BLOCK` impede o envio sem o "SMS defense" ligado;
2. a função alcança o endpoint do Passaly;
3. o ID token traz `phone_number`.

Se algum dos três falhar, vale o plano B.

## Considered Options

- **Twilio Verify** (plano B): envio pelo servidor e limites nativos, mas ~R$ 0,62 por login (~R$ 37/mês em ~60 logins), o que quase estoura o teto sozinho. Incorpora as cláusulas da ANPD só por referência (ADR 0007).
- **Aplicar os limites só antes de o cliente chamar o Firebase:** rejeitado, porque um cliente adulterado chama o Firebase direto e fura o limite.

## Consequences

- O ponto de teste continua único. O "SMS falso" dos testes é o caso de uso "autorizar envio de código" mais um verificador de token falso.
- A política de privacidade declara o reCAPTCHA (dados do navegador ao Google, como operador sob o CDPA), o telefone e o IP processados nos EUA, e a retenção do Google (IP por algumas semanas; até 180 dias de backup após apagar o usuário).
- O upgrade para Identity Platform e o plano Blaze são obrigatórios (o Spark não envia SMS), sem mensalidade.
- `localhost` não é aceito para login por telefone. O desenvolvimento usa os números de teste do Firebase (até 10).
- Apagar o usuário no Firebase gera `uid` novo a cada login. A conta do Passaly é identificada pelo telefone verificado, não pelo `uid`.
