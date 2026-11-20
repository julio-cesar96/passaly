# Pesquisa: stack (login por telefone, hospedagem em São Paulo, armazenamento de fotos, remoção de EXIF)

> **Aviso: isto não escolhe a stack.** É um levantamento de fontes da fase de descoberta para alimentar o grill e a spec. Preço de lista muda. Leitura de contrato não é parecer jurídico.

- Data da pesquisa / acesso às fontes: 2026-11-18
- Pergunta: quais peças cabem nas restrições do Passaly (aplicação e banco na região de São Paulo; CDN só se servir do Brasil; sem custo fixo alto; ~30 usuários em 4 semanas; operador único; sem e-mail, analytics ou monitoramento de terceiro)? Em especial: dá para usar o login por telefone do Firebase/Identity Platform com controle próprio sobre o envio de SMS? Quanto custa, no mínimo, hospedar Node/TypeScript + Postgres em São Paulo?
- Contexto (atualizado pelo coordenador durante a pesquisa): front **SPA Vite + TanStack Router/Query** servido por um servidor **Hono em Node**, num só processo/deploy (Docker ok). **Banco: Postgres** (Firestore saiu). **Fotos sem URL pública e sem CDN** (link assinado curto ou servidas pela app). Antecedentes: [pesquisa-sms-otp.md](pesquisa-sms-otp.md) (preço de SMS, DPAs e cláusulas da ANPD) e ADR 0005 / "Hospedagem e serviços" em [contexto-descoberta.md](contexto-descoberta.md).
- Método: documentação oficial de cada fornecedor. Várias páginas de preço do Google Cloud mostram o preço por região só via JavaScript. Baixei o HTML público e li a tabela de "Sao Paulo (southamerica-east1)" que vem embutida nele. Os preços de EC2 e S3 vieram dos arquivos JSON públicos que alimentam as páginas de preço da AWS (publicados em 17 e 18/11/2026).
- Bloqueios (não contornei): o artigo de suporte da Twilio sobre preço de short code deu **HTTP 403**, e a página de regiões da Oracle (oracle.com) também deu 403. Usei a documentação da Oracle (docs.oracle.com). A calculadora de preços da Magalu Cloud só carrega por JavaScript, e não achei a fonte dos dados: **sem preço da Magalu**.
- Legenda: **Alta** (li o texto primário), **Média** (primário parcial ou extraído do HTML/JSON da página), **Baixa** (só índice de busca ou secundária), **Não confirmado**. Conclusões minhas aparecem como **(inferência)**.
- Câmbio de referência: **PTAX de venda de 18/11/2026, R$ 5,8102** [X1]. IOF e spread do cartão não estão incluídos. O dólar subiu cerca de 3,5% desde a PTAX usada em pesquisa-sms-otp.md (R$ 5,6143 em 12/11).

## 1. Resumo (o que mais pesa na decisão)

1. **O Firebase/Identity Platform não envia SMS só pelo servidor.** O endpoint REST `accounts:sendVerificationCode` exige uma prova de app gerada no cliente: `recaptchaToken`, `playIntegrityToken` ou `iosReceipt`/`iosSecret`. Com o reCAPTCHA Enterprise ativo, exige `captchaResponse` + `clientType` + `recaptchaVersion` [F1]. Na web, isso significa reCAPTCHA no navegador [F2]. O servidor pode no máximo repassar um token gerado no navegador. **(inferência)**
2. **Limite próprio antes do envio existe, mas só com upgrade para Identity Platform.** A blocking function `beforeSmsSent` recebe o telefone, o tipo de SMS e o score do reCAPTCHA e pode responder `BLOCK` [F4][F5]. A política de regiões permite um allowlist (só Brasil) [F6]. As cotas do Google não são configuráveis pelo cliente: são fixas, ou se pede aumento ao suporte [F3]. A doc não restringe a região da blocking function, e `southamerica-east1` aceita Cloud Functions [F7]. **(inferência: dá para deployar lá)**
3. **O plano Spark (grátis) não envia SMS.** Na tabela de preços, o SMS de telefone no Spark aparece como "Not applicable" [F8]. A página de limites diz "Pay as you go (Blaze) plan only" [F3]. O Blaze não tem mensalidade: SMS para o Brasil a US$ 0,02, com os 10 primeiros SMS do dia grátis [F9].
4. **Sessão própria é possível, mas não tira o Firebase do caminho do dado.** O backend verifica o ID token com o Admin SDK [F10] e pode apagar o usuário em seguida. Mesmo assim, o Firebase Auth roda **só nos EUA**, guarda IP "por algumas semanas" e, depois que o usuário é apagado, remove o resto dos sistemas ativos e de backup "em até 180 dias" [F11]. **Apagar logo encurta a retenção do cadastro, mas não a dos logs de IP nem a dos backups.** **(inferência)**
5. **A Twilio Verify é chamada pelo servidor** (REST com credenciais da conta). Tem limites programáveis por chave, como telefone ou IP (max/intervalo; ao estourar, responde 429 e não envia) [T2], Fraud Guard [T3] e permissões por país [T3]. Usa um pool de números gerenciado incluído no preço, sem pedir remetente próprio [T1]. Custa US$ 0,05 por verificação com sucesso + SMS a US$ 0,0599 [T1][T4]. Não tem mensalidade.
6. **Preço mínimo mensal real, app + Postgres em São Paulo (lista, USD):**
   - **AWS EC2 t4g.nano** (Postgres na própria VM): US$ 4,89 de computação, mais disco e IPv4 (não confirmei esses dois) [A1].
   - **AWS Lightsail**: US$ 5 a VM com IPv4, ou US$ 3,50 só IPv6. O Postgres gerenciado custa US$ 15 [A2].
   - **Fly.io (gru)**: VM de 256 MB por cerca de US$ 3,54 e de 512 MB por cerca de US$ 5,96 (calculei pelo fator de região publicado). O Managed Postgres custa **US$ 38** (Basic) [Y1][Y2]. Contas pessoais com fatura abaixo de US$ 5 não pagam [Y1].
   - **Cloud Run + Cloud SQL**: o Cloud SQL db-f1-micro custa **US$ 11,53/mês** + SSD a US$ 0,255/GB (mínimo de 10 GB, **(inferência)**), cerca de **US$ 14 a 15/mês**. O Cloud Run escala a zero, e o free tier deve cobrir esta escala **(inferência)** [G1][G2].
   - **Supabase (sa-east-1)**: o plano grátis **pausa após 1 semana sem atividade** e não tem backup diário. O **Pro custa US$ 25/mês** [P1][P2].
   - **Neon (aws-sa-east-1)**: o plano grátis **não pausa o projeto**, mas a computação dorme após 5 min [N1][N2]. Neon é só banco: a app precisa de outro host em São Paulo.
   - **Oracle São Paulo, Always Free**: VMs grátis, sem Postgres gerenciado no Always Free, e com recuperação de instância ociosa [O1][O2].
   - **Railway e Render não têm região no Brasil** [R1][R2].
   - **Magalu Cloud**: preço não confirmado.
7. **Fotos em São Paulo**: GCS a US$ 0,035/GB-mês [G3] e S3 a US$ 0,0405/GB-mês [A3]. Nenhum dos dois tem free tier em São Paulo: o Always Free do GCS só vale em regiões dos EUA [G3]. Para cerca de 1 GB, o custo é de centavos. **O R2 não tem localização nem jurisdição no Brasil** [C1]. O Supabase Storage tem origem na região do projeto, mas **todo objeto é cacheado numa CDN global** [P4], o que conflita com "fotos sem CDN". **(inferência)**
8. **sharp**: o padrão remove todo o metadado, inclusive a orientação EXIF. `rotate()` sem argumento (ou `autoOrient()`) gira conforme o EXIF e depois remove a tag [S1][S2].

## 2. Firebase Authentication / Identity Platform: login por telefone

### A1. Quem dispara o SMS e o que a chamada exige

- **REST**: `POST https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode`. Corpo: `phoneNumber` (E.164). "At least one of (`iosReceipt` and `iosSecret`), `recaptchaToken`, or `playIntegrityToken` must be specified", exigência que vale "if 'captchaResponse' is not used (reCAPTCHA enterprise is not enabled)". O `captchaResponse` é "The reCAPTCHA Enterprise token provided by the reCAPTCHA client-side integration. Required when reCAPTCHA enterprise is enabled", junto com `clientType` e `recaptchaVersion`. A chamada exige API key; os escopos OAuth aceitos são `identitytoolkit` ou `cloud-platform`. A resposta devolve `sessionInfo`, usado depois para confirmar o código [F1]. **Alta.**
- **Pelo servidor?** A página não diz se o método pode ser chamado de um servidor [F1]. Todos os tokens de prova são gerados no cliente: reCAPTCHA no navegador, Play Integrity no Android, recibo por push no iOS. Por isso **não existe envio "puro" pelo servidor**. O servidor poderia repassar o token que o navegador gerou, sem que isso dispense o navegador. **(inferência)**
- **Admin SDK**: não encontrei método de envio de SMS. **Não confirmado** (não li a referência completa do Admin SDK).
- **App Check**: não apareceu como exigência nas páginas lidas. **Não confirmado.**

### A2. reCAPTCHA no fluxo web

- **É obrigatório na web.** "Firebase uses reCAPTCHA to prevent abuse". O verificador pode ser invisível ("can often verify the user without requiring any user action") ou um widget visível. O Firebase gerencia as chaves ("You don't need to manually set up a reCAPTCHA client") [F2]. **Alta.**
- **Proteção contra fraude de SMS (reCAPTCHA SMS defense / "SMS toll fraud protection")**, recurso do Identity Platform [F12]:
  - é **recomendada, não obrigatória** ("we recommend enabling");
  - com ela ativa, "no fallback verification is required";
  - liga com `phoneEnforcementState: ENFORCE` e um limiar de risco entre 0,0 e 0,9 (sugestão: começar perto de 0,8);
  - exige projeto Identity Platform, a API reCAPTCHA Enterprise ativada e o papel `roles/identitytoolkit.serviceAgent`;
  - na web, só a partir do JS SDK 11.
  - **Alta.**
- **Custo do reCAPTCHA** [F13]:
  - Essentials: grátis até 10.000 avaliações/mês, **sem SMS defense**.
  - Premium: exige faturamento. De 1 a 10.000 avaliações é grátis; de 10.001 a 100.000, taxa fixa de US$ 8; acima disso, US$ 1 por 1.000. SMS defense incluída, mas "Requires an extra assessment".
  - Enterprise: assinatura de no mínimo 12 meses.
  - As 10.000 grátis são por organização.
  - Na escala do Passaly, o custo é **US$ 0**. **(inferência)** **Alta** para a tabela.
- **Que dados coleta**: na integração direta do SMS defense, o telefone vai **sem hash** ("it should not be hashed or encrypted"), junto com o token e um `accountId`, que se recomenda mandar com hash [F14]. A página não diz o que o reCAPTCHA invisível coleta no navegador.
- **Papel do Google**: "Starting April 2, 2026", o Google passa a ser **operador (data processor)** dos dados coletados pelo reCAPTCHA (Fraud Defense), sob o Cloud Data Processing Addendum. O cliente vira controlador único e deve tirar do site as referências à Política de Privacidade do Google [F15]. **Alta.**
- **Onde processa**: **não encontrado** (procurei no FAQ e nas páginas de SMS defense). **Não confirmado.**

### A3. Limites próprios, política de região e blocking functions

- **Limites fixos do Google** [F3]:
  - por número: há limite, sem valor publicado;
  - por IP: 50 SMS/minuto e 500/hora; 150 requisições de verificação por IP por hora;
  - por projeto: 900 SMS/minuto e **3.000 SMS/dia** no Firebase Auth ("No limit" com Identity Platform);
  - para mudar, "contact Firebase support at least two weeks in advance".
  - **Não há cota configurável pelo cliente** (do tipo "3 por número por hora"). **Alta.**
- **Política de regiões de SMS** [F6][F2]:
  - allowlist ("only the regions that you specify") ou denylist, nunca as duas;
  - aplicada pelo código de região do telefone;
  - configurada pelo console ou por `PATCH` com `sms_region_config.allowlist_only.allowed_regions`;
  - "For new projects, the default policy allows no regions" [F2].
  - Os exemplos usam `IN` e `US`. Concluo que o Brasil é `BR`. **(inferência)** **Alta.**
- **Blocking function `beforeSmsSent`** [F4][F5]:
  - "Triggers before an SMS Message is sent to a user". Só para Node.js.
  - **Exige** "upgrade your Firebase project to Firebase Authentication with Identity Platform".
  - O exemplo lê `event.smsType === "SIGN_IN_OR_SIGN_UP"`, `event.additionalUserInfo.phoneNumber` e `event.additionalUserInfo.recaptchaScore`, e responde `recaptchaActionOverride: 'BLOCK'` ou `'ALLOW'`.
  - Tem de responder em 7 segundos.
  - A doc diz que lançar `HttpsError` bloqueia cadastro ou login, mas **não diz que vale para SMS**.
  - O exemplo apresenta o override como algo que se sobrepõe "the result provided by reCAPTCHA Enterprise". **Não confirmei se o `BLOCK` funciona sem o SMS defense ativo.**
  - **Alta** para o texto; **Média** para o comportamento.
  - **Limite próprio (3 SMS por número por hora, teto global diário)**: implementável dentro da `beforeSmsSent`, contando envios no nosso Postgres e respondendo `BLOCK`. **(inferência)** Isso põe mais um componente no caminho do login, e um que roda fora do nosso processo.
- **Região da blocking function**: a doc do Identity Platform só diz "In the Region list, select a region" [F16]. A referência do SDK não mostra opção de região específica [F5]. O Cloud Functions aceita `southamerica-east1` (Tier 2, 1ª e 2ª geração) [F7]. **(inferência: dá para deployar em São Paulo; o dado já passou pelos EUA, porque o Auth roda lá [F11])**
- **Limitação extra**: "Blocking functions are only available for use with Identity Platform" [F16].

### A4. Plano Spark × Blaze

- Na tabela de preços do Firebase, "Phone auth/SMS" aparece como "Not applicable" no Spark e "Billed per SMS sent" no Blaze [F8].
- A página de limites diz: "Verification code SMS messages: Pay as you go (Blaze) plan only" [F3].
- **Não há mensalidade no Blaze** [F8].
- SMS para o Brasil: "$0.02 / 1 count". "The first ten SMS that you send per day are not billed" [F9].
- **Alta.** Ponto prático: o Blaze exige cartão, e o gasto não tem teto automático (a doc só fala em alertas e calculadora). **(inferência)**

### A5. Sessão própria e retenção

- **Verificar o token no backend**: `getAuth().verifyIdToken(idToken)` devolve o token decodificado se "is not expired, and is properly signed". O método "does not check whether or not the token has been revoked" [F10]. A página não lista a claim `phone_number`. **Não confirmado** que o telefone vem no token, mas o `uid` vem (`sub`).
- **Fluxo possível**: verificar o token, criar a sessão própria no Hono e apagar o usuário com `getAuth().deleteUser(uid)` ("The Firebase Admin SDK allows deleting existing users by their `uid`") [F17]. **(inferência** para o fluxo; **Alta** para o método)
- **Retenção** [F11]:
  - "Firebase Authentication keeps logged IP addresses for a few weeks";
  - o resto fica "until the Firebase customer initiates deletion of the associated user, after which data is removed from live and backup systems within 180 days";
  - "The Firebase Authentication service is run only from US data centers".
  - **Alta.**
- **Leitura**:
  - apagar logo encurta a retenção do cadastro no sistema ativo;
  - os backups podem guardar o telefone por até 180 dias;
  - os logs de IP ficam semanas de qualquer jeito;
  - **a transferência internacional (EUA) acontece em todo login**, e depende das BR SCCs do Google (ver [pesquisa-sms-otp.md](pesquisa-sms-otp.md) §3.3).
  - **(inferência)**
- **Efeito colateral (inferência)**: se o usuário for apagado, o próximo login do mesmo telefone cria um `uid` novo. O vínculo fica pelo telefone na nossa base. Para não guardar o telefone em claro, seria preciso guardar um hash. Isso entra na spec.

### A6. Números de teste e desenvolvimento

- Até **10 números fictícios** com código fixo, que não consomem cota ("Use test phone numbers/codes that are hard to guess and change those frequently") [F2].
- Na web, `appVerificationDisabledForTesting = true` desliga o reCAPTCHA, mas "Only fictional phone numbers can be used with this API" [F2].
- **"localhost is not allowed as a hosted domain for the purposes of phone auth"** [F2]. O desenvolvimento local com SMS real exige outro domínio. **Alta.**
- Emulador do Auth: não pesquisado nesta rodada. **Não confirmado.**

## 3. Twilio Verify × Programmable SMS (Brasil)

- **Envio pelo servidor**: as duas são APIs REST chamadas com credenciais da conta. Não há etapa obrigatória no navegador. **(inferência a partir da natureza da API; Média)**
- **Preço**:
  - Verify: "$0.05 per successful verification plus standard channel fees". Só conta verificação com sucesso. Trial "No credit card required". **Sem mensalidade nem mínimo** na página [T1].
  - SMS para o Brasil: **US$ 0,0599 por segmento** ("Pricing current as of November 2026") [T4]. Número "International Prefix": US$ 1,15/mês [T4].
  - Por login na Verify: cerca de US$ 0,11, ou **R$ 0,64** (PTAX de 18/11). **(inferência: assumi canal igual ao preço do SMS)**
- **Remetente**:
  - **Verify**: "Managed number pool" incluído no preço. Short code dedicado é add-on pago opcional. A página não pede registro de remetente [T1]. **Alta.**
  - **Programmable SMS**: long code brasileiro só para P2P. Com long code internacional, "SenderId is not preserved and may be overwritten". Sender ID alfanumérico com pré-registro opcional (TIM, Claro e Vivo), cerca de **10 semanas**. Short code em 2 a 4 semanas [T5]. **Alta.**
  - **Custo de short code no Brasil**: o artigo de suporte deu 403. O índice de busca cita "Brazil random FTEU" a **US$ 715/trimestre** (US$ 2.620/ano), sem setup [T6]. **Baixa.** Pela Verify, isso não é necessário.
- **Limites (Verify)** [T2]:
  - "Service Rate Limits": chaves definidas pelo cliente (IP, telefone, código de país, sessão etc.) com buckets "Max" e "Interval" em segundos;
  - ao estourar, responde HTTP 429 (erro 60203) e "no message is sent";
  - **dá para fazer "3 por número por hora"** com um bucket de max 3 e intervalo de 3600 s. **(inferência)**
  - Preço do recurso não informado.
  - **Alta.**
- **Fraud Guard** [T3]: "uses SMS fraud detection to block suspicious messages". Tem níveis Basic, Standard (padrão, falso positivo abaixo de 1%) e Max (abaixo de 2%). A Twilio pergunta se o cliente quer ligar ao criar o serviço; preço não informado. "Geo Permissions" por país ("make sure that destinations outside of your business focus are turned off"). **Alta.**
- **Teto global diário**: não achei recurso nativo de teto de gasto. Dá para fazer com um bucket por chave fixa (ex.: `global`, max N, intervalo 86400). **(inferência)**
- **Onde processa**: EUA (Twilio Inc. como importador), com BR SCCs por referência (ver [pesquisa-sms-otp.md](pesquisa-sms-otp.md) §3.1).

## 4. Hospedagem em São Paulo (Node/TS + Postgres)

Preço de lista em USD, mês de 730 h, sem imposto. "Pausa" = o serviço desliga sozinho por inatividade.

| Opção | Região SP | Menor custo app | Menor custo Postgres | Grátis que não pausa? | Cron nativo | Backup do banco | Confiança |
|---|---|---|---|---|---|---|---|
| **Cloud Run + Cloud SQL** | Sim (`southamerica-east1`) | Cloud Run escala a zero; free tier mensal [G2] | db-f1-micro **US$ 11,534** + SSD US$ 0,255/GB-mês + backup US$ 0,12/GB-mês [G1] | Cloud Run sim (free tier); Cloud SQL não tem grátis | Cloud Scheduler em `southamerica-east1`; 3 jobs grátis por conta, depois US$ 0,10/job-mês [G4][G5] | Automático, retenção configurável de 1 a 365; **local padrão "Multi-region"** [G6] | Média (preço extraído do HTML) |
| **Fly.io** | Sim (`gru`, aceita MPG) [Y3] | 256 MB ≈ **US$ 3,54**; 512 MB ≈ US$ 5,96 **(calculado)** [Y1] | Managed Postgres **US$ 38** (Basic, shared-2x, 1 GB) + US$ 0,28/GB [Y2] | **Sem free tier**; fatura abaixo de US$ 5 perdoada (org pessoal); trial de US$ 1 por 7 dias [Y1] | `fly machine run --schedule` hourly/daily/weekly/monthly "fuzzy" [Y4] | MPG: "Automatic backups", retenção não informada [Y2] | Alta (preço iad); Média (gru) |
| **Supabase** | Sim (`sa-east-1`) [P3] | Não hospeda o servidor Hono (só Edge Functions; não pesquisado) | Free (pausa) ou **Pro US$ 25** com US$ 10 de crédito que cobre uma Micro [P1] | **Não**: "Free projects are paused after 1 week of inactivity" [P1] | Supabase Cron (pg_cron), de "every second to once a year" [P5] | Pro: diário, 7 dias; Free: sem backup diário (recomenda `db dump`); PITR a partir de ~US$ 100/mês [P2] | Alta |
| **Neon** | Sim (`aws-sa-east-1`, só Postgres) [N1] | Não hospeda app | Free: 1 GB, 100 CU-h/mês; Launch: US$ 0,106/CU-h + US$ 0,35/GB-mês, **sem mínimo** [N2] | **Sim**: "Neon doesn't pause Free projects for inactivity"; a computação suspende após 5 min (cold start) [N2] | Não | Free: histórico de 6 h; Launch: até 7 dias [N2] | Alta |
| **Vercel** | Sim (`gru1`) [V1] | Hobby grátis (região única); Pro US$ 20/usuário-mês [V2][V3] | — (não tem Postgres próprio em SP; pesquisado só o Neon) | Hobby; uso comercial **não confirmado** | Não pesquisado | — | Alta (região) |
| **Railway** | **Não** (EUA, Holanda, Singapura) [R1] | — | — | — | — | — | Alta |
| **Render** | **Não** (EUA, Frankfurt, Singapura) [R2] | — | — | — | — | — | Alta |
| **AWS EC2** | Sim (`sa-east-1`) | t4g.nano (2 vCPU, 0,5 GB) **US$ 0,0067/h ≈ US$ 4,89**; t4g.micro ≈ US$ 9,78; t3.micro ≈ US$ 12,26 [A1] | Postgres na própria VM (sem custo extra) ou RDS (não pesquisado) | Free Tier novo: US$ 100 a 200 em créditos por 6 meses, e **a conta fecha** depois disso no plano Free [A4] | cron do SO ou EventBridge (não pesquisado) | Por conta do operador (snapshots EBS, não pesquisados) | Alta (computação); disco e IPv4 não confirmados |
| **AWS Lightsail** | Sim (São Paulo) [A5] | **US$ 5** (0,5 GB, 2 vCPU, 20 GB SSD, IPv4) ou US$ 3,50 só IPv6; em SP, metade da franquia de tráfego [A2] | Banco gerenciado a partir de **US$ 15** (1 GB, 40 GB) [A2] | Não confirmado (a página remete ao Free Tier) | cron do SO | Snapshots a US$ 0,05/GB-mês [A2] | Alta |
| **Oracle Cloud** | Sim (`sa-saopaulo-1`; também `sa-vinhedo-1`) [O2] | **Always Free**: 2 VMs AMD (1 GB) ou Ampere A1 com 2 OCPU/12 GB, só na região "home" [O1] | Postgres na VM; o Always Free gerenciado é só Autonomous DB (Oracle), NoSQL e MySQL HeatWave [O1] | Grátis, mas "Idle Always Free compute instances may be reclaimed" (7 dias com CPU p95, rede e memória abaixo de 20%) e pode faltar capacidade ("out of host capacity") [O1] | cron do SO | Por conta do operador | Alta |
| **Magalu Cloud** (BR) | Sim: regiões BR-SE1 e BR-NE1 [M2] | **Não confirmado** (calculadora só em JS) [M1] | DBaaS com PostgreSQL [M2]; preço não confirmado | "créditos iniciais" [M1] | Não pesquisado | Snapshots diários automáticos [M3] | Baixa |
| **Firestore** | Sim (`southamerica-east1`) [G7] | — | Saiu (banco decidido: Postgres). 1 GiB grátis em um banco por projeto [G8] | — | — | — | Alta |

Notas:
- **Cloud SQL**:
  - a tabela de São Paulo traz duas linhas de SSD, US$ 0,255 e US$ 0,51/GB-mês. Pelo padrão da página, US$ 0,255 deve ser o Enterprise e US$ 0,51 o HA. **(inferência; Média)**
  - o mínimo de 10 GB de disco não foi confirmado nesta rodada.
  - "IPv4 addresses while idle" custa US$ 10,95/mês e se aplica à instância parada [G1].
  - instâncias shared-core (db-f1-micro e db-g1-small) "are not covered by the Cloud SQL SLA" [G1].
  - **Total mínimo estimado: cerca de US$ 14 a 15/mês, ou R$ 81 a 87.** **(inferência)**
- **Backup do Cloud SQL fora do Brasil**: o local padrão é "Multi-region (default)". Dá para fixar `--backup-location`. "Backups taken in the same region as the instance always succeed" [G6]. A página não diz qual multirregião vale para `southamerica-east1`. **Fixar `southamerica-east1` deve entrar na spec.** **(inferência)**
- **Cloud Run**:
  - preço em São Paulo: CPU US$ 0,0000336/vCPU-s e memória US$ 0,0000035/GiB-s, com cobrança por requisição [G2];
  - free tier: "First 180,000 vCPU-seconds", "360,000 GiB-seconds" e "2 million requests" por mês, aplicado "as a spending based discount using Tier 1 pricing" [G2];
  - **com cerca de 30 usuários, o Cloud Run deve ficar em US$ 0** **(inferência)**;
  - escalar a zero dá cold start;
  - o free tier de saída de dados vale só para a América do Norte (1 GiB) [G2].
- **Fly.io**: a página de preço traz no código um fator por região, e `gru` tem `markup: 1.615384615` sobre os preços de iad/ewr [Y1]. Multipliquei esse fator pelos preços publicados (US$ 2,19 e US$ 3,69). **(inferência; Média)** Saída para a internet na América do Sul: US$ 0,04/GB. Não confirmei se o Managed Postgres também tem fator de região.
- **Vercel**:
  - função padrão em `iad1`; dá para fixar `gru1`; Hobby: "Single region" [V2];
  - o failover entre regiões é só do Enterprise [V2];
  - a CDN tem 126 PoPs no mundo [V1].
  - Para "app num só processo Hono + SPA", a Vercel muda o modelo (funções). **(inferência)**
- **Supabase**: além de pausar no Free, o banco não hospeda o servidor Hono, que precisaria de outro host em São Paulo. Só o banco no Supabase Pro + app noutro lugar já passa de US$ 25. **(inferência)**
- **DPA e região do suporte**: não pesquisados nesta rodada, exceto o que já está em [pesquisa-sms-otp.md](pesquisa-sms-otp.md) (Google com BR SCCs; AWS e Supabase só com SCC da UE).

## 5. Armazenamento de objeto (fotos) em São Paulo

Contexto: fotos sem URL pública e sem CDN.

| Opção | Local | Preço Standard | Free tier em SP | Observação | Confiança |
|---|---|---|---|---|---|
| **GCS** `southamerica-east1` | São Paulo | **US$ 0,035/GB-mês** [G3] | **Não**: "Always Free quotas apply to usage in US-WEST1, US-CENTRAL1, and US-EAST1" [G3] | Firebase Storage grátis só nessas regiões [F8] | Média (extraído do HTML) |
| **S3** `sa-east-1` | São Paulo | **US$ 0,0405/GB-mês** (primeiros 50 TB) [A3] | Só os créditos do Free Tier novo [A4] | Operações e saída não pesquisadas | Alta (JSON oficial) |
| **Supabase Storage** | Origem "in the same region as your project" [P4] | Free: 1 GB; Pro: 100 GB incluídos, depois US$ 0,0213/GB [P1] | Free (mas o projeto pausa) | "All assets uploaded to Supabase Storage are cached on a Content Delivery Network"; provedor e PoPs não informados [P4]. **Conflita com "sem CDN"** **(inferência)**. Objetos não entram no backup do banco [P2] | Alta |
| **Cloudflare R2** | **Sem Brasil**: location hints `wnam`, `enam`, `weur`, `eeur`, `apac` e `oc`; jurisdições `eu`, `fedramp` e `us`. "Location Hints are a best effort and not a guarantee" [C1] | US$ 0,015/GB-mês; saída grátis [C2] | 10 GB-mês grátis [C2] | **Fora da restrição** | Alta |
| **Oracle Object Storage** | Região home (São Paulo, se for a escolhida) | — | 20 GB Always Free [O1] | — | Alta |

- Para cerca de 1 GB, GCS e S3 custam menos de US$ 0,05/mês de armazenamento. **(inferência)**
- Servir as fotos pela própria app (ou por URL assinada curta) evita CDN. A URL assinada direta do bucket entrega a partir de São Paulo. **(inferência)**

## 6. Remoção de EXIF com sharp (Node)

- **Padrão**: "By default all metadata will be removed, which includes EXIF-based orientation" (`toFile`/`toBuffer`). Sem `keepMetadata`, o padrão é "strip all metadata, including the removal of any ICC profile" [S1]. **Alta.**
- **Opções para manter metadado** (o Passaly não deve usá-las) [S1]:
  - `keepMetadata()`: "Keep all metadata (EXIF, ICC, XMP, IPTC)";
  - `keepExif()`: mantém todo o EXIF;
  - `withMetadata()`: "Keep most metadata (EXIF, XMP, IPTC)", converte para sRGB e permite ajustar a orientação.
- **Orientação** [S2][S3]:
  - `autoOrient()`: "Auto-orient based on the EXIF `Orientation` tag, then remove the tag". "Only the EXIF `Orientation` tag is considered" (o XMP `tiff:Orientation` fica de fora);
  - `rotate()` sem ângulo chama `.autoOrient()` "For backwards compatibility";
  - também há a opção do construtor `autoOrient: true` (padrão `false`).
  - **Alta.**
- **Leitura**: chamar `autoOrient()` (ou `rotate()`) antes de re-encodar, sem `keep*`/`with*`. A foto sai na orientação certa e sem GPS, modelo ou data do EXIF. **(inferência)** Versão mais recente no changelog da doc: v0.35.5 (27/09/2026) [S1].

## 7. Lacunas e perguntas abertas para o grill

1. **Firebase × Twilio para o código de verificação**:
   - o Firebase obriga reCAPTCHA no navegador, processa nos EUA e só dá limite próprio com Identity Platform + blocking function;
   - a Twilio Verify dá limite próprio e envio pelo servidor, mas custa cerca de 5 vezes mais por login (US$ 0,11 contra US$ 0,02).
   - Qual pesa mais: controle e simplicidade, ou preço?
2. Com Firebase: o `BLOCK` da `beforeSmsSent` funciona sem o SMS defense? Testar num projeto de teste.
3. Telefone no ID token (`phone_number`): confirmar na referência. Alternativa sem depender da claim: `getAuth().getUser(uid)` / `getUserByPhoneNumber` [F17].
4. Cloud SQL: fixar o backup em `southamerica-east1`; confirmar o disco mínimo e qual linha de SSD vale para Postgres Enterprise.
5. Fly: confirmar o preço de Machine e de MPG em `gru` no painel (calculei pelo fator de região).
6. AWS EC2: preço de EBS gp3 e de IPv4 público em sa-east-1 (não lidos).
7. Magalu Cloud: preço só no console ou na calculadora; e DPA/LGPD (provedor brasileiro).
8. Vercel Hobby: há proibição de uso comercial? Não achei o texto.
9. Emulador do Firebase Auth para telefone: não pesquisado.
10. Onde o reCAPTCHA processa os dados: não encontrado.

## 8. Fontes (acesso em 2026-11-18)

Firebase / Identity Platform / reCAPTCHA:
- [F1] Identity Platform REST, `accounts.sendVerificationCode`. https://docs.cloud.google.com/identity-platform/docs/reference/rest/v1/accounts/sendVerificationCode
- [F2] Firebase, Authenticate with Firebase with a Phone Number (Web). https://firebase.google.com/docs/auth/web/phone-auth
- [F3] Firebase, Authentication limits. https://firebase.google.com/docs/auth/limits
- [F4] Firebase, Extend Firebase Authentication with blocking functions. https://firebase.google.com/docs/auth/extend-with-blocking-functions
- [F5] Firebase Functions (2nd gen) reference, `identity` (`beforeSmsSent`). https://firebase.google.com/docs/reference/functions/2nd-gen/node/firebase-functions.identity
- [F6] Identity Platform, Use SMS regions to protect your app from SMS abuse. https://docs.cloud.google.com/identity-platform/docs/admin/sms-regions
- [F7] Firebase, Cloud Functions locations. https://firebase.google.com/docs/functions/locations
- [F8] Firebase Pricing. https://firebase.google.com/pricing
- [F9] Identity Platform pricing (HTML baixado e lido). https://cloud.google.com/identity-platform/pricing
- [F10] Firebase Admin, Verify ID Tokens. https://firebase.google.com/docs/auth/admin/verify-id-tokens
- [F11] Firebase, Privacy and Security in Firebase. https://firebase.google.com/support/privacy
- [F12] Identity Platform, reCAPTCHA SMS toll fraud protection. https://docs.cloud.google.com/identity-platform/docs/recaptcha-tfp
- [F13] reCAPTCHA pricing (HTML baixado e lido). https://cloud.google.com/recaptcha/pricing
- [F14] reCAPTCHA, SMS fraud detection. https://docs.cloud.google.com/recaptcha/docs/sms-fraud-detection
- [F15] reCAPTCHA / Fraud Defense FAQ (papel de operador a partir de 02/04/2026). https://docs.cloud.google.com/recaptcha/docs/faq
- [F17] Firebase Admin, Manage Users (`deleteUser`, `getUserByPhoneNumber`). https://firebase.google.com/docs/auth/admin/manage-users
- [F16] Identity Platform, Customizing the authentication flow using blocking functions. https://docs.cloud.google.com/identity-platform/docs/blocking-functions

Twilio:
- [T1] Twilio, Verify pricing. https://www.twilio.com/en-us/verify/pricing
- [T2] Twilio Docs, Verify Service Rate Limits (Programmable Rate Limits). https://www.twilio.com/docs/verify/api/programmable-rate-limits
- [T3] Twilio Docs, Verify Fraud Guard. https://www.twilio.com/docs/verify/preventing-toll-fraud/sms-fraud-guard
- [T4] Twilio, SMS pricing Brazil. https://www.twilio.com/en-us/sms/pricing/br
- [T5] Twilio, Brazil SMS guidelines. https://www.twilio.com/en-us/guidelines/br/sms
- [T6] **[índice de busca]** Twilio Support, short code lease prices (403 no acesso direto). https://support.twilio.com/hc/en-us/articles/226460288

Google Cloud:
- [G1] Cloud SQL pricing (tabela "Sao Paulo (southamerica-east1)" extraída do HTML). https://cloud.google.com/sql/pricing
- [G2] Cloud Run pricing (idem). https://cloud.google.com/run/pricing
- [G3] Cloud Storage pricing (idem; Always Free). https://cloud.google.com/storage/pricing
- [G4] Cloud Scheduler pricing. https://cloud.google.com/scheduler/pricing
- [G5] Cloud Scheduler locations. https://docs.cloud.google.com/scheduler/docs/locations
- [G6] Cloud SQL for PostgreSQL, About backups e Configure backups (local padrão "Multi-region"). https://docs.cloud.google.com/sql/docs/postgres/backup-recovery/backups ; https://docs.cloud.google.com/sql/docs/postgres/backup-recovery/backing-up
- [G7] Firestore locations. https://docs.cloud.google.com/firestore/docs/locations
- [G8] Firestore pricing. https://cloud.google.com/firestore/pricing

AWS:
- [A1] AWS Price List (JSON da página de EC2 On-Demand, "South America (Sao Paulo)", Linux; publicado em 17/11/2026). https://b0.p.awsstatic.com/pricing/2.0/meteredUnitMaps/ec2/USD/current/ec2-ondemand-without-sec-sel/South%20America%20(Sao%20Paulo)/Linux/index.json
- [A2] Amazon Lightsail pricing. https://aws.amazon.com/lightsail/pricing/
- [A3] AWS Price List (JSON da página de S3; publicado em 18/11/2026). https://b0.p.awsstatic.com/pricing/2.0/meteredUnitMaps/s3/USD/current/s3.json
- [A4] AWS Free Tier. https://aws.amazon.com/free/
- [A5] Lightsail, Regions and Availability Zones. https://docs.aws.amazon.com/lightsail/latest/userguide/understanding-regions-and-availability-zones-in-amazon-lightsail.html

Fly.io:
- [Y1] Fly.io Resource Pricing (inclui a tabela de fator por região no código da página). https://docs.fly.io/about/pricing
- [Y2] Fly.io Managed Postgres. https://docs.fly.io/postgres/
- [Y3] Fly.io Regions. https://docs.fly.io/reference/regions
- [Y4] flyctl `fly machine run` (`--schedule`). https://docs.fly.io/machines/flyctl/fly-machine-run/

Supabase / Neon / Vercel / Railway / Render:
- [P1] Supabase Pricing. https://supabase.com/pricing
- [P2] Supabase Docs, Database Backups. https://supabase.com/docs/guides/platform/backups
- [P3] Supabase Docs, Available regions. https://supabase.com/docs/guides/platform/regions
- [P4] Supabase Docs, Storage CDN fundamentals; Storage overview. https://supabase.com/docs/guides/storage/cdn/fundamentals ; https://supabase.com/docs/guides/storage
- [P5] Supabase Docs, Cron. https://supabase.com/docs/guides/cron
- [N1] Neon Docs, Regions. https://neon.com/docs/introduction/regions
- [N2] Neon Pricing. https://neon.com/pricing
- [V1] Vercel Docs, Global network and regions. https://vercel.com/docs/regions
- [V2] Vercel Docs, Configuring regions for Vercel Functions. https://vercel.com/docs/functions/configuring-functions/region
- [V3] Vercel Docs, Hobby plan; Fair Use Guidelines. https://vercel.com/docs/plans/hobby ; https://vercel.com/docs/limits/fair-use-guidelines
- [R1] Railway Docs, Deployment regions. https://docs.railway.com/reference/deployment-regions
- [R2] Render Docs, Regions. https://render.com/docs/regions

Oracle / Magalu / Cloudflare:
- [O1] OCI, Always Free Resources. https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm
- [O2] OCI, Regions and Availability Domains. https://docs.oracle.com/en-us/iaas/Content/General/Concepts/regions.htm
- (403, não lido) Oracle, Public cloud regions. https://www.oracle.com/cloud/public-cloud-regions/
- [M1] Magalu Cloud, Preços (calculadora carregada por JS; sem valores no HTML). https://magalu.cloud/precos/
- [M2] **[secundária]** Apresentação "Histórico Magalu Cloud", Nic.br (2025): regiões BR-NE1 e BR-SE1; DBaaS com MySQL, PostgreSQL e SQL Server. https://minhaagenda.cursoseventos.nic.br/files/apresentacao/arquivo/2093/Historico%20Magalu%20Cloud%20-%20Nic.br%20(2025).pdf
- [M3] **[índice de busca]** IT Forum, "Magalu Cloud amplia portfólio de infraestrutura" (snapshots diários no DBaaS). https://itforum.com.br/?p=9615863
- [C1] Cloudflare R2, Data location. https://developers.cloudflare.com/r2/reference/data-location/
- [C2] Cloudflare R2, Pricing. https://developers.cloudflare.com/r2/pricing/

sharp:
- [S1] sharp, Output options. https://sharp.pixelplumbing.com/api-output
- [S2] sharp, Image operations (`rotate`, `autoOrient`). https://sharp.pixelplumbing.com/api-operation
- [S3] sharp, Constructor (`autoOrient`). https://sharp.pixelplumbing.com/api-constructor

Outras:
- [X1] Banco Central do Brasil, PTAX (API Olinda), dólar de 18/11/2026 (venda 5,8102). https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='11-10-2026'&@dataFinalCotacao='11-18-2026'&$format=json
