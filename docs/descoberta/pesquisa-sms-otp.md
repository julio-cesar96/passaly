# Pesquisa: fornecedores de SMS para verificar telefone (OTP) no Brasil, cláusulas-padrão da ANPD e alternativas

> **Aviso: isto não é parecer jurídico nem escolha de fornecedor.** É um levantamento de fontes da fase de descoberta para alimentar o grill e a escolha da stack. Nada aqui decide fornecedor. A leitura de DPA é minha leitura do texto publicado, não uma análise contratual.

- Data da pesquisa / acesso às fontes: 2026-11-12
- Pergunta: quais fornecedores podem mandar o código de verificação por SMS para números brasileiros, quanto custam, se o DPA traz as cláusulas-padrão da ANPD (Res. CD/ANPD 19/2024) sem alteração, onde processam e por quanto tempo guardam telefone e conteúdo da mensagem? E que alternativas mais baratas mantêm o "telefone verificado"?
- Contexto: ADR 0005 e "Hospedagem e serviços" em [contexto-descoberta.md](contexto-descoberta.md). O SMS é o único serviço que pode ser estrangeiro, e só com as cláusulas-padrão da ANPD (senão, fornecedor brasileiro). O SMS sai só no cadastro e no login em aparelho novo. O telefone verificado sustenta a identificação (ADR 0004) e o Banimento.
- Método: preços lidos nas páginas oficiais de cada fornecedor ou nos arquivos de preço que elas publicam (CSV/XLSX). DPAs lidos no site do fornecedor. A tabela de preço do WhatsApp veio dos arquivos de tarifa linkados pela documentação da Meta. O câmbio é a PTAX do Banco Central.
- Algumas páginas recusaram acesso automatizado (HTTP 403): **Vonage** (preço e DPA), **Infobip** (preço e DPA) e o artigo de retenção do suporte da Twilio. Não contornei o bloqueio. O que aparece sobre esses fornecedores veio do **trecho indexado pelo buscador**, marcado como **[índice de busca]**, com confiança baixa.
- Legenda: **Alta** (li o texto primário), **Média** (primário parcial), **Baixa** (só índice de busca ou secundária), **Não confirmado**. Conclusões minhas aparecem como **(inferência)**.

> **Preços que mudam** (sinalizados ao longo do texto):
> - Os preços em USD/EUR dependem do câmbio. Usei a **PTAX de venda de 12/11/2026, R$ 5,6143** [B1]. IOF e spread do cartão não estão incluídos.
> - O **WhatsApp** cobra **por mensagem desde 1º/07/2025** (antes era por conversa). A Meta só muda tarifas em 1º/jan, 1º/abr, 1º/jul e 1º/out. A tabela usada aqui vale **desde 1º/10/2026** [M1][M2].
> - Desde julho de 2026 a Meta fatura em **BRL** para contas do Brasil. Contas que não estiverem em BRL param de receber mensagens a partir de **1º/07/2027** [M1].

## 1. Resumo

1. **Cláusulas-padrão da ANPD no DPA publicado**, entre os estrangeiros pesquisados:
   - **Incorporam o texto da ANPD**: Twilio (DPA, Schedule 3, §2.7) [T3], Google Cloud (CDPA, que cobre Firebase Authentication/Identity Platform) [G2][G3][G5] e WhatsApp/Meta (Global Data Transfer Addendum, §7) [M4].
   - **Só cláusulas da UE**: AWS (DPA) [A3], Sinch (DPA v8) [S2] e Supabase (DPA v1) [P2].
   - **Não li o DPA**: Vonage e Infobip (403).
2. **"Sem alteração"**: Google e WhatsApp dizem expressamente que nada no contrato modifica as cláusulas. O Google publica o texto inteiro, com as opções preenchidas. A Twilio incorpora por referência e preenche as opções, mas não traz a frase "sem alteração" para as cláusulas brasileiras. **Se isso basta para o art. 16 da Res. 19/2024 é pergunta para advogado.**
3. **Nos três que oferecem as cláusulas, o Passaly fica como "Parte Designada"** (Google: Opção A com o exportador marcado [G5]; WhatsApp: Opção A, "you shall be the Designated Party" [M4]; Twilio: o cliente, salvo quando a Twilio é controladora [T3]). Na prática o Passaly publica o documento de transparência (Cláusula 14), atende o titular (Cláusula 15) e comunica incidente à ANPD em 3 dias úteis (Cláusula 16) [G5]. **(inferência)**
4. **Preço por SMS para o Brasil** (lista pública):
   - Google Identity Platform: US$ 0,02, com 10 SMS/dia grátis.
   - AWS: US$ 0,03, mas o Brasil não aceita long code nem sender ID na AWS; ver item 6.
   - Infobip: US$ 0,029 [índice de busca].
   - Twilio: US$ 0,0599.
   - Comtele: R$ 0,12 na rota premium (recarga mínima de R$ 50, saldo não expira).
   - Mobizon: R$ 0,06.
   - Zenvia: R$ 0,10, dentro de pacote mínimo de R$ 100/mês.
   - Produtos "Verify": Twilio cobra US$ 0,05 por verificação com sucesso, a AWS US$ 0,045 e a Vonage € 0,052 [índice de busca], todos **somados** ao preço do SMS.
5. **WhatsApp (Cloud API direto com a Meta), categoria authentication: R$ 0,035 por mensagem entregue** (US$ 0,0068), de 2 a 3,5 vezes mais barato que o SMS. Mas:
   - a Meta usa dados de uso e logs "para desenvolver, operar, melhorar [...] e fazer marketing" dos seus serviços [M5], o que pode torná-la controladora de parte dos dados;
   - os termos dizem que a plataforma é "solely for your business or commercial use" [M5];
   - a pessoa precisa ter WhatsApp, e o código só chega ao aparelho principal [M6].
6. **Fornecedores brasileiros** (Comtele, Zenvia, Mobizon):
   - **nenhum diz onde processa**. Comtele e Zenvia admitem servidores ou transferência ao exterior sem nomear o mecanismo [C2][C3][Z2]. Ser brasileiro **não garante** que não haja transferência internacional;
   - **retenção publicada**: Comtele guarda dados de envio por 365 dias [C3], Mobizon apaga 2 semanas após o fim do contrato [B2] e Zenvia não fixa prazo [Z2].
7. **Na escala de referência (~30 usuários/mês, 30 a 60 SMS)**, quase todas as opções ficam entre R$ 0 e R$ 30/mês. As exceções são a Zenvia (pacote de R$ 100/mês) e a AWS, se exigir short code dedicado (US$ 330 de setup + US$ 330/mês ≈ R$ 1.853/mês). Ver seção 5.
8. **Verificação silenciosa pela operadora**: o Brasil tem a API Number Verify da GSMA Open Gateway desde 2023, com Vivo, Claro e TIM [O1]. Preço não é público. O Firebase PNV não lista o Brasil [G6] e o SNA da Twilio não confirma o Brasil [T7].

## 2. Tabela comparativa

Preço de lista em 12/11/2026, sem desconto por volume. "ANPD" = o DPA publicado incorpora as cláusulas-padrão do Anexo II da Res. CD/ANPD 19/2024.

| Fornecedor | Preço por SMS ao Brasil | Taxa de "Verify" | Grátis / mínimo | Cláusulas ANPD no DPA | Onde processa | Retenção (telefone / conteúdo) | Confiança |
|---|---|---|---|---|---|---|---|
| **Twilio** (Programmable SMS / Verify) | US$ 0,0599 por segmento [T1] | US$ 0,05 por verificação com sucesso + canal [T2] | Trial sem cartão, valor não informado [T1] | **Sim**, por referência; opções preenchidas; sem frase "sem alteração" [T3] | EUA (importador: Twilio Inc.) [T3] | Verify: `to` com `deleteSla: 30` [T5]; Messaging: redação opcional (sob pedido), `ContentRetention=discard` por mensagem [T6]; após encerrar a conta, 30 dias (+60 em backup) [T3] | Alta |
| **AWS End User Messaging SMS** | US$ 0,03 [A1] | OTP: US$ 0,045 por verificação com sucesso + SMS [A2] | Sem franquia de SMS; limite inicial de gasto de US$ 1 e sandbox [A4] | **Não**, só SCC da UE para dado sob GDPR [A3] | API em São Paulo (sa-east-1) [A4]; rota até a operadora não informada | Não encontrado; DPA: devolve/apaga até 90 dias após o fim [A3] | Alta (preço/DPA) |
| **Google Identity Platform / Firebase Phone Auth** | US$ 0,02 [G1] | — (MAU de telefone grátis até 50 mil) [G1] | **10 SMS/dia grátis** [G1] | **Sim** (CDPA, Apêndice 3 "Brazil", BR SCCs publicadas na íntegra, "nothing [...] is intended to modify") [G2][G5] | **Só EUA** ("processes data exclusively in the United States") [G4] | IP: "a few weeks"; telefone: até o cliente apagar o usuário, depois até 180 dias [G4] | Alta |
| **Vonage** (Verify v2) | Não confirmado (403) | € 0,052 / US$ 0,06084 por verificação com sucesso + canal [índice de busca] [V1] | Não confirmado | **Não confirmado** (DPA 403). Índice de busca: SCC da UE para suboperadores e intragrupo [V2] | Não confirmado | Não confirmado | Baixa |
| **Sinch** | Não publicado (página sem Brasil) [S1] | Não publicado [S1] | "trial credit", valor não informado [S1] | **Não**: Anexo 3 "Brazil" adota a LGPD, mas a transferência usa só SCC da UE (2021/914) [S2] | Grupo Sinch, sem lista de locais [S2] | Apaga até 90 dias após o fim da conta; conteúdo guardado criptografado; sem prazo para logs [S2] | Alta (DPA) |
| **Infobip** | US$ 0,02902 [índice de busca] [I1] | Não pesquisado | Não confirmado | **Não confirmado** (DPA 403). Índice de busca: anexos citam SCC da UE e UK [I2] | Não confirmado | Não confirmado | Baixa |
| **Zenvia** (BR) | R$ 0,10 no pacote de R$ 100/mês [Z1] | — | **Mínimo R$ 100/mês**; setup de R$ 649 citado (contraditório) [Z1] | N/A, mas o DPA prevê transferência internacional "se necessário", sem mecanismo [Z2] | Não informado [Z2] | Sem prazo fixo; apaga a pedido, no fim do contrato ou da finalidade [Z2] | Alta |
| **Comtele** (BR) | R$ 0,12 (premium) / R$ 0,10 (marketing), faixa de 500 [C1] | — | R$ 1 de teste; **recarga mínima de R$ 50; saldo não expira** [C1] | N/A; a política admite prestadores no exterior, sem mecanismo [C2][C3] | "Brasil ou no exterior" [C2] | **Dados de envio: 365 dias** (Termos 2.8) [C3] | Alta |
| **Mobizon** (BR, CNPJ 37.969.249/0001-10) | R$ 0,06 por segmento [B3] | — | Sem mensalidade; mínimo não informado [B3] | N/A; termos sem cláusula de transferência [B2] | Não informado [B2] | Conta e dados apagados 2 semanas após o fim do contrato [B2] | Média (preço não aparece ligado ao Brasil de forma explícita) |
| **WhatsApp Cloud API** (Meta, authentication) | **R$ 0,035** (BRL) / US$ 0,0068 por mensagem entregue [M2] | — | Sem franquia para authentication (as 1.000 grátis são só de "service") [M1] | **Sim** (Global DTA, §7; importador WhatsApp LLC; "nothing [...] is intended to vary or modify any SCCs") [M4] | Global; **armazenamento local no Brasil opcional** (`data_localization_region: BR`), com processamento em uso fora por até 60 min [M3] | 90 dias após o fim; Meta usa dados de uso e logs para fins próprios [M5] | Alta |

**Supabase** não é fornecedor de SMS: o Auth usa Twilio, Twilio Verify, MessageBird, Vonage ou TextLocal [P1]. Tem um "Send SMS Hook" para usar outro provedor, inclusive um regional [P3]. O DPA (v1, 1º/08/2026) não menciona Brasil, LGPD nem ANPD. Ele só diz, de forma genérica, que as SCCs serão "modificadas" se a lei do exportador exigir, ou que as partes firmarão acordo suplementar (Schedule 2, §4.2 e §4.4) [P2]. **Alta.**

## 3. Por fornecedor

### 3.1 Twilio (Programmable Messaging e Verify)

- **Preço**: SMS de saída para o Brasil a **US$ 0,0599 por segmento**, "current as of November 2026". Pode haver "additional carrier fees". Mensagem com status "Failed" custa US$ 0,001 [T1]. O Verify cobra "**$0.05 per successful verification plus standard channel fees**". A página do Verify não dá preço de canal para o Brasil e remete à tabela internacional de SMS [T2]. Assumi que a taxa do canal SMS é igual ao preço do Programmable SMS. **(inferência)** **Alta.**
- **Remetente no Brasil**: long code brasileiro só para P2P. Long code internacional "not supported by operator networks", e o remetente pode ser trocado. O sender ID alfanumérico é opcional, só para TIM, Claro e Vivo, e leva cerca de **10 semanas**. Short code leva de 2 a 4 semanas [T4]. **Alta.** Não pesquisei o custo de short code ou sender ID na Twilio.
- **Cláusulas ANPD** [T3]:
  - O DPA define "Brazil Standard Contractual Clauses" como "the Standard Contractual Clause contained in Annex II of Resolution CD/ANPD No. 19/2024". A §2.7 diz que elas "will be deemed entered into, and incorporated into this Addendum by this reference" e se aplicam a "personal data that is transferred via the Services from Brazil".
  - Opções preenchidas: Cláusula 3, "OPTION B" (transferência posterior permitida via suboperadores); Cláusula 4, Twilio é a "Designated Party" quando atua como controladora; Cláusula 9, sem docking. Exportador: o cliente; importador: Twilio Inc.
  - **Não há frase de "sem alteração" para as cláusulas brasileiras.** A frase sobre modificação (§2.6) trata só das SCC da UE.
  - Pela ordem de precedência da §2.1, aplica-se um único mecanismo. As cláusulas brasileiras são o item (e), depois de DPF, BCR, SCC da UE e IDTA do Reino Unido. Os quatro primeiros são mecanismos de UE/Reino Unido/EUA. Para dados que saem do Brasil, a leitura natural é que vale o (e). **(inferência; pergunta para advogado)**
  - **Alta** para o texto.
- **Onde processa**: o importador é a Twilio Inc. (EUA) [T3]. Não procurei região da Twilio no Brasil.
- **Retenção**:
  - Verify: o campo `to` (o telefone) leva a anotação `"pii":{"handling":"standard","deleteSla":30}` [T5]. A página não define a unidade nem diz quando o registro de verificação é apagado.
  - Messaging: a "Message Redaction" (corpo e/ou número) é **de acesso controlado**: é preciso pedir à Twilio. Com ela ativa, o dado fica em produção por até 24 h e depois em armazenamento restrito "for compliance". Sem ela, dá para pedir descarte por mensagem com `ContentRetention=discard` e `AddressRetention=obfuscate` [T6].
  - Após o fim do contrato: conteúdo apagado em 30 dias, e em 60 dias nos backups [T3].
  - O artigo de suporte "Data Retention and Deletion in Twilio Products" deu 403. Segundo o índice de busca, o MTL é de 30 dias para "the vast majority of our data" [índice de busca].
  - **Média.**

### 3.2 AWS End User Messaging SMS (antigo SNS SMS / Pinpoint)

- **Preço**: o CSV oficial de preços traz "BR, Brazil, All Networks, All number types, **0.03**" (USD) [A1]. A página de preço diz "**$0.045 for each successful OTP verification**", cobrado além do SMS. Também lista **short code dedicado no Brasil: US$ 330 de setup + US$ 330/mês**, com cerca de 4 semanas para provisionar [A2]. **Alta.**
- **Restrição relevante**: na tabela de países da AWS, o Brasil aparece com short code "Yes", long code "No", sender ID "No", two-way "Yes" e envio internacional "Yes". A nota 10 diz que mensagens de números habilitados para envio internacional "are sent on a best effort basis and may be replaced downstream" [A5]. Lendo a tabela, **o único remetente estável para o Brasil é o short code dedicado (R$ ~1.853/mês)**. Sem ele, o envio é "best effort". **(inferência; confirmar com a AWS)**
- **Cláusulas ANPD**: **não**. O DPA diz que as Standard Contractual Clauses "will only apply to Customer Data subject to the GDPR". Elas são as da Decisão (UE) 2021/914. O DPA não menciona Brasil nem LGPD [A3]. **Alta.**
- **Onde processa**: a API de SMS existe na **região de São Paulo (sa-east-1)** [A4]. O DPA promete não tirar dados da região escolhida "except as necessary to provide the Services" [A3]. A doc diz que os números são providos "through a single carrier partner in each region/country" [A5], sem dizer onde esse parceiro processa. **Se há transferência ao entregar via parceiro não foi esclarecido.**
- **Retenção**: não encontrada na fonte primária (procurei no DPA e nas páginas de preço e de países). O DPA prevê devolver ou apagar dados até 90 dias após o término [A3].
- **Grátis**: não há franquia de SMS na página [A2]. A cota padrão é de US$ 1,00 de gasto por conta, e o sandbox aceita até 10 números verificados [A4].

### 3.3 Google: Firebase Authentication (telefone) / Identity Platform

- **Preço**: "Brazil (BR) **$0.02** / 1 count". "**The first ten SMS that you send per day are not billed.**" O provedor "Phone" está no Tier 1, grátis até 50.000 MAU [G1]. **Alta.** Não confirmei se o plano gratuito do Firebase (Spark) ainda permite login por telefone. A página trata de faturamento ativo.
- **Cláusulas ANPD** [G2][G3][G5]:
  - O Cloud Data Processing Addendum tem uma seção "Brazil" (Apêndice 3) com as "BR SCCs (Controller-to-Processor)" e diz: "Nothing in the Agreement (including this Addendum) is intended to modify or contradict the BR SCCs."
  - O texto das BR SCCs publicado pelo Google (versão de 21/08/2025) reproduz as cláusulas "approved by the National Data Protection Authority (ANPD)". Opções: Cláusula 3, **Opção A** (sem transferência posterior, salvo pelo item 18.3); Cláusula 4, **o exportador** (o cliente) é responsável pelas Cláusulas 14, 15 e 16.
  - **A página de termos do Firebase põe o "Firebase Authentication" na linha regida pelos Google Cloud Platform Terms of Service** [G3]. Daí a leitura de que o CDPA se aplica. Os "Firebase Data Processing and Security Terms", ao contrário, só tratam de lei europeia [G7]. **(inferência; confirmar qual contrato se aceita no console)**
  - **Alta** para o texto.
- **Onde processa**: "Firebase Authentication [...] is run only from US data centers" e "processes data exclusively in the United States" [G4]. **Há transferência internacional; depende das BR SCCs.**
- **Retenção**: "Firebase Authentication keeps logged IP addresses for a few weeks". O resto dos dados fica até o cliente apagar o usuário e depois sai dos sistemas ativos e de backup "within 180 days" [G4]. Não há menção a guardar o conteúdo do SMS. **Alta.**
- **Firebase Phone Number Verification (PNV)**: verifica o número pela operadora, sem SMS. Só há guia para Android. **O Brasil não está entre as 15 regiões listadas** [G6]. **Alta.**

### 3.4 Vonage (Verify)

- As páginas de preço, o DPA e o artigo de suporte da Vonage deram **403**.
- Índice de busca [V1]: "€0.052/$0.06084 per successful verification", com "Additional Messaging & Voice rates" à parte. O modelo "Verify Success" (preço por país) é só para clientes enterprise. **Baixa.**
- DPA: o índice de busca mostra SCC da UE para suboperadores e intragrupo; nada sobre Brasil [V2]. **Não confirmado.**

### 3.5 Sinch

- **Preço**: a página pública de SMS só tem EUA e Canadá. A de Verification não dá preço do Brasil para SMS, flash call, ligação ou "data verification", e menciona "trial credit" sem valor [S1]. **Alta** (para "não publicado").
- **Cláusulas ANPD**: **não**. O DPA (versão 8, de 29/10/2025) tem um Anexo 3 "For Customers and contracts in Brazil" que adota as definições da LGPD. Mas a transferência para fora do país usa "Standard Contractual Clauses as per European Commission's Decision 2021/914/EU" (§12). Não há menção à ANPD nem à Res. 19/2024 [S2]. **Alta.**
- **Retenção**: apaga os dados pessoais "Within ninety (90) days following termination of the account". O conteúdo é armazenado "in an encrypted format". Há "data retention policy" e "automated deletion" sem prazos publicados [S2].
- Segundo o índice de busca, a lista de suboperadores tem a Sinch BR S.A. (Brasil). **Não confirmado.**

### 3.6 Infobip

- Página de preço e DPA com **403**.
- Índice de busca:
  - Brasil a "0.02902 USD (0.02504 EUR) per message", valor "estimado" [I1];
  - o DPA global cita SCC da UE e um adendo do Reino Unido [I2];
  - um aviso de privacidade para **candidatos a emprego** menciona as cláusulas-padrão da ANPD, mas isso não é o DPA de cliente.
- **Baixa.**
- Segundo notícia da GSMA, a Infobip é integradora técnica das APIs da Open Gateway no Brasil [O1].

### 3.7 Zenvia (brasileira)

- **Preço**: o SMS é vendido por **pacote de canais** junto com um plano de software. Pacote de R$ 100 = R$ 0,1000/SMS, até 1.000 envios, "Faturado mensalmente". O plano Starter tem mensalidade de R$ 0, mas o total aparece como "R$ 100/mês". A página diz "ATIVAÇÃO GRÁTIS!" e, na tabela, "R$ 649 no primeiro mês caso necessite habilitar os canais WhatsApp e/ou RCS". Não há plano só de API visível [Z1]. **Alta** (texto); a contradição é da própria página.
- **DPA** (atualizado em 03/06/2025) [Z2]:
  - **Transferência**: cláusula 8.1, "o Grupo Zenvia poderá realizar transferência internacional dos Dados Pessoais Tratados" quando necessário ao contrato; 8.2, compromisso genérico de conformidade. **Não nomeia mecanismo nem a ANPD.**
  - **Suboperadores**: a lista é dada só "mediante solicitação" (6.2).
  - **Retenção**: apaga a pedido, no fim do contrato ou ao cumprir a finalidade, sem prazo (11.1).
  - **Alta.**
- **Onde processa**: não informado [Z2]. A Zenvia se descreve como grupo multinacional (índice de busca). **(inferência: pode haver transferência)**

### 3.8 Comtele (brasileira)

- **Empresa**: COMTELE – Equipamentos Para Comunicações e Locações LTDA, CNPJ 14.121.127/0001-73 [C3].
- **Preço**: faixa de 500 mensagens, Premium R$ 0,12 e Marketing R$ 0,10. A rota Premium é apontada para "códigos de acesso". Saldo de teste de R$ 1,00. **Recarga mínima de R$ 50,00. "Seu saldo não expira."** Não há produto de token separado, mas há página "SMS para Autenticação" [C1]. **Alta.**
- **Onde processa**: "podem estar localizados no Brasil ou no exterior" [C2]. A política de privacidade de 07/01/2025 (seção 7) cita "prestadores de serviços localizados no exterior, incluindo prestadores de serviços em nuvem" [C3]. **Não nomeia mecanismo de transferência.** **Alta.**
- **Retenção** [C2][C3]:
  - **Termos de Uso 2.8: "A COMTELE armazena os dados dos envios de seus clientes por 365 dias, após isso, os dados são permanentemente excluídos"**. A Política, seção 10(iv), diz o mesmo.
  - Há uma versão antiga da política (15/12/2020) ainda publicada, com "prazo mínimo de 6 (seis) meses". A política coleta "Conteúdo do SMS que será enviado".
  - **Alta.** Duas versões publicadas convivem. Confirmar qual vale.

### 3.9 Mobizon (brasileira)

- **Empresa**: "Mobizon", Suzano/SP, CNPJ 37.969.249/0001-10, foro e lei brasileiros [B2].
- **Preço**: "0.0600" BRL "per 1 SMS segment". A página tem o Brasil na lista de destinos, mas não liga o valor ao país de forma explícita. "No hidden fees". Pagamento por cartão, boleto ou Pix [B3]. O índice de busca também mostrou R$ 0,1677 numa versão da página. **Média.**
- **LGPD/transferência**: os termos dizem que o cliente "does not need to enter into a separate contract [...] pursuant to art. 39 LGPD" e não têm cláusula de transferência internacional nem de local de armazenamento [B2]. **Alta.**
- **Retenção**: dados da conta "deleted two weeks after the termination of the user agreement". Não há cláusula sobre o conteúdo das mensagens [B2].

### 3.10 Fornecedores citados no pedido e não pesquisados a fundo

- **TotalVoice**: não pesquisada.
- **Outros agregadores brasileiros de SMS**: não pesquisados.
- Se o grill quiser mais opções brasileiras, o critério que separa os fornecedores é **onde processam e qual mecanismo usam**, não o preço (ver seção 6).

## 4. Alternativas que mantêm "telefone verificado"

### 4.1 WhatsApp (Cloud API, template de autenticação)

- **Preço**: tabela oficial "Cost per message in BRL [...] effective October 1, 2026": Brazil, Authentication **0.035** BRL. Na tabela em USD: **0.0068** [M2]. Até 500.000 mensagens/mês vale o preço de lista [M2]. A cobrança é por mensagem **entregue**. As 1.000 mensagens grátis por mês são só de "service", não de authentication [M1]. A página da Meta ainda cita 0,68 ¢, o que confere com a tabela [M1]. **Alta.**
  - O arquivo de tarifas que a AWS publica para WhatsApp traz US$ 0,0051 para o Brasil [A6]. Não sei a razão da diferença. Usei a tabela da Meta.
- **Por BSP**: Twilio Verify via WhatsApp cobra US$ 0,05 por verificação mais a taxa do template [T2]. A Zenvia não publica preço de authentication [Z1].
- **Como funciona**: o texto do template é fixo. O código expira entre 1 e 90 minutos. Há botões "copy code", "one-tap autofill" (Android e iOS 26+) e "zero-tap" (Android). Num PWA, na prática, só o "copy code" faz sentido **(inferência)**. A mensagem de autenticação **só chega ao aparelho principal** do WhatsApp, não a aparelhos vinculados [M6].
- **LGPD**:
  - **Cláusulas ANPD: sim.** O Global Data Transfer Addendum (atualizado em 22/08/2025, §7) diz que o cliente "is the Controller and Exporter" e a WhatsApp LLC "is the Processor and Importer". Cláusula 4 "Option A will apply and you shall be the Designated Party". E: "Nothing in the Business Terms [...] is intended to vary or modify any SCCs" [M4]. O adendo para dados europeus (Business Data Transfer Addendum) não trata do Brasil [M7]. **Alta.**
  - **Meta usando dados para si**: os termos da plataforma dizem que WhatsApp e "the other Meta Companies will use it to develop, operate, provide, improve, understand, customize, support, and market our Platform Services", inclusive "usage, log, and functional information" [M5]. Para esse uso, a Meta pode ser **controladora**, não operadora. **(inferência; pergunta para advogado)**
  - **Armazenamento local no Brasil**: dá para fixar o armazenamento em repouso no Brasil por número (`data_localization_region: "BR"`). O dado "em uso" pode ser processado fora por até 60 min. Números de telefone compartilhados por botão de contato ficam na agenda da Meta "regardless of your local storage configuration" [M3]. **Alta.**
  - **Retenção**: até 90 dias após o fim, mais backup "for a limited time" [M5].
  - **Elegibilidade**: "solely for your business or commercial use" e "not for personal use" [M5]. Um portfólio novo começa com limite de 250 mensagens [M8]. **Não confirmado** se um controlador pessoa física sem CNPJ consegue usar ou passar na verificação de empresa.
- **Diferença de garantia** **(inferência)**: o SMS prova que a pessoa tem o chip naquele momento. O WhatsApp prova que ela controla a conta de WhatsApp ligada ao número, conta que pode sobreviver à troca ou reciclagem do chip pela operadora. Para o Banimento (ADR 0006) isso pode importar.

### 4.2 Verificação silenciosa pela operadora (Number Verify / SNA)

- A GSMA anunciou em **28/11/2023** que as operadoras brasileiras lançaram três APIs da Open Gateway: **Number Verify**, SIM Swap e Device Location Verification [O1]. A Infobip aparece como integradora e a Microsoft Azure como plataforma. **Preço e canal de contratação não são públicos** [O1]. **Média.**
- **Twilio SNA**: disponível em 9 países. A página cita EUA, Canadá, Reino Unido, Alemanha, França e Espanha, **não cita o Brasil**. O preço é sob consulta. "SNA uses the data session": precisa de dados móveis no aparelho [T7]. **Alta.**
- **Firebase PNV**: não lista o Brasil [G6].
- Num PWA, depender de dados móveis (não Wi-Fi) e de suporte do navegador é um risco de usabilidade. **(inferência)**

### 4.3 Flash call / missed call

- A Sinch lista "flash call" na página de Verification, **sem preço para o Brasil** [S1]. Não pesquisei regras da Anatel sobre flash call.
- Num PWA, o app não lê o registro de chamadas, então a pessoa teria de digitar os últimos dígitos. **(inferência)**

### 4.4 RCS

- O CSV oficial da AWS traz para o Brasil RCS Basic a US$ 0,03 por mensagem e RCS Single a US$ 0,0463 [A7]. Custa igual ou mais que o SMS da AWS e exige um "agente" RCS registrado. **Não é mais barato.** Não pesquisei o DPA para RCS (é o mesmo DPA da AWS, sem cláusulas ANPD [A3]).

## 5. Estimativa de custo mensal na escala de referência

**Premissas** (minhas, a validar no grill):

- **Cenário A (otimista)**: 30 cadastros, 1 SMS cada, nenhum reenvio, nenhum login em aparelho novo. **30 SMS e 30 verificações.**
- **Cenário B (conservador)**: 30 cadastros, 6 logins em aparelho novo (20% dos usuários), 24 reenvios ou falhas. **60 SMS e 36 verificações com sucesso.**
- Câmbio: R$ 5,6143 (PTAX de venda, 12/11/2026) [B1]. 1 SMS = 1 segmento (código curto, sem acento). Sem IOF.

| Fornecedor | Conta (A) | A em R$ | Conta (B) | B em R$ | Observação |
|---|---|---|---|---|---|
| Twilio SMS | 30 × 0,0599 = US$ 1,80 | ~10,09 | 60 × 0,0599 = US$ 3,59 | ~20,18 | + custo do remetente (não pesquisado) |
| Twilio Verify | 30 × 0,05 + 30 × 0,0599 = US$ 3,30 | ~18,51 | 36 × 0,05 + 60 × 0,0599 = US$ 5,39 | ~30,28 | Canal = preço do SMS (inferência) |
| AWS SMS | 30 × 0,03 = US$ 0,90 | ~5,05 | 60 × 0,03 = US$ 1,80 | ~10,11 | Só se o "best effort" servir |
| AWS SMS + OTP | 0,90 + 30 × 0,045 = US$ 2,25 | ~12,63 | 1,80 + 36 × 0,045 = US$ 3,42 | ~19,20 | idem |
| AWS com short code BR | + US$ 330/mês (+ US$ 330 setup) | **~1.853 + uso** | idem | **~1.863** | Remetente estável no Brasil |
| Google Identity Platform | 30 SMS, todos ≤ 10/dia → US$ 0 | **0** | 60 SMS ≤ 10/dia → US$ 0; pior caso (todos num dia): 50 × 0,02 = US$ 1,00 | **0 a ~5,61** | 10 SMS/dia grátis |
| Vonage Verify | 30 × 0,06084 = US$ 1,83 + SMS | ~10,25 + SMS | 36 × 0,06084 = US$ 2,19 + SMS | ~12,30 + SMS | Preço do SMS ao Brasil não confirmado |
| Infobip | 30 × 0,02902 = US$ 0,87 | ~4,89 | 60 × 0,02902 = US$ 1,74 | ~9,78 | Preço do índice de busca |
| Sinch | — | — | — | — | Sem preço público |
| Zenvia | pacote mínimo | **100,00** | pacote mínimo | **100,00** | + possível setup de R$ 649 |
| Comtele (premium) | 30 × 0,12 | 3,60 | 60 × 0,12 | 7,20 | Desembolso inicial de R$ 50 (não expira) |
| Mobizon | 30 × 0,06 | 1,80 | 60 × 0,06 | 3,60 | Mínimo de recarga não informado |
| WhatsApp Cloud API (BRL) | 30 × 0,035 | 1,05 | 60 × 0,035 | 2,10 | Sem BSP; cobra só se entregue |

Leitura: **na escala do protótipo, o preço por mensagem quase não pesa.** O que pesa são custos fixos (short code AWS, pacote Zenvia), mínimos de recarga e o custo de conformidade: página de transparência da Cláusula 14, papel de Parte Designada e eventual consentimento. **(inferência)**

## 6. Lacunas e perguntas abertas para o grill

**Lacunas da pesquisa:**

1. **Vonage e Infobip**: preço do Brasil e DPA não lidos (403). Se entrarem na disputa, é preciso ler o DPA por outro meio (pedir PDF ao comercial).
2. **Sinch**: preço do Brasil não publicado.
3. **TotalVoice** e outros agregadores brasileiros: não pesquisados.
4. **AWS**: retenção de corpo e número do SMS não encontrada. O que acontece com envio ao Brasil sem short code ("best effort") não está confirmado.
5. **Twilio**: o artigo de retenção do suporte deu 403. A unidade de `deleteSla: 30` não está definida na página. Custo de sender ID ou short code no Brasil não pesquisado.
6. **Zenvia, Comtele e Mobizon**: onde processam e se usam as cláusulas-padrão da ANPD com os próprios suboperadores no exterior. Só perguntando a eles.
7. **Firebase**: se o plano Spark ainda permite login por telefone, e qual contrato (CDPA ou termos Firebase) é aceito na prática pelo console para o Auth.
8. **WhatsApp**: se pessoa física sem CNPJ pode usar a plataforma e passar na verificação de empresa; a razão da diferença entre a tabela da Meta (US$ 0,0068) e o arquivo da AWS (US$ 0,0051).
9. **Number Verify (Open Gateway)**: preço, contratação e funcionamento num PWA.

**Perguntas para o grill:**

1. **Fornecedor brasileiro que admite servidor no exterior sem mecanismo (Comtele, Zenvia)** vale mais ou menos que **estrangeiro com as cláusulas da ANPD (Twilio, Google, Meta)**? O ADR 0005 parte de que "brasileiro" resolve, mas os textos não garantem isso.
2. O Passaly aceita ser **Parte Designada** nas cláusulas (publicar o documento da Cláusula 14, responder ao titular em 15 dias, comunicar incidente em 3 dias úteis)? Isso se soma à página do art. 17, §2º, que o ADR 0005 já prevê.
3. **WhatsApp no lugar do SMS** (ou como primeiro canal, com SMS de reserva): o "telefone verificado" pelo WhatsApp basta para a identificação (ADR 0004) e para o Banimento (ADR 0006)? Aceitar a Meta usando metadados para fins próprios fere o espírito do ADR 0005 ("serviços acessórios estrangeiros no mínimo")?
4. **Retenção do fornecedor x retenção do Passaly**: a Comtele guarda dados de envio por 365 dias, mais que os prazos da tabela de retenção do contexto. Isso entra na política de privacidade como prazo do operador? Exigir apagamento antes?
5. O texto do SMS deve evitar qualquer dado além do código (sem apelido, sem bairro) para reduzir o que o fornecedor guarda? **(inferência: minimização, art. 6º, III)**
6. Para advogado:
   - (a) incorporar as cláusulas **por referência**, com as opções preenchidas e sem a frase "sem alteração" (Twilio), atende o art. 16 da Res. 19/2024 ("adoção integral e sem alteração [...] mediante instrumento contratual")?
   - (b) aceitar os termos online conta como "instrumento contratual firmado"?
   - (c) usar a API da AWS em São Paulo com entrega por parceiro de operadora é transferência internacional?

## 7. Fontes (acesso em 2026-11-12)

Twilio:
- [T1] Twilio, SMS pricing Brazil. https://www.twilio.com/en-us/sms/pricing/br
- [T2] Twilio, Verify pricing. https://www.twilio.com/en-us/verify/pricing
- [T3] Twilio, Data Protection Addendum (Schedule 1 §6; Schedule 3 §§2.1, 2.4, 2.6, 2.7). https://www.twilio.com/en-us/legal/data-protection-addendum
- [T4] Twilio, Brazil SMS guidelines. https://www.twilio.com/en-us/guidelines/br/sms
- [T5] Twilio Docs, Verify API: Verifications (anotação PII do campo `to`). https://www.twilio.com/docs/verify/api/verification
- [T6] Twilio Docs, Message Redaction for Programmable Messaging. https://www.twilio.com/docs/messaging/guides/privacy-message-redaction
- [T7] Twilio Docs, Silent Network Auth. https://www.twilio.com/docs/verify/sna
- (403, não lido) Twilio Support, Data Retention and Deletion in Twilio Products. https://support.twilio.com/hc/en-us/articles/4410585868443-Data-Retention-and-Deletion-in-Twilio-Products

AWS:
- [A1] AWS, End User Messaging SMS prices (CSV, linkado na página de preço). https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/business-applications/approved/documents/End-User-Messaging-SMS-Prices.ebc340b4d416d90832dd59629c4792b0deb6f8bc.csv
- [A2] AWS, End User Messaging pricing. https://aws.amazon.com/end-user-messaging/pricing/
- [A3] AWS Data Processing Addendum (PDF; §§12, 14, 16, 17). https://d1.awsstatic.com/legal/aws-dpa/aws-dpa.pdf
- [A4] AWS General Reference, AWS End User Messaging endpoints and quotas. https://docs.aws.amazon.com/general/latest/gr/end-user-messaging.html
- [A5] AWS End User Messaging SMS User Guide, Supported countries and regions. https://docs.aws.amazon.com/sms-voice/latest/userguide/phone-numbers-sms-by-country.html
- [A6] AWS, tabela de tarifas WhatsApp em USD, out/2026 (XLSX com extensão .csv, linkado na página de preço). https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/business-applications/approved/documents/2026-10-usd-rates.12c5e2244978e162c3431f0dee6a2c09acfa91b9.csv
- [A7] AWS, RCS prices (CSV). https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/business-applications/approved/documents/AWS_RCS_Prices.4d0c1ada25d8cfa5f2b156499b81d8086c3d7479.csv

Google:
- [G1] Google Cloud, Identity Platform pricing. https://cloud.google.com/identity-platform/pricing
- [G2] Google Cloud, Cloud Data Processing Addendum (Apêndice 3, "Brazil"). https://cloud.google.com/terms/data-processing-addendum
- [G3] Firebase, Terms of Service for Firebase Services (Firebase Authentication na linha dos GCP Terms). https://firebase.google.com/terms
- [G4] Firebase, Privacy and Security in Firebase. https://firebase.google.com/support/privacy
- [G5] Google Cloud, Standard Contractual Clauses (BR, controlador-operador), versão de 21/08/2025. https://cloud.google.com/sccs/br-c2p?hl=pt-br
- [G6] Firebase, Phone Number Verification, visão geral e "supported carriers and pricing". https://firebase.google.com/docs/phone-number-verification ; https://firebase.google.com/docs/phone-number-verification/pricing
- [G7] Firebase, Data Processing and Security Terms. https://firebase.google.com/terms/data-processing-terms

Meta / WhatsApp:
- [M1] Meta for Developers, WhatsApp Business Platform: Pricing. https://developers.facebook.com/docs/whatsapp/pricing
- [M2] Meta, rate cards linkados em [M1]: "Cost per message in BRL [...] effective October 1, 2026" e equivalente em USD, com volume tiers (arquivos XLSX em scontent.xx.fbcdn.net, com URL assinada e temporária; obtidos a partir de [M1]).
- [M3] Meta for Developers, Cloud API Local Storage. https://developers.facebook.com/docs/whatsapp/cloud-api/overview/local-storage
- [M4] WhatsApp Business Global Data Transfer Addendum (atualizado em 22/08/2025; §§1, 6, 7). https://www.whatsapp.com/legal/DTA
- [M5] WhatsApp Terms for WhatsApp Business Platform (§§1, 3(a), 6, 9). https://www.whatsapp.com/legal/WhatsApp-Terms-for-WhatsApp-Business-Platform
- [M6] Meta for Developers, Authentication templates. https://developers.facebook.com/docs/whatsapp/business-management-api/authentication-templates
- [M7] WhatsApp Business Data Transfer Addendum (dados europeus). https://www.whatsapp.com/legal/business-data-transfer-addendum ; WhatsApp Business Data Processing Terms: https://www.whatsapp.com/legal/business-data-processing-terms
- [M8] Meta for Developers, Messaging limits. https://developers.facebook.com/docs/whatsapp/messaging-limits

Sinch, Vonage, Infobip:
- [S1] Sinch, SMS pricing e Verification pricing. https://sinch.com/pricing/sms/ ; https://sinch.com/pricing/verification/
- [S2] Sinch, Data Processing Agreement, versão 8 (29/10/2025), §12 e Anexos 2 e 3. https://sinch.com/legal/terms-and-conditions/other-sinch-terms-conditions/data-processing-agreement/
- [V1] **[índice de busca]** Vonage, Verify API pricing (página com 403). https://www.vonage.com/communications-apis/verify/pricing/
- [V2] **[índice de busca]** Vonage, Technical and Organizational Security Practices. https://www.vonage.com/legal/technical-organizational-security-practices/ ; DPA com 403: https://www.vonage.com/legal/data-processing-addendum/
- [I1] **[índice de busca]** Infobip, SMS pricing (página com 403). https://www.infobip.com/sms/pricing
- [I2] **[índice de busca]** Infobip, Data Processing Agreement (403). https://www.infobip.com/data-processing-agreement

Brasileiros:
- [Z1] Zenvia, Preços. https://www.zenvia.com/precos/
- [Z2] Zenvia, Anexo I – Acordo de Privacidade e Proteção de Dados Pessoais (atualizado em 03/06/2025). https://zenvia.com/termos/dpa/
- [C1] Comtele, Preços. https://comtele.com.br/precos-comtele/
- [C2] Comtele, Política de Privacidade (versão de 15/12/2020, ainda publicada). https://comtele.com.br/politica-de-privacidade/
- [C3] Comtele, Políticas (Termos de Uso e Política de Privacidade de 07/01/2025). https://comtele.com.br/politicas/
- [B2] Mobizon Brazil, Terms and conditions. https://mobizon.com.br/en/terms
- [B3] Mobizon Brazil, Prices. https://mobizon.com.br/en/prices

Supabase:
- [P1] Supabase Docs, Phone Login. https://supabase.com/docs/guides/auth/phone-login
- [P2] Supabase, Data Processing Addendum (Version 1, 01/08/2026). https://supabase.com/legal/customer-resources/data-processing-addendum
- [P3] Supabase Docs, Send SMS Hook. https://supabase.com/docs/guides/auth/auth-hooks/send-sms-hook

Outras:
- [B1] Banco Central do Brasil, PTAX (API Olinda), cotação do dólar de 12/11/2026 (venda 5,6143). https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='11-01-2026'&@dataFinalCotacao='11-12-2026'&$format=json
- [O1] GSMA Newsroom, "Brazilian mobile industry launches three anti-fraud network services and becomes pioneer for GSMA Open Gateway" (28/11/2023). https://gsma.com/newsroom/?p=20822
- Res. CD/ANPD nº 19/2024 (arts. 16 e 17 do Anexo I; cláusulas no Anexo II): ver [A4] em [pesquisa-lgpd.md](pesquisa-lgpd.md). https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-19-de-23-de-agosto-de-2024
