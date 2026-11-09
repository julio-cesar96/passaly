# Pesquisa: validade e código de barras (EAN/GTIN) no pacote de fralda descartável

- Data da pesquisa / acesso às fontes: 2026-11-09
- Pergunta: dá para usar dados do pacote de fralda descartável (validade, código de barras) no anúncio do Passaly?
- Método: leitura de textos normativos da Anvisa (Anvisalegis, BVS/MS), do GTIN Management Standard da GS1 (PDF oficial em ref.gs1.org), do dataset oficial de Application Identifiers da GS1, de páginas da GS1 Brasil e da GS1 global (suporte) e de páginas de fabricante. Fontes secundárias estão marcadas como **[secundária]**.
- Legenda de confiança: **Alta** (li o texto primário), **Média** (fonte primária parcial ou fonte secundária consistente), **Baixa** (só fonte secundária ou relato), **Não confirmado**.

## Resumo (respostas diretas)

- **Validade no pacote é obrigatória no Brasil.** Fralda descartável **não** é cosmético Grau 1/Grau 2. É "produto de higiene pessoal descartável" (absorvente descartável de uso externo), regido pela **RDC Anvisa nº 640/2022** (vigente), que revogou a RDC 142/2017. O Anexo III da RDC 640 exige na rotulagem **lote ou partida** e **prazo de validade** ("exceto nos casos que a norma dispense"; para fraldas não achei dispensa). (Alta)
- **A RDC 752/2022 (cosméticos) não se aplica a fraldas.** Ela trata de "preparações" (cremes, xampus etc.), e fralda não aparece nas listas de Grau 1 nem de Grau 2. Além disso, segundo a própria Anvisa, a norma geral de cosméticos hoje é a RDC 907/2024. (Alta, quanto a fralda não estar nas listas)
- **O prazo de validade impresso precisa ter base em estudo de estabilidade.** Há decisão da Anvisa que mantém autuação de fabricante de fralda (Viva Mix/Embrafral) que imprimia **3 anos** de validade sem estudo que comprovasse esse prazo. (Alta)
- **Prazo típico declarado pelos fabricantes no Brasil: não confirmado.** Não achei página oficial brasileira de Pampers, Huggies, MamyPoko ou Turma da Mônica com o prazo. Referências encontradas: a Pampers UK (site oficial) recomenda usar em até **3 anos da fabricação** e em até 12 meses depois de aberto; o caso Viva Mix mostra 3 anos no rótulo. (Média para a ordem de grandeza de "~3 anos"; Não confirmado por marca no Brasil)
- **Onde fica impresso e em que formato: não confirmado** por fonte oficial brasileira. A regra só exige lote e validade na embalagem, sem dizer onde. A Pampers UK diz que o "production code" indica o ano de fabricação pelo primeiro dígito (ex.: 4 = 2024), mas isso é do Reino Unido.
- **O EAN-13 identifica o item comercial, não a unidade física.** Pelo GTIN Management Standard, mudar o **conteúdo líquido declarado** (o próprio padrão dá o exemplo de **fralda de 14 para 12 unidades**) ou a **marca principal** exige **novo GTIN**. Produto novo (por exemplo, outro tamanho P/M/G, que é outro item à venda) também recebe GTIN próprio. (Alta para quantidade e marca; Média para "tamanho = GTIN diferente", que decorre da regra de "produto novo" e não de uma regra específica)
- **O EAN-13 não contém lote nem validade.** Lote e validade são codificados por Application Identifiers da GS1, **(10) lote** e **(17) validade** (AAMMDD), além de (11) data de produção, em símbolos como GS1-128 ou GS1 DataMatrix. Pacote de fralda no varejo normalmente traz só o EAN-13. (Alta para os AIs; Média para "o pacote de fralda só tem EAN-13", que não verifiquei fisicamente)
- **Bases consultáveis:** o **Verified by GS1** (GS1 global e GS1 Brasil, alimentado pelo Cadastro Nacional de Produtos/CNP) retorna nome da empresa, marca, descrição, categoria (GPC), URL da imagem, **conteúdo líquido e unidade de medida** e país de venda. O CCG da Sefaz (NT 2022.001) retorna descrição, NCM e CEST. O Cosmos (Bluesoft) retorna descrição, marca, imagem, GPC/NCM e dados de embalagem (só por fonte secundária). Nenhuma delas tem validade ou lote. (Média/Alta, ver seção 2.4)

## 1. Validade no pacote de fralda

### 1.1 Enquadramento regulatório: fralda não é cosmético Grau 1

- A **RDC nº 640, de 24/03/2022** (DOU de 30/03/2022, em vigor desde 02/05/2022, marcada como "Vigente" no Anvisalegis) "dispõe sobre a regularização de produtos de higiene pessoal descartáveis destinados ao asseio corporal, que compreendem escovas e hastes para higiene bucal, fios e fitas dentais, absorventes higiênicos descartáveis, coletores menstruais e hastes flexíveis". **Confiança: Alta.** [F1]
- Art. 27, parágrafo único: "Os absorventes higiênicos femininos de uso externo, **as fraldas para bebês**, as fraldas para adultos, os absorventes higiênicos para incontinência e os absorventes de leite materno estão compreendidos no grupo" dos absorventes descartáveis de uso externo. **Alta.** [F1]
- Art. 3º: os produtos descartáveis são **isentos de registro**, e sua comercialização depende de **comunicação prévia** eletrônica à Anvisa. **Alta.** [F1]
- Art. 51: revoga a RDC 142/2017 e a RDC 178/2017. A RDC 142/2017 tinha o mesmo conteúdo (fraldas no art. 28, mesmo Anexo III). A página da Anvisa "Produtos descartáveis" ainda cita a RDC 142/2017, ou seja, está desatualizada. **Alta.** [F1][F2][F3]
- A **RDC 752/2022** define cosmético/higiene pessoal como "preparações constituídas por substâncias naturais ou sintéticas, de uso externo [...]". As listas de Grau 1 e Grau 2 do Anexo I **não incluem fralda**. Os itens infantis mais próximos são "Lenços umedecidos para higiene infantil" (Grau 2) e "Lenço umedecido" (Grau 1). **Alta.** [F4]
- A página da Anvisa (em inglês) sobre cosméticos indica a **RDC 907/2024** como a norma geral vigente de cosméticos e lista a RDC 640/2022 à parte, para descartáveis. Não li a RDC 907/2024; o que se afirma dela vem da página da Anvisa. **Média.** [F5]

### 1.2 Obrigatoriedade de validade e lote

- RDC 640/2022, art. 11: "Os produtos descartáveis devem atender a rotulagem obrigatória geral de acordo com os itens elencados no Anexo III." **Alta.** [F1]
- O Anexo III da RDC 640/2022 traz entre os itens obrigatórios: 2 **Marca**, 4 **Lote ou Partida**, 5 **Prazo de validade (exceto nos casos que a norma dispense)**, 6 **Conteúdo**, 8 Titular e CNPJ, 14 Canal de comunicação com o consumidor. Na RDC 142/2017 (revogada, mesmo conteúdo), o anexo dizia que lote e validade iam na embalagem "Primária e Secundária" e que, sem embalagem secundária, tudo vai na primária. A versão da RDC 640 que li no Anvisalegis não mostra a coluna de embalagem, e não verifiquei se ela foi mantida. **Alta** para obrigatoriedade; **Média** para "primária e secundária" na norma atual. [F1][F2]
- As únicas dispensas de validade que achei na RDC 640 são para **escovas e hastes de higiene bucal**: "indicação de que o produto não é perecível, em substituição à indicação do prazo de validade". No capítulo de absorventes/fraldas não achei dispensa. **Alta.** [F1]
- A RDC 640/2022 também exige que o titular apresente "Dados de estabilidade: metodologia e conclusões que garantem o prazo de validade declarado, quando aplicável" e informe o "Sistema de codificação de lote" (Anexo I). **Alta.** [F1]
- **Fiscalização:** a Decisão Anvisa 1866515 (processo SEI 25351.900013/2022-45) manteve auto de infração contra a Embrafral por fabricar e vender as "Fraldas Descartáveis Viva Mix" sem estudo de estabilidade que comprovasse "o alegado **prazo de validade de três anos**" impresso no rótulo. **Alta.** [F6]
- **CDC, art. 31** (Lei 8.078/1990): a oferta e a apresentação de produtos devem trazer informações "corretas, claras, precisas, ostensivas e em língua portuguesa" sobre, entre outros, "prazos de validade e origem". O art. 18, §6º, I, considera impróprios ao uso e consumo os produtos com prazo de validade vencido. O site do Planalto bloqueou acesso automatizado, então confirmei o texto por transcrições **[secundária]**. **Média-Alta.** [F7][F8]
  - Observação: o CDC se aplica a relações de consumo (fornecedor × consumidor). Se ele se aplica a doação ou troca entre pessoas físicas na plataforma, ou à própria plataforma, é questão jurídica **não analisada** aqui.
- **INMETRO:** não achei regulamento do Inmetro específico para fralda. Existe regra geral de indicação quantitativa de pré-medidos (Portaria Inmetro 249/2021 consolidada, segundo fonte secundária), mas não verifiquei o que ela diz sobre fraldas. **Não confirmado.** [F9]

### 1.3 Prazo típico declarado pelos fabricantes

| Marca | O que encontrei | Fonte | Confiança |
|---|---|---|---|
| Pampers (P&G), **Reino Unido** | "Unopened nappies: can be used for up to 3 years from the manufacturing date"; "Opened nappies: best used within 12 months of opening"; diz que fralda "não tem data de validade estrita" (no mercado do Reino Unido) | [F10] site oficial pampers.co.uk | Alta para o Reino Unido; **não vale como regra para o rótulo brasileiro** |
| Pampers Brasil | Página oficial com prazo não encontrada | — | Não confirmado |
| Huggies (Kimberly-Clark) Brasil | Varejista cita atendimento da Huggies informando "2 anos" | [F11] **[secundária]** | Baixa |
| MamyPoko, Turma da Mônica (hoje Ontex, segundo varejista), Personal | Nada oficial encontrado | — | Não confirmado |
| Viva Mix (Embrafral) | Rótulo com validade de 3 anos (dado da decisão da Anvisa) | [F6] | Alta (para essa marca e época) |
| Turma da Mônica Tripla Proteção (Kimberly-Clark, 2018) | Notícia da suspensão de 79 lotes cita lotes "com validade até setembro de 2018" | [F12] **[secundária]** | Baixa |

Conclusão: a ordem de grandeza de **~2 a 3 anos a partir da fabricação** aparece em várias fontes, mas **não há confirmação oficial por marca no Brasil**. Cada pacote traz a data impressa, e é ela que vale.

### 1.4 Onde fica impresso e em que formato

- A regra exige lote e validade na rotulagem, mas **não define posição nem formato** (lateral, fundo, data de fabricação + validade). **Alta** (pela ausência no texto da RDC 640). [F1]
- Posição e formato reais nos pacotes brasileiros (por exemplo, "FAB/VAL/L" na lateral ou no fundo): **não confirmado**. Não achei fonte oficial de fabricante e não inspecionei embalagens.
- A Pampers UK diz que o "production code" indica o ano de fabricação pelo primeiro dígito (ex.: "4 = 2024"). **Alta** para o Reino Unido; não confirmado para o Brasil. [F10]
- Relatos de consumidores dizem que o SAC da Pampers pede a validade/lote do pacote em reclamações **[secundária]**. **Baixa.** [F13]

## 2. O que o EAN-13 (GTIN) identifica

### 2.1 GTIN = item comercial

- A GS1 Brasil define o GTIN como o número que "serve para identificar de forma única um produto" e o EAN-13 como o tipo de GTIN "mais comum [...] amplamente utilizado para identificar produtos vendidos no varejo". **Alta.** [F14][F15]
- **GTIN Management Standard** (GS1, Release 1.1, ratificado em set/2023):
  - **2.1 New product introduction:** "Any new product requires the assignment of a new GTIN". O GTIN é atribuído no nível da unidade de consumo, com GTINs próprios nos níveis superiores (caixa, palete). **Alta.** [F16]
  - **2.3 Declared net content:** "Any change (increase or decrease) to the legally-required declared net content that is printed on the pack, requires assignment of a new GTIN". Conteúdo líquido inclui "net weight, volume, **count**, units". O exemplo oficial é "**The declared number of diapers in a package of disposable diapers changes from a 14 to a 12 count**". **Alta.** [F16]
  - **2.6 Primary brand:** "A change to the primary brand that appears on the trade item, requires assignment of a new GTIN". **Alta.** [F16]
  - **1.3:** regulações locais prevalecem e podem exigir mais trocas de GTIN. O padrão é um mínimo, e o dono da marca pode trocar o GTIN com mais frequência (1.4). **Alta.** [F16]
- **Tamanho (P/M/G/XG):** o padrão não tem regra específica de "tamanho" para fralda. Cada tamanho é um item comercial distinto à venda, então pela regra de produto novo/distinção (princípio 1.1: "Is a consumer [...] expected to distinguish [...]?") recebe GTIN próprio. Registros públicos de GTIN mostram fraldas Huggies com tamanho na descrição (ex.: "Fralda descartável huggies (tamanho m)") **[secundária]**. **Média.** [F16][F17]
- Daí: **um GTIN corresponde a marca + linha/variante + tamanho + quantidade de unidades do pacote**, mas não a um pacote físico específico. **Média-Alta** (inferência direta das regras acima).

### 2.2 O EAN-13 não contém lote nem validade

- O símbolo EAN-13 codifica só o GTIN-13. Dados variáveis vão em **GS1 Application Identifiers**. O dataset oficial da GS1 define: **(01)** GTIN; **(10)** "Batch or lot number" (até 20 caracteres alfanuméricos); **(11)** "Production date (YYMMDD)"; **(15)** "Best before date (YYMMDD)"; **(17)** "Expiration date (YYMMDD)". A GS1 diz que os AIs servem para incluir "product data beyond the GTIN, such as the batch/lot number, serial number, best before date and expiration date". **Alta.** [F18]
- A GS1 Brasil cita GS1-128, GS1 DataMatrix e QR Code padrão GS1 como portadores que vão além do GTIN (por exemplo, no setor de medicamentos). **Média** (o material didático da GS1 Brasil sobre GS1-128 não pôde ser baixado; a informação veio da página da GS1 Brasil e de resumo de busca). [F15][F19]
- Se pacotes de fralda vendidos no Brasil trazem DataMatrix ou GS1-128 com (10)/(17): **não confirmado**. Não há obrigação para fraldas na RDC 640 (a exigência de DataMatrix com lote e validade que conheço é de medicamentos/rastreabilidade, fora do escopo).
- Também **não confirmado**: se o QR Code padrão GS1 (GS1 Digital Link) já aparece em fraldas no Brasil.

### 2.3 Bases públicas consultáveis de GTIN

| Base | Acesso | O que retorna | Tem validade/lote? | Fonte | Confiança |
|---|---|---|---|---|---|
| **Verified by GS1** (global) | Busca no site; a página da GS1 Brasil a descreve como gratuita | **Empresa:** nome do licenciado, dados da licença (país). **Produto (para mais de 300 milhões de itens):** marca, descrição, categoria, URL da imagem, **conteúdo líquido e unidade de medida**, país de venda, links para outras fontes | Não | [F20] (suporte GS1) | Alta |
| **GS1 Brasil, Consulta de Dados de Produtos / Verified by GS1** (dados do **Cadastro Nacional de Produtos, CNP**) | Site gs1br.org, pelo navegador; a GS1 Brasil não tem app oficial de leitura | "nome, marca, descrição, categoria e até imagem, se disponível"; fabricante. Só GTINs registrados por associados | Não | [F15] | Alta |
| Limite de consultas gratuitas (ex.: "30 por dia") | — | — | — | blogs **[secundária]** | Não confirmado |
| API/uso comercial em massa do Verified by GS1 por terceiros (termos, custo) | — | — | — | — | **Não confirmado** (não pesquisado a fundo; precisa ver os termos de uso) |
| **CCG (Cadastro Centralizado de GTIN) / Sefaz**, NT 2022.001 | Web service para contribuintes no ambiente SVRS (exige integração; secundárias dizem que exige certificado digital) | Descrição, NCM, CEST (se houver). Só GTIN 789/790. Pode recusar se o dono da marca não autorizou a publicação | Não | [F21] **[secundária]** (o PDF da NT é imagem escaneada) | Média |
| **Cosmos (Bluesoft)** | API com token (comercial) | Descrição, marca, imagem, GPC, NCM, dados de embalagem/quantidade | Não | [F22] **[secundária]** (wrapper não oficial; o site oficial bloqueou acesso automatizado) | Baixa-Média |

- Atributos como **tamanho (P/M/G)** e **faixa de peso do bebê** não aparecem como campos estruturados no Verified by GS1. Podem aparecer só no texto da descrição. **Não confirmado.**
- A qualidade dos dados depende do dono da marca. A própria descrição do Verified by GS1 indica que os dados vêm do licenciado (a GS1 Brasil diz que eles vêm do CNP, "registradas por fabricantes e marcas"). **Média.** [F15][F20]

## 3. Implicações para o Passaly

Só o que decorre dos fatos acima, sem decisão de produto:

1. **Ler o EAN-13 pode pré-preencher marca, descrição e quantidade** (conteúdo líquido em unidades), e provavelmente o tamanho via texto da descrição, quando o GTIN estiver no Verified by GS1/CNP. Não é garantido. Os dados dependem do cadastro do dono da marca, o tamanho não é campo estruturado, e o uso em produção depende dos termos de acesso (não confirmados).
2. **O EAN-13 não dá validade nem lote.** Validade (e lote, se for útil) precisa ser **informada manualmente e/ou fotografada** pelo anunciante. O dado existe em todo pacote regular, porque a RDC 640/2022 exige validade e lote na rotulagem.
3. **O GTIN identifica o tipo de pacote, não aquele pacote.** O número de unidades do GTIN é o do pacote **fechado**. Pacote aberto ou parcial precisa de quantidade informada à parte.
4. **Pacote sem validade ou sem lote** é sinal de produto irregular perante a Anvisa (rotulagem obrigatória). Isso pode servir de critério de moderação, mas a decisão é de produto.
5. **Validade "real" vs. impressa:** a validade impressa tem respaldo em estudo de estabilidade (caso Viva Mix). A Pampers UK fala em desempenho, não em segurança, após ~3 anos. Se o Passaly aceitaria fralda vencida é decisão de produto e de segurança a tratar em `/grill-with-docs`.
6. Para o **lote** servir de checagem de recall (ex.: os 79 lotes suspensos de Turma da Mônica em 2018), o lote precisa ser **capturado** (foto ou texto). Não existe base pública de recall consultável por GTIN identificada nesta pesquisa (**não pesquisado**).

## 4. Lacunas / não confirmado

- Prazo de validade oficial por marca no Brasil (Pampers, Huggies, MamyPoko, Turma da Mônica/Ontex, Personal). Próximo passo: SAC das marcas ou foto de pacotes reais.
- Posição e formato da impressão (FAB/VAL/lote) nos pacotes brasileiros.
- Se algum pacote de fralda no Brasil traz GS1 DataMatrix, GS1-128 ou QR GS1 com AI (17).
- Termos de uso, custo e limites da consulta e da API do Verified by GS1/CNP para uso em app de terceiros.
- Texto da RDC 907/2024 (não necessário para fralda, que segue a RDC 640/2022).
- Aplicabilidade do CDC a trocas e doações entre pessoas físicas na plataforma.

## 5. Fontes (acesso em 2026-11-09)

- [F1] Anvisa. RDC nº 640, de 24/03/2022 (texto no Anvisalegis, status "Vigente"). https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&link=S&tipo=RDC&numeroAto=00000640&seqAto=000&valorAno=2022&orgao=RDC/DC/ANVISA/MS&codTipo=&desItem=&desItemFim=&cod_modulo=134&cod_menu=1696
- [F2] Anvisa. RDC nº 142, de 17/03/2017 (revogada), cópia BVS/MS. https://bvsms.saude.gov.br/bvs/saudelegis/anvisa/2017/rdc0142_17_03_2017.pdf
- [F3] Anvisa. Produtos descartáveis (página de regularização, desatualizada, cita a RDC 142/2017). https://www.gov.br/anvisa/pt-br/setorregulado/regularizacao/cosmeticos/produtos-descartaveis
- [F4] Anvisa. RDC nº 752, de 19/09/2022 (DOU 21/09/2022), cópia SES-SP/BVS. https://ses.sp.bvs.br/wp-content/uploads/2022/09/U_RS-MS-ANVISA-RDC-752_190922.pdf
- [F5] Anvisa. Personal Hygiene Products, Cosmetics and Fragrances (lista de normas aplicáveis; modificada em 06/04/2026). https://www.gov.br/anvisa/en/regulation-of-products/personal-hygiene-products-cosmetics-and-fragrances
- [F6] Anvisa. Decisão 1866515, autuada Embrafral (Fraldas Viva Mix), SEI 25351.900013/2022-45. https://bibliotecadigital.anvisa.gov.br/jspui/bitstream/anvisa/15020/1/Decis%c3%a3o_1866515.pdf
- [F7] Lei nº 8.078/1990 (CDC), texto compilado (o Planalto recusou acesso automatizado; texto conferido por transcrição). https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm
- [F8] **[secundária]** Transcrição do art. 31 do CDC (LegJur). https://www.legjur.com/legislacao/nivel/lei_00080781990/-secao-ii-da-oferta
- [F9] **[secundária]** Portaria Inmetro 157/2002 (revogada), LegisWeb. https://www.legisweb.com.br/legislacao/?id=184078
- [F10] Pampers UK (P&G, site oficial). Do nappies expire? https://www.pampers.co.uk/safety-and-commitment/nappies-and-wipes/article/do-nappies-expire
- [F11] **[secundária]** Auditório Ibirapuera. Qual o prazo de validade das fraldas? https://www.auditorioibirapuera.com.br/qual-o-prazo-de-validade-das-fraldas/
- [F12] **[secundária]** DOL. Lotes de fraldas da Turma da Mônica são suspensos. https://dol.com.br/noticias/brasil/noticia-516870-lotes-de-fraldas-da-turma-da-monica-sao-suspensos-e-tem-venda-proibida-pela-anvisa.html
- [F13] **[secundária]** Reclame Aqui. Empresa P&G (Fralda Pampers). https://www.reclameaqui.com.br/portal-das-fraldas/empresa-pg-fralda-pamperspessima-qualidade_zTer9SQ0hmH0URVc/
- [F14] GS1 Brasil. GTIN: Identificação de Produtos. https://www.gs1br.org/gtin-identificacao-de-produtos
- [F15] GS1 Brasil. Verified by GS1 / Consulta de código de barras. https://gs1br.org/hub-de-dados/bancos-de-dados-de-produtos/verified-by-gs1
- [F16] GS1. GTIN Management Standard, Release 1.1, Ratified, Sep 2023 (PDF). https://ref.gs1.org/standards/gtin-management/
- [F17] **[secundária]** Systax. GTIN 07896007543908, Fralda descartável huggies (tamanho m). https://www.systax.com.br/ean/07896007543908
- [F18] GS1. GS1 Application Identifiers (dataset JSON-LD em ref.gs1.org/ai). https://ref.gs1.org/ai/
- [F19] GS1 Brasil. Conhecendo o Código de Barras (PDF; o download falhou nesta sessão, conteúdo só via resumo de busca). https://www.gs1br.org/conteudo/materiais-tecnicos/CadernoEficiencia/Conhecendo%20o%20C%C3%B3digo%20de%20Barras.pdf
- [F20] GS1 Support. What information is available in Verified by GS1? https://support.gs1.org/support/solutions/articles/43000734119-what-information-is-available-in-verified-by-gs1-
- [F21] **[secundária]** Tecnospeed. NT 2022.001, Consulta GTIN via Web Service. https://blog.tecnospeed.com.br/nota-tecnica-2022-001-da-nf-e-nfc-e ; PDF da NT (escaneado): https://inventti.com.br/wp-content/uploads/2022/05/NT2022.001_v1.00-WS-Consulta-GTIN.pdf
- [F22] **[secundária]** Wrapper não oficial da API Cosmos (Bluesoft). https://github.com/matheuscas/bluesoft-cosmos-api
