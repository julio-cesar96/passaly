---
status: accepted
---

# SMS só de fornecedor com mecanismo de transferência documentado

O fornecedor de SMS de verificação só entra se tiver mecanismo de transferência internacional documentado: as cláusulas-padrão da ANPD (Res. CD/ANPD 19/2024) no contrato, ou confirmação por escrito de que processa e guarda os dados no Brasil, inclusive nos suboperadores. Ser brasileiro não basta. O ADR 0005 aceitava "fornecedor brasileiro" como alternativa às cláusulas, mas a pesquisa mostrou que nenhum dos brasileiros pesquisados (Comtele, Zenvia, Mobizon) diz onde processa, e Comtele e Zenvia admitem servidor ou transferência ao exterior sem nomear o mecanismo. Ver [pesquisa-sms-otp.md](../descoberta/pesquisa-sms-otp.md), seções 1 e 3.7 a 3.9.

## Considered Options

- Aceitar qualquer fornecedor brasileiro (premissa original do ADR 0005): rejeitada, porque os textos publicados não garantem que não haja transferência.
- OTP por WhatsApp (Cloud API, R$ 0,035 por mensagem): rejeitada no protótipo. A Meta traz as cláusulas da ANPD, mas usa dados de uso para fins próprios (vai contra o "estrangeiro no mínimo" do ADR 0005), não está claro se aceita uso sem CNPJ e deixa de fora quem não tem WhatsApp. A economia é de R$ 5 a R$ 20 por mês. Gatilho para reabrir: custo de SMS relevante.

## Consequences

- Hoje cumprem a regra, pelo contrato publicado: Google (Identity Platform/Firebase) e Twilio. AWS e Sinch (só cláusulas da UE) ficam fora.
- Enquanto o advogado não responder (perguntas 11 e 12 da seção 13 da [pesquisa de LGPD](../descoberta/pesquisa-lgpd.md)), prefere-se quem publica as cláusulas por inteiro e diz "sem alteração" (Google) a quem só as incorpora por referência (Twilio).
- O Passaly aceita ser **Parte Designada** nas cláusulas: publica o documento de transparência da Cláusula 14 na mesma página do art. 17, §2º, atende o titular em 15 dias e comunica incidente à ANPD em 3 dias úteis.
- O prazo de retenção do fornecedor (ex.: até 180 dias após a exclusão, no Google) é declarado na política de privacidade como prazo do operador. Entre fornecedores equivalentes, prefere-se o de retenção menor ou configurável.
- Fornecedor brasileiro só volta à mesa se Google e Twilio forem descartados na escolha da stack; aí se pede a confirmação por escrito.
- **Nota (2026-11-19):** na escolha da stack, a preferência pelo Google foi vencida pela complexidade de integração, e o fornecedor escolhido é a Twilio Verify ([ADR 0010](0010-sms-pela-twilio-verify.md)). Aceita-se a incorporação das cláusulas por referência enquanto o advogado não responde. Se a resposta for não, volta-se ao Google.
