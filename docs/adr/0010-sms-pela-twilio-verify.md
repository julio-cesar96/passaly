---
status: accepted
---

# SMS de verificação pela Twilio Verify, chamada só pelo servidor

O telefone verificado por SMS continua sendo a identidade do Passaly (ADRs 0004 e 0006), e o fornecedor é a Twilio Verify. O caso de uso **"solicitar código"** aplica primeiro os limites da spec: 3 por número por hora, 5 por dia, teto global de 30 por dia, só +55 e hash de banido. Só depois ele chama a API da Verify pelo servidor. O caso de uso **"conferir código"** consulta a Verify e, se der certo, cria a conta ou a sessão do Passaly. Nada roda no navegador além do nosso formulário. A Verify usa um pool de números gerenciado, sem remetente próprio. Como defesa extra, ela também tem limites de envio próprios, Fraud Guard e permissão só para o Brasil. Ver [pesquisa-stack.md](../descoberta/pesquisa-stack.md), seção 3.

## Considered Options

- **Google Identity Platform** (preferido pelo ADR 0007 e ~R$ 0 nesta escala): rejeitado pela complexidade. O SMS só sai do navegador, com reCAPTCHA. Os nossos limites exigiriam uma blocking function `beforeSmsSent` no Cloud Functions, e a lógica ficaria espalhada entre SDK, função e servidor. `localhost` não é aceito. Não se sabe se o envio continua quando o nosso endpoint cai, o que poderia furar os limites. Validar isso pedia um protótipo próprio.
- **Login com Google (OAuth) no lugar do telefone:** rejeitado. Criar outra conta Gmail contorna o Banimento, a identificação é mais fraca que o telefone e chegam dados que a spec não pede (nome, e-mail, foto).

## Consequences

- **Custo:** US$ 0,05 por verificação com sucesso + US$ 0,0599 por SMS, ~R$ 0,62 por login. Com ~40 verificações por mês, são ~R$ 25–40, dentro do teto porque a hospedagem fica perto de zero (ADR 0009). Sem mensalidade.
- **Ponto de teste:** o "SMS falso" dos testes é um dublê da interface do verificador ("enviar código", "conferir código").
- **Contrato:** a Twilio incorpora as cláusulas da ANPD só por referência. Isso foi aceito enquanto o advogado não responde as perguntas 11 e 12 (ver nota no ADR 0007).
- **Gatilhos para voltar ao Google:** o advogado recusar a incorporação por referência, ou o custo de SMS passar do teto. A troca fica restrita ao adaptador do verificador, porque os limites moram no nosso caso de uso.
- **Política de privacidade:** declara a Twilio (EUA) como operadora do SMS e o prazo de retenção dela. A retenção não está confirmada: o artigo de suporte deu 403.
- Antes de implementar o cadastro, um teste curto manda um código real pela Verify para o celular do fundador e confirma a entrega no Brasil pelo pool. O número não vai para código nem commit.
