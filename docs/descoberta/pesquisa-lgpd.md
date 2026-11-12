# Pesquisa: LGPD no protótipo do Passaly (bases legais, identificação do Anunciante, encarregado, retenção, fotos, IA e transferência internacional)

> **Aviso: isto não é parecer jurídico.** É um levantamento de fontes feito na fase de descoberta do Passaly para orientar perguntas de produto. Antes de qualquer decisão com efeito jurídico (política de privacidade, termos de uso, retenção, banimento, hospedagem), valide com advogado. A seção 13 traz as perguntas para isso.

- Data da pesquisa / acesso às fontes: 2026-11-11
- Pergunta: que obrigações da LGPD (e do Marco Civil da Internet) alcançam o protótipo do Passaly, e o que isso exige de cada dado, da retenção, das fotos, de uma IA de terceiro, da hospedagem fora do Brasil e dos textos legais (política e termos)?
- Contexto: o protótipo definido no grill ([contexto-descoberta.md](contexto-descoberta.md), "Resolvido no grill") tem cadastro só por telefone; Post de fralda com foto, tamanho, validade e bairro (sem GPS); Pedido com Ponto de encontro e horário escolhidos de listas fixas, sem chat livre (ADR 0001); confirmação da entrega pelos dois lados; contador de trocas concluídas; Denúncia que oculta o Post, com revisão manual do fundador e possível banimento. Nenhum dado de criança é coletado. O ADR 0004 exige que cada Anunciante seja identificável. Hospedagem provável: banco em São Paulo e aplicação nos EUA. O projeto é de pessoa física, pequeno e sem receita. A pesquisa [pesquisa-cdc-doacao-troca-pf.md](pesquisa-cdc-doacao-troca-pf.md) apontou o dever de "manter condições de identificar cada um de seus anunciantes" (REsp 2.067.181).
- Método: as leis foram lidas no portal de legislação da **Câmara dos Deputados**, na versão "norma atualizada" (o Planalto recusa acesso automatizado). Resoluções e o enunciado da ANPD foram lidos no gov.br/anpd ou no DOU (in.gov.br), e os guias da ANPD nos PDFs oficiais. A jurisprudência do STJ veio do Informativo e da série Jurisprudência em Teses, no site do STJ. Fontes secundárias estão marcadas como **[secundária]**.
- Legenda de confiança: **Alta** (li o texto primário), **Média** (fonte primária parcial ou secundária consistente), **Baixa** (só secundária), **Não confirmado**. Quando a conclusão é minha leitura dos textos, e não algo que a fonte diz, aparece marcada como **(inferência)**.

> **Mudanças recentes que afetam o tema** (todas lidas no texto consolidado):
> - A Lei nº 15.352, de 25/02/2026 (conversão da MP 1.317/2025), renomeou a ANPD para **Agência** Nacional de Proteção de Dados (LGPD art. 5º, VIII e XIX). [L1]
> - O **Decreto nº 12.975, de 20/05/2026** (em vigor 60 dias após a publicação de 21/05/2026), acrescentou ao Decreto 8.771/2016 um capítulo de deveres dos provedores de aplicação: canal de denúncia, notificação e contestação, termos de uso com "devido processo", entre outros. Também atribuiu à ANPD a fiscalização desses deveres (art. 19-A). [L3]
> - A Resolução CD/ANPD nº 32/2026 reconheceu a **União Europeia** como adequada para transferência internacional. Não há decisão de adequação para os **EUA** na lista de normas da ANPD. [A6]

## Resumo (respostas diretas)

0. **A LGPD se aplica ao Passaly, mesmo sendo de pessoa física e sem receita.** A exceção do art. 4º, I, exige tratamento "para fins **exclusivamente particulares e não econômicos**". Uma plataforma aberta ao público, que trata dados de terceiros desconhecidos, não é particular. A própria ANPD inclui "pessoas naturais [...] assumindo obrigações típicas de controlador" entre os agentes de pequeno porte (Res. 2/2022, art. 2º, I) e trata como caso diferente o uso "exclusivamente particular" (art. 1º, parágrafo único). O fundador, pessoa natural, é o **controlador**. (Alta para os textos; o enquadramento é **(inferência)** com confiança Alta.)

1. **Bases legais (art. 7º):**
   - **Telefone** (cadastro, login e contato do Pedido): **execução de contrato** (art. 7º, V), porque os termos de uso são o contrato.
   - **Foto, tamanho, validade e bairro do Post**, e **Pedidos e entregas** (incluindo o contador de trocas): execução de contrato.
   - **Denúncia e moderação**: **legítimo interesse** (art. 7º, IX), com teste de balanceamento registrado. Também pode valer o **exercício regular de direitos** (art. 7º, VI) quando houver disputa.
   - **Registro de banimento** e **logs de IP**: legítimo interesse (segurança dos usuários e prevenção de fraude) e exercício regular de direitos.
   - **Consentimento** não é a base recomendada para nada disso, porque é revogável a qualquer momento. (Média; **(inferência)** a partir dos arts. 7º, 8º e 10 e do guia de legítimo interesse.)

2. **"Identificável" (ADR 0004):** o STJ fixou que "os provedores de aplicações de internet **não são obrigados a guardar e fornecer dados pessoais dos usuários**, pois a apresentação dos registros de número IP [...] é suficiente para sua identificação" (Jurisprudência em Teses 223, tese 2; REsp 1.829.821). O mínimo defensável é **telefone verificado + registros de IP, porta lógica e data/hora** do cadastro e das ações relevantes (Post, Pedido, Denúncia). Com a ordem judicial, o IP e o telefone levam à operadora, que tem os dados cadastrais. CPF, documento e selfie não são necessários e seriam difíceis de justificar pelo art. 6º, III. (Alta para a tese; aplicar ao Passaly é **(inferência)**, Média-Alta.)

3. **Encarregado (DPO):** **não é obrigatório** para agente de pequeno porte, e a pessoa natural está incluída (Res. CD/ANPD 2/2022, arts. 2º, I, e 11). Mas é preciso **manter um canal de comunicação com o titular** (art. 11, §1º). Em compensação, o agente de pequeno porte tem registro de operações simplificado (art. 9º), política de segurança simplificada (art. 13) e **prazos em dobro** (art. 14). O benefício **cai** se houver **tratamento de alto risco**, que exige ao mesmo tempo um critério geral e um específico (arts. 3º e 4º). O protótipo sem IA, pela minha leitura, não é de alto risco. Uma IA de terceiro analisando fotos pode passar a ser (tecnologia emergente somada a afetar o uso do serviço). Continuam valendo bases legais, princípios, direitos do titular, segurança, comunicação de incidentes e registro das operações (art. 6º). (Alta para o texto; o enquadramento de alto risco é **(inferência)**.)

4. **Retenção:**
   - A LGPD não fixa prazos. Manda eliminar o dado ao fim do tratamento (arts. 15–16) e só autoriza conservar nas hipóteses do art. 16 (obrigação legal, pesquisa, transferência a terceiro ou uso exclusivo **anonimizado**).
   - O **Marco Civil, art. 15** (guarda de registros de acesso por 6 meses) **obriga só o provedor "constituído na forma de pessoa jurídica" e "com fins econômicos"**, então não alcança o Passaly hoje. Mesmo assim, o STJ diz que provedores de aplicação "têm o dever de guarda" de IP e porta lógica para identificar autores de ilícitos (Teses 223, tese 3). Guardar logs por 6 meses é o caminho prudente.
   - Quando o usuário pede exclusão, apaga-se tudo o que não tiver outra base de conservação. O ponto mais incerto é **manter o registro de banimento depois da exclusão**: o art. 16 não lista "legítimo interesse" nem "defesa" como motivos de conservação, e o Marco Civil art. 7º, X, dá direito à "exclusão definitiva" ressalvada só a guarda **obrigatória**. É pergunta para advogado.
   - (Alta para os textos; os prazos sugeridos na seção 5 são **(inferência)**.)

5. **Fotos:**
   - **Remover EXIF não é exigido por norma específica** que eu tenha encontrado. É decorrência dos princípios da necessidade e da segurança (arts. 6º, III e VII, e 46) e do dever de proteger "desde a fase de concepção" (art. 46, §2º): é boa prática forte, quase obrigatória na prática.
   - Se aparecer **criança** por acidente, isso é dado pessoal de criança (art. 14). O Enunciado CD/ANPD nº 1/2023 permite usar as bases dos arts. 7º e 11, "desde que observado e prevalecente o seu melhor interesse". Não há finalidade do Passaly que precise da imagem da criança, então a resposta coerente é **não publicar e eliminar** (pedir nova foto), e não desfocar e manter.
   - Foto comum não é dado biométrico, salvo se tratada com meios técnicos de identificação (posição citada pela ANPD a partir do RGPD).
   - (Alta para os textos; remover em vez de desfocar é **(inferência)**.)

6. **IA de terceiro:**
   - O fornecedor vira **operador** (art. 5º, VII) e deve seguir as instruções do Passaly (art. 39). Responde solidariamente se descumprir a lei ou as instruções (art. 42, §1º, I).
   - A LGPD não exige contrato escrito, mas a ANPD diz que ele "se mostra como uma boa prática". É preciso checar se o fornecedor usa as fotos para treinar modelos, o que seria finalidade dele, e não do Passaly.
   - Se o fornecedor processar no exterior, há **transferência internacional** (item 7).
   - A IA pode tornar o tratamento de **alto risco** para fins da Res. 2/2022 (item 3).
   - Se a IA **decidir sozinha** algo que afete o usuário, entra o direito de revisão do art. 20. O desenho do ADR 0002 (IA só sinaliza; humano decide) evita isso.

7. **Transferência internacional (aplicação nos EUA):**
   - Enviar dados a um servidor de um provedor nos EUA é transferência internacional (Res. 19/2024, art. 3º, III–IV). Ela precisa de uma hipótese legal **e** de um mecanismo do art. 33.
   - Os EUA não têm decisão de adequação. Na prática sobram três caminhos: **cláusulas-padrão da ANPD**, adotadas "integral[mente] e sem alteração" (art. 16 da Res. 19; prazo de adaptação de 12 meses, encerrado em agosto de 2025); **consentimento específico e em destaque** (art. 33, VIII), que é frágil por ser revogável; ou a hipótese do art. 33, IX (necessária à execução de contrato), difícil de sustentar quando existe hospedagem no Brasil.
   - É preciso também publicar uma página com as informações da transferência (Res. 19, art. 17, §2º).
   - **O realista para um projeto deste porte é hospedar a aplicação também em região brasileira** (São Paulo), o que elimina a maior parte do problema. Atenção também aos serviços acessórios estrangeiros (SMS de verificação, e-mail, logs, monitoramento, IA): cada um é um operador e pode ser uma transferência. (Alta para os textos; a recomendação é **(inferência)**.)

8. **Mínimo na política de privacidade:**
   - Os sete itens do **art. 9º**: finalidade; forma e duração; identificação e contato do controlador; uso compartilhado; responsabilidades dos agentes; direitos do art. 18 "com menção explícita".
   - O aviso em destaque de que o tratamento é condição do serviço (art. 9º, §3º).
   - Transparência sobre o legítimo interesse (art. 10, §2º).
   - O canal do titular (Res. 2/2022, art. 11).
   - A página de transferência internacional, se houver (Res. 19, art. 17, §2º).
   - Pelo Marco Civil (art. 7º, VIII), as finalidades devem estar "especificadas nos contratos [...] ou em termos de uso".

   Os termos de uso precisam ainda, pelo Decreto 12.975/2026 (que acrescentou o art. 20-A ao Decreto 8.771), de "sistema de notificações" e "devido processo". O art. 16-E manda comunicar a remoção ao autor com o fundamento e os meios de contestar, o que encaixa no fluxo de Denúncia. (Alta para os textos; se o art. 20-A alcança um provedor pessoa física pequeno é **não confirmado**.)

## 1. A LGPD se aplica a um projeto de pessoa física sem receita?

- **Art. 1º:** a lei trata do tratamento de dados "por pessoa natural ou por pessoa jurídica". **Art. 3º:** aplica-se a "qualquer operação de tratamento realizada por pessoa natural [...] independentemente [...] do país onde estejam localizados os dados" quando o tratamento ocorre no Brasil, visa oferecer serviço a pessoas no Brasil ou os dados foram coletados aqui. **Alta.** [L1]
- **Art. 4º, I:** a lei não se aplica ao tratamento "realizado por pessoa natural para fins **exclusivamente particulares e não econômicos**". **Alta.** [L1]
- **Res. CD/ANPD 2/2022:** o art. 1º, parágrafo único, separa o tratamento "por pessoa natural para fins exclusivamente particulares e não econômicos" (fora da LGPD) das "pessoas naturais [...] que realizam tratamento de dados pessoais, assumindo obrigações típicas de controlador ou de operador", que são **agentes de pequeno porte** (art. 2º, I) e, portanto, sujeitas à LGPD. **Alta.** [A1]
- **Guia da ANPD sobre agentes de tratamento (v2, 2022), §32:** "Uma pessoa natural poderá ser controladora nas situações em que é a responsável pelas principais decisões referentes ao tratamento", agindo "de forma independente e em nome próprio". Os exemplos são empresário individual, profissional liberal e médica com consultório. **Alta.** [A7]
- **Direito comparado [secundária]:** na UE, o caso *Lindqvist* (TJUE, C-101/01, 2003) é citado por afastar a exceção doméstica quando os dados são publicados na internet "to an indefinite number of people". Não li o acórdão. **Baixa.** [S1]
- **Conclusão (inferência), Alta:** o Passaly trata dados de pessoas que o fundador não conhece, numa plataforma aberta, para uma finalidade de serviço. Isso não é "exclusivamente particular". Os dois requisitos do art. 4º, I, são cumulativos ("e"), então a falta de receita não basta. O fundador é o controlador pessoa natural e um agente de pequeno porte.
- **Efeito colateral (inferência):** como controlador pessoa natural, o fundador precisa se identificar na política de privacidade (art. 9º, III–IV). Abrir uma PJ (MEI, LTDA) mudaria o controlador. Também poderia, se houver "fins econômicos", atrair o art. 15 do Marco Civil (seção 5). É decisão para advogado e contador.

## 2. Bases legais por dado

### 2.1 Textos

- **Art. 7º** (lista fechada: "somente poderá ser realizado nas seguintes hipóteses"): I consentimento; II obrigação legal; V "quando necessário para a execução de contrato ou de procedimentos preliminares relacionados a contrato do qual seja parte o titular, a pedido do titular"; VI "exercício regular de direitos em processo judicial, administrativo ou arbitral"; IX "interesses legítimos do controlador ou de terceiro, exceto no caso de prevalecerem direitos e liberdades fundamentais do titular". **Alta.** [L1]
- **Art. 8º, §5º e art. 18, IX:** o consentimento pode ser revogado "a qualquer momento". **Alta.** [L1]
- **Art. 10:** o legítimo interesse vale para "finalidades legítimas, consideradas a partir de situações concretas", incluindo "proteção, em relação ao titular, do exercício regular de seus direitos ou prestação de serviços que o beneficiem, respeitadas as legítimas expectativas dele". §1º: "somente os dados pessoais estritamente necessários". §2º: o controlador deve "adotar medidas para garantir a transparência". §3º: a ANPD pode pedir relatório de impacto. **Alta.** [L1]
- **Art. 37:** o registro das operações é obrigatório, "especialmente quando baseado no legítimo interesse". **Alta.** [L1]
- **Guia ANPD de legítimo interesse (2024):** recomenda um **teste de balanceamento** registrado. Diz que, se ele for "inconclusivo", "deverá ser adotada outra base legal". Admite o legítimo interesse "para o tratamento de dados pessoais não sensíveis com a finalidade de prevenir fraudes e, por conseguinte, garantir a segurança" (p. 36). O guia tem um modelo de teste simplificado (anexo II). **Alta.** [A8]
- **Art. 21:** "Os dados pessoais referentes ao exercício regular de direitos pelo titular não podem ser utilizados em seu prejuízo." **Alta.** [L1]

### 2.2 Proposta por dado (inferência, Média)

| Dado | Finalidade | Base sugerida | Observação |
|---|---|---|---|
| Telefone (e a verificação por SMS) | Criar conta, autenticar, identificar o Anunciante (ADR 0004), viabilizar o contato no dia da entrega, se houver | Art. 7º, V (execução dos termos de uso) | Se o telefone for mostrado à outra parte do Pedido, isso é **uso compartilhado** e deve ser informado (art. 9º, V). O ADR 0001 não prevê exibir telefone, e não exibir é o mais seguro. |
| Foto do item | Mostrar o item no Post | Art. 7º, V | Só do item. Remover EXIF (seção 6). Criança na foto: seção 6. |
| Tamanho, validade, quantidade | Conteúdo do Post | Art. 7º, V | Em geral não identificam a pessoa sozinhos, mas compõem o Post vinculado ao Anunciante. |
| Bairro | Busca por proximidade | Art. 7º, V | É dado de localização de baixa precisão e coerente com a minimização (sem GPS). |
| Pedido, Ponto de encontro, horário, confirmações | Combinar e registrar a entrega | Art. 7º, V | O Ponto de encontro é público e curado, sem endereço de ninguém. |
| Contador de trocas concluídas (reputação) | Confiança entre usuários | Art. 7º, V (função anunciada nos termos) ou IX | É exibido a terceiros, então deve estar claro nos termos. Não é decisão automatizada que restrinja o usuário. |
| Denúncia (quem denunciou, motivo, Post) | Moderação, segurança, anti-Revenda | Art. 7º, IX (+ VI se houver disputa) | Teste de balanceamento. Não usar o fato de alguém ter **pedido exclusão ou reclamado à ANPD** contra ele (art. 21). Não revelar quem denunciou ao denunciado sem necessidade. |
| Registro de banimento | Impedir que quem foi banido volte a fraudar ou revender | Art. 7º, IX | Guardar o mínimo (ex.: hash do telefone, motivo, data). Ver a retenção na seção 5. |
| Logs (IP, porta lógica, data e hora) | Identificar o autor de um ilícito (ADR 0004; STJ) | Art. 7º, IX e VI | Ver as seções 3 e 5. |

Por que não consentimento **(inferência)**: o consentimento pode ser revogado a qualquer momento (art. 8º, §5º). Isso desmontaria a identificação do Anunciante e o registro de banimento justamente quando eles importam. Também precisa ser "livre", o que é discutível quando é condição para usar o app (art. 9º, §3º).

## 3. "Identificável": o que basta (ADR 0004 × necessidade)

- **Princípio da necessidade (art. 6º, III):** "limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos". **Alta.** [L1]
- **Decreto 8.771/2016, art. 13, §2º:** os provedores de aplicações "devem reter a menor quantidade possível de dados pessoais, comunicações privadas e registros de conexão e acesso a aplicações", excluindo-os "tão logo atingida a finalidade de seu uso" ou ao fim do prazo legal. **Alta.** [L3]
- **STJ, Jurisprudência em Teses, ed. 223 (11/10/2023), "Marco Civil da Internet II":** [J2]
  - **Tese 2:** "Os provedores de aplicações de internet não são obrigados a guardar e fornecer dados pessoais dos usuários, pois a apresentação dos registros de número IP (Internet Protocol) é suficiente para sua identificação." (REsp 1.914.596/RJ; REsp 1.829.821/SP; REsp 1.784.156/SP.) **Alta.**
  - **Tese 3:** "Os provedores de acesso e os de aplicação têm o dever de guarda e armazenamento dos dados referentes ao IP e à porta lógica de origem, para possibilitar a identificação de usuários da internet que tenham cometido atos ilícitos de qualquer natureza praticados no âmbito virtual." **Alta.**
  - A própria publicação diz que as teses "não consist[em] em repositórios oficiais da jurisprudência". **Alta.**
- **REsp 1.829.821/SP (Informativo 680):** o STJ exige que o provedor tenha "o cuidado de propiciar meios para que se possa identificar cada um desses usuários, coibindo o anonimato". Diz também que quem registra o IP usado no cadastro "mantém um meio razoavelmente eficiente de rastreamento". **Alta.** [J1]
- **REsp 2.067.181 (OLX):** o classificado deve "manter condições de identificar cada um de seus anunciantes" e responde se "deixar de fornecer elementos para a identificação do autor do anúncio". **Alta** (via notícia oficial do STJ, conforme a pesquisa anterior). [J3]
- **Decreto 8.771, art. 15-A (incluído pelo Decreto 12.975/2026):** o dever de guarda de IP "abrangerá a porta lógica de origem associada sempre que necessário para a identificação inequívoca do terminal". **Alta.** [L3]
- **Decreto 8.771, art. 11, §1º:** "O provedor que não coletar dados cadastrais deverá informar tal fato à autoridade solicitante, ficando desobrigado de fornecer tais dados." Dados cadastrais são filiação, endereço e "nome, prenome, estado civil e profissão" (§2º). **Alta.** [L3]

**Conclusão (inferência), Média-Alta:** o mínimo que atende o STJ e o art. 6º, III, é:

1. **telefone verificado por SMS**, que liga a conta a uma linha (a operadora tem o cadastro do titular da linha);
2. **registros de IP, porta lógica e data/hora** do cadastro, dos logins e das ações que podem gerar ilícito (criar Post, aceitar Pedido, confirmar entrega, Denúncia);
3. nenhum CPF, documento, endereço ou selfie.

O Decreto 8.771, art. 11, §1º, confirma que o provedor pode não coletar dados cadastrais e só informar isso. O **nome** exibido pode ser apelido. Que apelido mais telefone mais IP seja suficiente num caso concreto contra o Passaly é **não confirmado** (pergunta para advogado).

## 4. Encarregado e regime de pequeno porte

- **LGPD art. 41, caput:** "O controlador deverá indicar encarregado". **§3º:** a ANPD pode prever "hipóteses de dispensa [...] conforme a natureza e o porte da entidade ou o volume de operações". **Alta.** [L1]
- **Res. CD/ANPD 2/2022** (vigente, com o art. 14, II, alterado pela Res. 15/2024) [A1]:
  - **Art. 2º, I:** agentes de pequeno porte incluem "pessoas naturais e entes privados despersonalizados que realizam tratamento de dados pessoais, assumindo obrigações típicas de controlador ou de operador". **Alta.**
  - **Art. 3º:** não se beneficiam os que "realizem tratamento de alto risco", que tenham receita acima do limite da LC 123/2006 ou que pertençam a grupo econômico acima desse limite. **Alta.**
  - **Art. 4º:** alto risco exige **ao mesmo tempo** pelo menos um critério **geral** (a. "larga escala"; b. tratamento que "possa afetar significativamente interesses e direitos fundamentais") e um **específico** (a. "tecnologias emergentes ou inovadoras"; b. vigilância de zonas acessíveis ao público; c. decisões "unicamente com base em tratamento automatizado"; d. "dados pessoais sensíveis ou [...] de crianças, de adolescentes e de idosos"). **§2º:** "afetar significativamente" inclui quando o tratamento "puder **impedir** o exercício de direitos ou **a utilização de um serviço**" e danos "à imagem e à reputação". **Alta.**
  - **Art. 6º:** a flexibilização "não isenta [...] do cumprimento dos demais dispositivos da LGPD, inclusive das bases legais e dos princípios [...] bem como direitos dos titulares". **Alta.**
  - **Art. 7º:** as informações (art. 9º) e o atendimento dos direitos (art. 18) podem ser feitos por meio eletrônico, impresso ou outro. **Alta.**
  - **Art. 9º:** o registro das operações (art. 37) pode ser **simplificado**, e a ANPD "fornecerá modelo". **Alta.** (Se o modelo foi publicado e onde: **não confirmado**.)
  - **Art. 11:** "não são obrigados a indicar o encarregado". **§1º:** quem não indicar "deve disponibilizar um canal de comunicação com o titular". **§2º:** indicar encarregado conta como boa prática (art. 52, §1º, IX). **Alta.**
  - **Arts. 12–13:** medidas de segurança "essenciais" e política simplificada de segurança, considerando "custos", "estrutura, a escala e o volume". **Alta.**
  - **Art. 14:** **prazo em dobro** para atender o titular, comunicar incidentes, dar a declaração completa do art. 19, II (15 → 30 dias) e responder à ANPD. **Art. 15:** a declaração simplificada do art. 19, I (que seria "imediata") pode sair em até 15 dias. **Alta.**
  - **Art. 16:** a ANPD pode exigir as obrigações dispensadas conforme "a natureza ou o volume das operações, bem como os riscos". **Alta.**
- **Res. CD/ANPD 18/2024 (encarregado):** quem indicar encarregado deve publicar nome e contato "em local de destaque e de fácil acesso" (art. 9º). O encarregado pode ser pessoa natural, interna ou externa (art. 12). **Alta.** [A3]
- **Res. CD/ANPD 15/2024 (incidentes):** comunicar à ANPD (art. 6º) e ao titular (art. 9º) em **três dias úteis**, em dobro para pequeno porte. Isso vale quando o incidente "puder afetar significativamente" direitos **e** envolver, por exemplo, "dados de autenticação em sistemas" ou "dados de crianças" (art. 5º). O **registro de todo incidente, mesmo não comunicado, deve ser mantido por no mínimo cinco anos** (art. 10). **Alta.** [A2]

**Enquadramento do Passaly (inferência):**

- **Protótipo sem IA:** ~30 usuários, então não há "larga escala". Banimento e ocultação de Post podem "impedir [...] a utilização de um serviço" (critério geral b). Mas não achei critério específico: sem IA ou tecnologia emergente, sem decisão **unicamente** automatizada (o fundador revisa), sem dado sensível e sem dado de criança. **Não é alto risco → regime de pequeno porte vale.** Média.
- **Com IA analisando fotos:** passa a existir um candidato a critério específico ("tecnologias emergentes ou inovadoras"). Se somado ao banimento ou à ocultação, pode virar alto risco. Se a IA também procurar crianças nas fotos, há tratamento de imagem de criança (critério d). **Risco real de perder o regime simplificado**, inclusive a dispensa de encarregado. Baixa-Média (depende da leitura da ANPD; não achei guia específico).
- **Ocultar o Post na hora, com uma Denúncia:** é uma ação automática que afeta o Anunciante. Como o fundador revisa em 24 h, há revisão humana. Mesmo assim, a política deve explicar isso (art. 20, §1º). **(inferência)**

## 5. Retenção e exclusão

### 5.1 Textos

- **LGPD art. 15:** o tratamento termina quando "a finalidade foi alcançada ou [...] os dados deixaram de ser necessários", no "fim do período de tratamento", por "comunicação do titular" (incluindo a revogação do consentimento, "resguardado o interesse público") ou por determinação da ANPD. **Alta.** [L1]
- **LGPD art. 16:** os dados "serão eliminados após o término de seu tratamento", "autorizada a conservação" **só** para: I obrigação legal ou regulatória; II estudo por órgão de pesquisa; III transferência a terceiro, respeitada a lei; IV "uso exclusivo do controlador, vedado seu acesso por terceiro, e desde que **anonimizados**". **Alta.** [L1]
- **LGPD art. 18:** o titular pode pedir "eliminação dos dados pessoais tratados **com o consentimento** do titular, exceto nas hipóteses previstas no art. 16" (VI), além de "anonimização, bloqueio ou eliminação de dados **desnecessários, excessivos ou tratados em desconformidade**" (IV). §2º: pode se "opor" ao tratamento sem consentimento "em caso de descumprimento" da lei. §4º: se não puder atender de imediato, o controlador deve indicar "as razões de fato ou de direito". **Alta.** [L1]
- **Marco Civil art. 7º, X:** direito à "exclusão definitiva dos dados pessoais que tiver fornecido a determinada aplicação de internet, a seu requerimento, ao término da relação entre as partes, **ressalvadas as hipóteses de guarda obrigatória de registros** previstas nesta Lei e na [LGPD]". **Alta.** [L2]
- **Marco Civil art. 15, caput:** "O provedor de aplicações de internet **constituído na forma de pessoa jurídica** e que exerça essa atividade de forma organizada, profissionalmente e **com fins econômicos** deverá manter os respectivos registros de acesso a aplicações de internet [...] pelo prazo de 6 (seis) meses". **§1º:** ordem judicial pode obrigar outros provedores a guardar registros "relativos a fatos específicos em período determinado". **§2º:** polícia, autoridade administrativa ou MP podem pedir guarda cautelar a "qualquer provedor". **Alta.** [L2]
- **Marco Civil art. 17:** "a opção por não guardar os registros de acesso a aplicações de internet não implica responsabilidade sobre danos decorrentes do uso desses serviços por terceiros", "ressalvadas as hipóteses previstas nesta Lei". **Alta.** [L2]
- **Marco Civil art. 5º, VIII:** registros de acesso são "data e hora de uso de uma determinada aplicação de internet a partir de um determinado endereço IP". **Alta.** [L2]
- **Prazos de prescrição** (para dimensionar a retenção defensiva): reparação civil em **3 anos** (CC art. 206, §3º, V) [L4]; dano por fato do produto ou serviço sob o CDC em **5 anos**, a partir do conhecimento do dano e da autoria (CDC art. 27) [L5]. **Alta.**

### 5.2 Leitura

- **O Passaly não está obrigado pelo art. 15 do Marco Civil** enquanto for pessoa física sem fins econômicos. **Alta** para o texto. Mas o STJ fala em "dever de guarda" de IP e porta lógica para provedores de aplicação em geral (Teses 223, tese 3), e o REsp 2.067.181 cobra do classificado meios de identificar o anunciante. A guarda voluntária por **6 meses**, espelhando o art. 15, com base no legítimo interesse, é **(inferência)** prudente e proporcional.
- **Conservar para defesa em processo:** o art. 16 não lista "exercício regular de direitos" como hipótese de conservação após o fim do tratamento. Uma leitura possível é que, enquanto houver disputa razoavelmente previsível, a finalidade "defesa" ainda não terminou (art. 15, I) e o tratamento segue com base no art. 7º, VI. É **(inferência)**, **não confirmada** em guia da ANPD. Pergunta para advogado.
- **Banido que pede exclusão:** o registro de banimento serve para impedir o recadastro. Ele não se apoia em consentimento (art. 18, VI não se aplica), mas o art. 7º, X, do Marco Civil dá "exclusão definitiva", ressalvada só a guarda **obrigatória**. Esta é a **maior incerteza da pesquisa**. Opções **(inferência)**: guardar só um **hash do telefone** (dado pseudonimizado, art. 13, §4º, que continua sendo dado pessoal) com motivo e data, por prazo definido, informado na política e nos termos.

### 5.3 Proposta de prazos (inferência, Baixa-Média; validar com advogado)

| Dado | Enquanto ativo | Depois | Justificativa |
|---|---|---|---|
| Conta (telefone, apelido, bairro) | Enquanto a conta existir | Eliminar ao excluir a conta, exceto o hash do item "Banimento" | Art. 15, III; MCI art. 7º, X |
| Post encerrado (foto e campos) | Até o encerramento | Foto: eliminar em poucos dias ou semanas. Campos: anonimizar para métricas (art. 16, IV) | A finalidade foi alcançada (art. 15, I) |
| Pedido e confirmações | Até a conclusão | Manter vinculado à conta por um prazo curto para disputas (ex.: 90 dias), depois anonimizar o contador e o histórico | Defesa e reputação; prazo a validar |
| Denúncia | Até a decisão | Improcedente: eliminar em prazo curto. Procedente: manter enquanto durar o banimento | Legítimo interesse |
| Banimento | Durante o banimento | Hash do telefone + motivo + data por prazo definido (ex.: 1–2 anos ou "até revisão") | Legítimo interesse; **ponto incerto** (5.2) |
| Logs de IP, porta e data/hora | 6 meses (rolante) | Eliminar, salvo pedido de guarda cautelar (MCI art. 15, §§1º–2º) | Espelha o MCI art. 15; STJ |
| Registro de incidentes de segurança | — | No mínimo **5 anos** | Res. 15/2024, art. 10 (obrigação regulatória) |

## 6. Fotos: EXIF, criança na imagem, biometria

- **EXIF:** não achei norma brasileira que mande remover metadados. As bases são:
  - **art. 6º, III** (necessidade) e **VII** (segurança);
  - **art. 46**: medidas "aptas a proteger os dados [...] de acessos não autorizados", observadas "desde a fase de concepção do produto ou do serviço" (§2º);
  - **art. 49**: sistemas "estruturados de forma a atender aos requisitos de segurança".

  A coordenada GPS do EXIF é dado de localização precisa vinculado ao Anunciante (o Decreto 8.771, art. 14, I, cita "dados locacionais"). Publicá-la anularia a decisão de usar só o bairro. **Remover no upload, antes de armazenar, é boa prática decorrente desses princípios**, não exigência expressa. Alta para os textos; **(inferência)** para a conclusão. [L1][L3]
- **Criança na foto:**
  - **Art. 14, caput:** o tratamento de dados de crianças "deverá ser realizado em seu melhor interesse". **§1º:** "consentimento específico e em destaque dado por pelo menos um dos pais ou pelo responsável legal". **§3º:** coleta sem consentimento só para contatar os pais ou para proteção, e os dados "em nenhum caso poderão ser repassados a terceiro sem o consentimento". **Alta.** [L1]
  - **Enunciado CD/ANPD nº 1/2023** (DOU de 24/05/2023): "O tratamento de dados pessoais de crianças e adolescentes poderá ser realizado com base nas hipóteses legais previstas no art. 7º ou no art. 11 [...], desde que observado e prevalecente o seu melhor interesse, a ser avaliado no caso concreto, nos termos do art. 14 da Lei." **Alta.** [A5]
  - **Guia de legítimo interesse:** para dados de criança, exige teste de balanceamento registrado que demonstre "(i) o que foi considerado como sendo o melhor interesse", "(ii) [...] critérios" e "(iii) que o tratamento não gera riscos ou impactos desproporcionais". **Alta.** [A8]
  - **Leitura (inferência), Média:** o Passaly não tem finalidade que precise da imagem da criança. Nenhuma base passa no teste de "melhor interesse" para **publicar** a foto. O caminho coerente com o art. 6º, III, é **não publicar e eliminar** (despublicar e pedir nova foto), em vez de desfocar e manter. Desfocar pode ser aceitável se feito **antes de armazenar ou publicar**, mas o original ainda passou pelo sistema. Não achei guia da ANPD sobre desfoque. **Não confirmado.**
  - **Detecção por IA de terceiro:** mandar a foto a um fornecedor para procurar criança é, em si, tratar imagem de criança e compartilhá-la com operador. Se o operador é "terceiro" para o art. 14, §3º, é **não confirmado**. Em todo caso, isso entra no critério específico "d" de alto risco (seção 4). **(inferência)** No protótipo, a combinação mais simples é: instrução clara na tela de upload ("fotografe só o pacote"), um aviso nos termos e a remoção na revisão manual ou por Denúncia.
- **Biometria:** a **Nota Técnica nº 17/2025/CON1/CGN/ANPD** (tomada de subsídios sobre dados biométricos) cita o considerando 51 do RGPD: "o tratamento de fotografias [...] só deve ser considerado dado biométrico quando utilizado com meios técnicos específicos que permitam a identificação inequívoca do titular". A ANPD **ainda regulamenta** biometria (Agenda 2025–2026). **Alta** para o que a nota diz; o regulamento final **não foi publicado**, até onde vi. [A9] **(inferência)**: foto de pacote, ou foto com um rosto por acidente, não é dado sensível. Usar **reconhecimento facial** para detectar pessoas pode aproximar o tratamento de biometria e deve ser evitado.

## 7. IA de terceiro para analisar fotos (ADR 0002)

- **Papel:** o fornecedor que processa as fotos "em nome do controlador" é **operador** (art. 5º, VII). "O operador deverá realizar o tratamento segundo as instruções fornecidas pelo controlador, que verificará a observância das próprias instruções" (art. 39). **Alta.** [L1]
- **Responsabilidade:** o operador "responde solidariamente [...] quando descumprir as obrigações da legislação [...] ou quando não tiver seguido as instruções lícitas do controlador, hipótese em que [...] equipara-se ao controlador" (art. 42, §1º, I). **Alta.** [L1]
- **Contrato:** "Ainda que a LGPD não determine expressamente que o controlador e o operador devam firmar um contrato [...], tal ajuste se mostra como uma boa prática" (Guia de agentes, §55). Pontos sugeridos: "objeto, a duração, a natureza e a finalidade do tratamento, os tipos de dados [...] e os direitos e obrigações" (§56). O operador deve "dar ciência ao controlador em caso de contrato com suboperador" (§54). **Alta.** [A7]
- **O que checar no fornecedor (inferência):**
  1. se usa as imagens para **treinar ou melhorar** modelos (finalidade própria do fornecedor, que o tornaria controlador dessa parte e exigiria base e transparência próprias);
  2. onde processa e onde guarda (transferência internacional, seção 8);
  3. por quanto tempo retém;
  4. se aceita as cláusulas-padrão da ANPD.
- **Decisão automatizada:** o art. 20 dá direito de revisão de "decisões tomadas **unicamente** com base em tratamento automatizado [...] que afetem seus interesses", e o §1º exige informar "os critérios e os procedimentos". O ADR 0002 (IA só sinaliza; o humano decide) evita a decisão "unicamente" automatizada. Se a IA passar a ocultar Posts sozinha, o art. 20 entra. **Alta** para o texto; **(inferência)** para o enquadramento.
- **Política de privacidade:** informar o uso compartilhado com o operador e a finalidade (art. 9º, V). **Alta.**
- **Pequeno porte:** a IA pode levar ao alto risco (seção 4). **(inferência)**

## 8. Transferência internacional (aplicação nos EUA)

- **LGPD art. 33:** a transferência "somente é permitida" nos casos: I país adequado; II garantias ("cláusulas contratuais específicas", "cláusulas-padrão contratuais", "normas corporativas globais", selos); [...] VIII "consentimento específico e em destaque [...] com informação prévia sobre o caráter internacional da operação"; IX "quando necessário para atender as hipóteses previstas nos incisos II, V e VI do art. 7º". **Alta.** [L1]
- **Res. CD/ANPD 19/2024** (Regulamento de Transferência Internacional + cláusulas-padrão) [A4]:
  - **Art. 3º:** "transferência: operação [...] por meio da qual um agente de tratamento transmite, compartilha ou disponibiliza acesso a dados pessoais a outro agente de tratamento". "Coleta internacional" (feita diretamente por agente no exterior) "não caracteriza transferência" (art. 6º). **Alta.**
  - **Art. 9º:** é preciso **uma hipótese do art. 7º ou 11** e **um mecanismo válido** (adequação; cláusulas-padrão, normas corporativas ou cláusulas específicas; ou os incisos II-d e III a IX do art. 33). O **parágrafo único** limita a transferência "ao mínimo necessário". **Alta.**
  - **Art. 16:** a validade com cláusulas-padrão "pressupõe a adoção **integral e sem alteração**" do texto do anexo II, "mediante instrumento contratual firmado entre o exportador e o importador". **Alta.**
  - **Art. 2º, parágrafo único da Resolução:** quem usa cláusulas contratuais deveria incorporar as cláusulas-padrão em até **12 meses** da publicação (23/08/2024), ou seja, até agosto de 2025. **Alta** (texto). Data final de 23/08/2025 confirmada em **[secundária]** [S2].
  - **Art. 17:** entregar ao titular, se pedir, a íntegra das cláusulas em 15 dias (§1º). **Publicar na página do controlador** um documento em português, em linguagem simples, com forma, duração e finalidade da transferência, o **país de destino**, a identificação do controlador, o uso compartilhado, as responsabilidades e medidas de segurança e os direitos do titular (§2º). **Alta.**
- **Adequação:** a lista de normas da ANPD mostra só a **Res. 32/2026 (União Europeia)**. Nada sobre os EUA. **Alta** (lista consultada em 2026-11-11). [A6]
- **Mercado [secundária]:** vários fornecedores americanos publicam adendos com as cláusulas-padrão brasileiras (ex.: Cisco, ActiveCampaign, LiveRamp), mas **não confirmei** se os provedores de nuvem e PaaS mais prováveis (AWS, Vercel, Supabase, Firebase, Twilio etc.) as oferecem. **Não confirmado.** [S4]

**Leitura (inferência):**

- **Aplicação nos EUA = transferência.** O Passaly (controlador, no Brasil) disponibiliza dados ao provedor de hospedagem (operador, nos EUA). O banco ficar em São Paulo não muda isso, porque a aplicação lê e processa os dados lá fora. **Média-Alta.**
- **Mecanismos realistas:**
  1. **Cláusulas-padrão da ANPD.** Só funcionam se o provedor aceitar assinar o texto sem alteração, o que um cliente pequeno não negocia. É viável só se o provedor já as oferece no DPA.
  2. **Consentimento (art. 33, VIII).** É frágil: precisa ser destacado e separado, e quem não consente não poderia usar o app (o que tensiona o "livre").
  3. **Art. 33, IX + execução de contrato.** Exige que a transferência seja "necessária", argumento fraco quando há região brasileira disponível.
- **Recomendação de menor esforço:** **hospedar a aplicação na região de São Paulo** do mesmo provedor do banco. Isso reduz a questão a serviços acessórios, que precisam ser mapeados um a um: SMS de verificação, e-mail, analytics, logs e monitoramento de erros, CDN, IA. Se o provedor brasileiro de uma empresa americana ainda permite acesso remoto do exterior (suporte), saber se isso é transferência é **não confirmado**.
- **Pequeno porte não tem regra simplificada para transferência** na Res. 19/2024, pelo que li. **Média.**

## 9. Política de privacidade e termos de uso: mínimo para o protótipo

### 9.1 Política de privacidade (Alta para os textos; a lista é compilação)

1. **Art. 9º, I–VII** [L1]: finalidade específica; forma e duração (com os prazos da seção 5); **identificação do controlador** (o fundador, pessoa natural, ou a PJ, se criada); **contato** do controlador; uso compartilhado (operadores: hospedagem, SMS, IA) e finalidade; responsabilidades dos agentes; **direitos do art. 18 "com menção explícita"** e como exercê-los.
2. **Art. 9º, §3º:** como o tratamento é condição do serviço, informar "com destaque" esse fato e os meios de exercer os direitos.
3. **Art. 10, §2º:** transparência sobre o que é tratado por legítimo interesse (Denúncia, banimento, logs).
4. **Canal do titular** (Res. 2/2022, art. 11, §1º) ou encarregado com nome e contato (Res. 18/2024, art. 9º).
5. **Prazos de atendimento:** art. 19 (declaração simplificada "imediatamente"; completa em 15 dias), dobrados para pequeno porte (Res. 2, arts. 14–15).
6. **Direito de peticionar à ANPD** e aos órgãos de defesa do consumidor (art. 18, §§1º e 8º).
7. **Transferência internacional**, se houver: página do art. 17, §2º, da Res. 19/2024.
8. **Decisões automatizadas** (ocultação automática por Denúncia; IA, se adotada): critérios e direito de revisão (art. 20).
9. **Marco Civil art. 7º, VIII:** as finalidades precisam estar "especificadas nos contratos de prestação de serviços ou em termos de uso". [L2]
10. **Segurança:** o Decreto 8.771, art. 16, pede divulgar "de forma clara e acessível" os padrões de segurança. [L3]

### 9.2 Termos de uso (inferência, salvo onde indicado)

- Quem pode usar: **maiores de 18 anos** (pais e responsáveis). Isso evita tratar dados de adolescentes como usuários.
- Proibição de Revenda; o Post só pode mostrar o item; proibido incluir pessoas, especialmente crianças, nas fotos.
- Estado e validade são **declarados pelo Anunciante** (ADRs 0002, 0003, 0004).
- **Denúncia, moderação e banimento:** motivos, ocultação imediata, revisão em 24 h, possibilidade de contestar. O Decreto 8.771, art. 20-A (incluído pelo Decreto 12.975/2026), manda os provedores editarem termos que abranjam "o sistema de notificações", "o devido processo" e "relatórios anuais de transparência". O art. 16-E manda, em caso de remoção, comunicar ao autor "o fundamento específico da remoção e os meios de contestá-la". **Alta** para o texto. Se um provedor pessoa física minúsculo está sujeito a isso, e com que flexibilização (o art. 16-P permite "critérios diferenciados [...] especialmente quanto aos pequenos provedores"), é **não confirmado**. O art. 16-A, I, exige ainda "sede e representante legal no País [...] constituído na forma de pessoa jurídica". Como isso se aplica a um provedor brasileiro pessoa física é **não confirmado**. [L3]

## 10. Contradições com os ADRs

Não encontrei contradição direta com os ADRs 0001–0004. Há reforços e consequências que os ADRs não registram:

- **ADR 0004 (Anunciante identificável):** confirmado e delimitado. O STJ considera o **IP suficiente** e diz que o provedor de aplicação **não é obrigado** a coletar dados pessoais além disso (Teses 223, tese 2). Logo, o ADR **não justifica** coletar CPF ou documento. Mas exige, na prática, **guardar logs de IP, porta e data/hora** (tese 3), o que nenhum documento do projeto menciona ainda. Também cria a questão aberta de reter o hash do banido depois da exclusão (seção 5.2).
- **ADR 0002 (IA como alerta):** compatível. Duas consequências não registradas: (a) a IA pode tornar o tratamento de **alto risco** na Res. 2/2022 e tirar o Passaly do regime de pequeno porte, com encarregado obrigatório e prazos normais; (b) usar a IA para **detectar crianças** significa tratar e compartilhar imagem de criança (art. 14). Isso reforça manter a IA fora do protótipo.
- **ADR 0001 (sem chat livre):** reforçado. Sem chat, não há conteúdo de comunicações privadas para guardar, e o item "retenção e exclusão de mensagens de chat" sai do escopo.
- **Contexto (não é ADR):** "aplicação em servidor nos EUA" gera transferência internacional (seção 8). Não contradiz ADR, mas é a decisão técnica com mais custo jurídico desta pesquisa.

## 11. Implicações para o Passaly

Só o que decorre dos fatos acima. As decisões ficam para `/grill-with-docs` (e as difíceis de reverter, para ADR).

1. **O Passaly está sob a LGPD desde o primeiro usuário**, com o fundador como controlador e no regime de pequeno porte (dispensa de encarregado, canal obrigatório, prazos em dobro), enquanto não houver tratamento de alto risco.
2. **Identificação = telefone verificado + logs de IP, porta e data/hora por 6 meses.** Sem CPF nem documento. Os logs entram no desenho técnico desde o início (art. 46, §2º).
3. **Bases legais:** execução de contrato (termos de uso) para o núcleo do app; legítimo interesse com **teste de balanceamento escrito** (modelo no anexo II do guia da ANPD) para Denúncia, banimento e logs. Registrar tudo num **registro simplificado de operações** (art. 37; Res. 2, art. 9º).
4. **Retenção com prazos escritos** (seção 5.3) e eliminação automática. Foto de Post encerrado sai cedo.
5. **EXIF removido no upload, antes de gravar.** Foto com criança: despublicar e eliminar, sem desfoque como solução padrão.
6. **Hospedar a aplicação no Brasil** evita o regime de transferência internacional. Mapear os serviços acessórios estrangeiros (SMS, e-mail, logs, IA) antes de escolher a stack.
7. **O fluxo de Denúncia já precisa de "devido processo"**: avisar o Anunciante do motivo e de como contestar (Decreto 12.975/2026). Isso pesa no desenho do protótipo, não só nos termos.
8. **Plano de incidente mínimo:** saber comunicar em 6 dias úteis (3 em dobro) e manter registro de incidentes por 5 anos.
9. **IA de terceiro só depois de**: checar se ela leva a alto risco, se o fornecedor treina com as fotos, onde processa e se assina cláusulas-padrão.

## 12. Lacunas / não confirmado

- Se a ANPD trata ocultação ou banimento como "afetar significativamente" e IA de visão como "tecnologia emergente" para o alto risco da Res. 2/2022. Não achei guia de alto risco publicado.
- **Retenção do banimento após pedido de exclusão** (LGPD art. 16 × MCI art. 7º, X): não achei guia da ANPD nem precedente.
- Retenção para "defesa" sem estar listada no art. 16 da LGPD.
- Se o modelo de registro simplificado da ANPD (Res. 2, art. 9º) foi publicado.
- Quais provedores de nuvem e PaaS oferecem as cláusulas-padrão da ANPD no DPA; se acesso remoto do exterior a dados hospedados em São Paulo é transferência.
- Se os deveres do Decreto 12.975/2026 (arts. 16-A, 16-E, 20-A) alcançam provedor pessoa física pequeno, e se a ANPD já usou o art. 16-P para flexibilizar.
- Se o **ECA Digital (Lei 15.211/2025)** alcança um app para pais com tema infantil ("acesso provável" por crianças). Só vi resumos de busca; não li a lei. **Não confirmado.**
- Desfoque de criança em foto: não achei orientação da ANPD.
- Regulamento de biometria da ANPD (Agenda 2025–2026): não publicado até onde vi.
- Se há regulamento da ANPD sobre direitos do titular (prazos do art. 18, §5º) posterior a 2024: não aparece na lista de normas consultada.
- Como a multa do art. 52, II (percentual do "faturamento da pessoa jurídica"), se aplica a um controlador pessoa natural sem receita: não pesquisado.
- Marco Civil art. 7º, IX ("consentimento expresso" para coleta) × bases sem consentimento da LGPD: a convivência dos dois textos não foi pesquisada.

## 13. Perguntas para um advogado validar

1. O fundador, pessoa natural, como controlador, está bem enquadrado? Vale abrir PJ (MEI ou LTDA) já no protótipo, considerando a exposição do nome do fundador na política e o art. 15 do Marco Civil (que passa a obrigar a PJ "com fins econômicos")?
2. Telefone verificado + IP, porta e data/hora por 6 meses bastam para cumprir o dever de identificação do REsp 2.067.181, dado que o Passaly participa da combinação (ADR 0004)?
3. Execução de contrato (termos de uso de serviço gratuito) é base adequada para telefone, Post e Pedido? E legítimo interesse para Denúncia, banimento e logs?
4. Depois que um usuário banido pede exclusão, o Passaly pode manter um hash do telefone para impedir o recadastro? Por quanto tempo? Como fica isso frente ao MCI art. 7º, X?
5. Por quanto tempo guardar Pedidos, confirmações e Denúncias para defesa (3 anos do CC, 5 do CDC, ou menos com anonimização)? Qual base sustenta conservar dados fora das hipóteses do art. 16?
6. Usar IA de visão de terceiro (para validade, lacre ou criança) torna o tratamento de alto risco na Res. 2/2022? O operador é "terceiro" para o art. 14, §3º?
7. Hospedar a aplicação nos EUA com banco em São Paulo: qual mecanismo do art. 33 é defensável para uma pessoa física que não negocia contrato com o provedor? Hospedagem em região brasileira de provedor americano elimina a transferência?
8. Os deveres do Decreto 12.975/2026 (canal de denúncia, comunicação da remoção com fundamento e contestação, termos com devido processo, relatório de transparência, representante PJ) se aplicam ao Passaly?
9. O ECA Digital (Lei 15.211/2025) alcança um app de itens de bebê usado por adultos?
10. A ocultação automática do Post após uma Denúncia é "decisão unicamente automatizada" (art. 20)? A revisão manual em 24 h basta?

## 14. Fontes (acesso em 2026-11-11)

Legislação (portal da Câmara dos Deputados, "norma atualizada"; o Planalto recusa acesso automatizado):

- [L1] Lei nº 13.709/2018 (LGPD), arts. 1º, 3º–11, 14–21, 33–42, 46–49, 52, 55-J; com as alterações até a Lei nº 15.352/2026. https://www2.camara.leg.br/legin/fed/lei/2018/lei-13709-14-agosto-2018-787077-normaatualizada-pl.html
- [L2] Lei nº 12.965/2014 (Marco Civil da Internet), arts. 5º, 7º, 10, 11, 15, 16, 17. https://www2.camara.leg.br/legin/fed/lei/2014/lei-12965-23-abril-2014-778630-normaatualizada-pl.html
- [L3] Decreto nº 8.771/2016, com as alterações do Decreto nº 12.975, de 20/05/2026 (arts. 11, 13, 14, 15-A, 16, 16-A a 16-P, 19-A, 20-A). https://www2.camara.leg.br/legin/fed/decret/2016/decreto-8771-11-maio-2016-783094-normaatualizada-pe.html
- [L4] Lei nº 10.406/2002 (Código Civil), arts. 205–206. https://www2.camara.leg.br/legin/fed/lei/2002/lei-10406-10-janeiro-2002-432893-normaatualizada-pl.html
- [L5] Lei nº 8.078/1990 (CDC), art. 27. https://www2.camara.leg.br/legin/fed/lei/1990/lei-8078-11-setembro-1990-365086-normaatualizada-pl.html

ANPD:

- [A1] Resolução CD/ANPD nº 2/2022 (agentes de tratamento de pequeno porte), texto com a alteração da Res. 15/2024. https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-2-de-27-de-janeiro-de-2022
- [A2] Resolução CD/ANPD nº 15/2024 (comunicação de incidente de segurança), arts. 5º, 6º, 9º, 10. https://www.in.gov.br/en/web/dou/-/resolucao-cd/anpd-n-15-de-24-de-abril-de-2024-556243024
- [A3] Resolução CD/ANPD nº 18/2024 (encarregado), arts. 3º, 9º, 12. https://www.in.gov.br/en/web/dou/-/resolucao-cd/anpd-n-18-de-16-de-julho-de-2024-572632074
- [A4] Resolução CD/ANPD nº 19/2024 (transferência internacional e cláusulas-padrão), Resolução art. 2º e Anexo I arts. 2º–9º, 15–17. https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-19-de-23-de-agosto-de-2024
- [A5] Enunciado CD/ANPD nº 1, de 22/05/2023 (dados de crianças e adolescentes). https://www.in.gov.br/en/web/dou/-/enunciado-cd/anpd-n-1-de-22-de-maio-de-2023-485306934
- [A6] ANPD, página "Regulamentações da ANPD" (lista de resoluções vigentes, incluindo a Res. 32/2026, adequação da UE). https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd
- [A7] ANPD, Guia Orientativo para Definições dos Agentes de Tratamento e do Encarregado, v2 (abril/2022, retificado), §§32–33, 51–58. https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/Segunda_Versao_do_Guia_de_Agentes_de_Tratamento_retificada.pdf
- [A8] ANPD, Guia Orientativo — Hipóteses legais de tratamento de dados pessoais: Legítimo Interesse (v1.0, 2024), pp. 11, 34–36 e anexo II. https://www.gov.br/anpd/pt-br/documentos-e-publicacoes/guia_legitimo_interesse.pdf
- [A9] ANPD, Nota Técnica nº 17/2025/CON1/CGN/ANPD (tomada de subsídios sobre dados biométricos), item 5.2. https://www.gov.br/anpd/pt-br/acesso-a-informacao/participacao-social/outras-acoes/ts-01-2025-nota-tecnica-17-de-abertura.pdf

Jurisprudência:

- [J1] STJ, Informativo de Jurisprudência nº 680 (23/10/2020), REsp 1.829.821/SP, 3ª Turma, rel. Min. Nancy Andrighi, j. 25/08/2020. https://scon.stj.jus.br/jurisprudencia/externo/informativo/?aplicacao=informativo&acao=pesquisar&livre=%40CNOT%3D%27017853%27
- [J2] STJ, Jurisprudência em Teses, edição 223, "Marco Civil da Internet II" (11/10/2023), teses 2, 3 e 7. https://www.stj.jus.br/docs_internet/jurisprudencia/jurisprudenciaemteses/Jurisprudencia%20em%20Teses%20223%20-%20Marco%20Civil%20da%20Internet%20II%20-%20Lei%20N%2012%20965%202014.pdf
- [J3] STJ, notícia sobre o REsp 2.067.181 (18/09/2023), citada na pesquisa anterior. https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias/2023/18092023-OLX-nao-tem-responsabilidade-por-anuncio-de-carro-clonado-que-foi-vendido-fora-da-plataforma.aspx

Secundárias:

- [S1] **[secundária]** Thomas Helbing, resumo de TJUE C-101/01 (*Lindqvist*), exceção doméstica e publicação na internet. https://www.thomashelbing.com/en/wissen/dsgvo-hub/rechtsprechung/1.4.43-eugh-lindqvist (visto só via resumo de busca)
- [S2] **[secundária]** Mattos Filho, "Adequação das cláusulas-padrão contratuais da ANPD se encerra em 23 de agosto de 2025". https://www.mattosfilho.com.br/unico/clausulas-padrao-anpd/ (visto só via resumo de busca)
- [S3] **[secundária]** Data Privacy Brasil, nota sobre "acesso provável" no ECA Digital (Lei 15.211/2025). https://www.dataprivacybr.org/wp-content/uploads/2026/01/20260304_acesso-provavel-Eca-Digital.pdf (visto só via resumo de busca)
- [S4] **[secundária]** Exemplos de adendos com cláusulas-padrão brasileiras publicados por fornecedores: Cisco, https://www.cisco.com/c/dam/en_us/about/doing_business/legal/docs/Supplier-Brazilian-SCCs.pdf ; ActiveCampaign, https://www.activecampaign.com/legal/brazilscc (vistos só via resumo de busca)
