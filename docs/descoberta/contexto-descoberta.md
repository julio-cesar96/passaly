# Contexto de descoberta — Passaly

> Rascunho de entrada para o `/grill-with-docs`. **Não é spec nem ADR.** Registra o que o fundador já decidiu, o que está em aberto e o que precisa de pesquisa. Decisões que sobreviverem ao grill viram ADR em `docs/adr/` e termos viram `GLOSSARY.md`, pela skill `domain-modeling`.
>
> Data: 2026-11-09

## Natureza do projeto

- O Passaly é **um projeto de aprendizado** (desenvolvimento com IA desde o início) que **testa uma hipótese de produto**. Isso deve pesar nas decisões: preferir o menor escopo que valide a hipótese, aceitar processos manuais (moderação, curadoria) e evitar infraestrutura cara (ex.: verificação de documento).
- Origem: a troca de itens de bebê hoje acontece em grupos de Facebook, com spam de revenda, posts que somem e nenhum filtro (não dá para buscar "fralda P").

## Decisões já tomadas pelo fundador

Legenda: **[D]** decidido · **[H]** hipótese, sem dado real · **[?]** em aberto

### Produto e escopo
- **[D]** Lançamento na **cidade do Rio de Janeiro**.
- **[D]** Escopo inicial: **só fralda descartável, só pacote fechado e dentro da validade**.
- **[D]** O post é marcado como **troca**, **doação** ou **ambos**.
- **[D]** A negociação da troca é feita entre os usuários.
- **[D]** Não é brechó: **sem revenda**.
- **[D]** As métricas de volume são, de início, para conhecimento interno.

### Segurança do item
- **[D]** Validação por IA antes de publicar (pacote fechado, validade).
- **[D]** O anunciante declara estado e data de fabricação/validade. Leitura automática do pacote (código de barras/QR) é desejada.
- **[?]** Política de denúncia. Proposta inicial do fundador: remover o post e banir o usuário na primeira denúncia (ver tensões).

### Confiança
- **[D]** Deve existir reputação, sem excluir quem é novo.
- **[D]** Troca em **ponto de encontro**, sem expor endereço.
- **[?]** Verificação de identidade. O fundador quer telefone e documento, mas ainda pesa fricção e LGPD.

### Logística
- **[D]** Entrega por ponto de encontro.
- **[D]** Combinação pelo **chat dentro do app** (levar para fora repete o Facebook).
- **[D]** O usuário define a quantidade que oferece ou doa.
- **[?]** Parcerias (pontos de coleta, creches, ONGs, lojas) interessam, mas o formato está em aberto.

### LGPD
- **[D]** Dados **só do usuário anunciante**. **Nenhum dado de criança** é armazenado, só o item.
- **[D]** Localização pelo **bairro** marcado no post. Filtros por proximidade e reputação são desejados.
- **[D]** Foto só do item. Se aparecer criança por acidente, o app deve detectar e tratar.
- **[D]** Seguir as recomendações gerais da LGPD (base legal, retenção, exclusão), a detalhar após pesquisa.

## Tensões identificadas

1. **Massa crítica × atrito.** Validação por IA, verificação de identidade e campos obrigatórios melhoram segurança e confiança, mas cada passo derruba conversão, e o primeiro usuário é o mais frágil.
2. **Rio inteiro × troca presencial.** A troca só acontece com a outra pessoa perto. Usuários espalhados pela cidade podem gerar menos trocas do que poucos concentrados num bairro.
3. **Direção dos tamanhos [H].** O bebê cresce: tende a sobrar tamanho menor e faltar maior. Se for assim, a troca 1 por 1 pode não encontrar par, e a doação seria o motor, não um extra.
4. **IA filtra, não garante.** Uma foto não prova lacre nem validade, e foto se reaproveita. A validação pega erro honesto, não fraude. Além disso, validar antes de publicar cria espera e rejeição por engano.
5. **Banimento na 1ª denúncia × abuso.** Sem revisão, qualquer um derruba qualquer um (vingança, revendedor eliminando concorrência). Alguém precisa revisar; hoje seria o fundador.
6. **Verificação de documento × LGPD.** CPF e foto de documento são dados pessoais. Selfie para comparação facial é biometria, dado sensível. Difícil justificar como proporcional (princípio da necessidade) para trocar um pacote de fralda.
7. **Pacote fechado doado × revenda.** É fácil de revender. O revendedor pode aparecer do lado de quem **recebe** doações.
8. **Chat no app × escopo e LGPD.** Dá controle e segurança, mas exige armazenar mensagens (retenção), moderar (filtro anti-revenda) e é a parte mais complexa de construir.
9. **Bairro × proximidade.** Proximidade calculada entre bairros mantém a coleta mínima. Proximidade por GPS do celular passa a coletar localização precisa.
10. **Fotos × privacidade.** Fotos de celular carregam GPS exato nos metadados (EXIF), que anula a proteção do bairro se não for removido. Detectar criança num serviço de IA de terceiro significa compartilhar a foto com esse fornecedor.

## Opções levantadas (não decididas)

- **Incentivo a quem entra primeiro:** lista de desejos com aviso quando aparecer o item; semear oferta com a rede do fundador; divulgar nos próprios grupos do Facebook; selo de pioneiro.
- **Métricas visíveis ao usuário:** impacto pessoal (fraldas que não foram para o lixo, economia estimada); prova social local ("8 trocas no seu bairro esta semana"), só a partir de um volume mínimo.
- **Política de denúncia:** graduada (oculta para revisão, bane após confirmação ou reincidência); por limiar (sai após N denúncias de pessoas diferentes); por gravidade (fralda aberta remove o post, golpe bane).
- **Verificação:** telefone obrigatório e documento opcional como selo; ou só telefone até surgir problema real.
- **Anti-revenda:** sem campo de preço; filtro de "vendo", "R$", "pix", links e telefone em post e chat; limite de posts ativos e de doações recebidas por período; "revenda" como motivo de denúncia.
- **Reputação:** contar trocas concluídas em vez de nota; selo "novo" com sinais alternativos (telefone verificado, tempo de conta); avaliação só após troca confirmada pelos dois lados.
- **Disputa:** confirmação da troca pelos dois lados; botão "não compareceu"; possivelmente sem mediação humana, dado o valor baixo.
- **Pontos de encontro:** combinação livre ou lista curada de locais públicos/parceiros.

## Resolvido no grill (2026-11-09)

- **[D]** Fase 1 do protótipo: **Ilha do Governador**; o Rio inteiro continua sendo o destino.
- **[D]** **Doação é o motor** do protótipo; troca é opção do Post, sem casamento automático. Os dados dos grupos do Facebook da Ilha (tamanhos, troca x doação) ainda confirmam ou refutam isso [H].
- **[D]** **Sem chat de texto livre** no protótipo: "quero" → aceita/recusa → ponto e horário em opções fixas (ADR 0001).
- **[D]** Pontos de encontro: lista curada e manual, 3 a 5 locais públicos, sem parceria formal.
- **[D]** Denúncia graduada: oculta o Post na hora; o fundador revisa e confirma qualquer banimento. Motivos fixos: pacote aberto ou vencido, suspeita de revenda, não compareceu. Prazo de revisão: **24 horas**.
- **[D]** Verificação: só telefone; documento não entra (volta como selo opcional se houver fraude real, com `/research` antes).
- **[D]** IA como alerta, não como porteira; o Post publica na hora (ADR 0002).
- **[D]** Proximidade por bairro marcado, sem GPS; remover EXIF das fotos no upload.
- **[D]** Menor protótipo: cadastro por telefone, Post de fralda, busca por tamanho e bairro, Pedido, ponto/horário fixos, confirmação pelos dois lados (contador de trocas concluídas como reputação), denúncia. Fora: chat livre, IA porteira, documento, GPS, código de barras, parcerias, métricas ao usuário, receita.
- **[D]** Critério de sucesso: em 4 semanas, ao menos 10 entregas confirmadas pelos dois lados entre ~30 usuários da Ilha (números ajustáveis). Semear as primeiras famílias é trabalho do fundador, fora do código.

## Resolvido pela pesquisa de LGPD (2026-11-11)

Fonte: [pesquisa-lgpd.md](pesquisa-lgpd.md). **Não é parecer jurídico**; as perguntas para advogado estão na seção 13 de lá. Abaixo, o que a pesquisa responde (fato, com a seção) e o que ela pede que o fundador decida (**[?]**).

### O que a pesquisa responde

- **A LGPD se aplica desde o primeiro usuário**, mesmo sem receita: o fundador é o controlador, pessoa natural, e agente de pequeno porte (seções 1 e 4).
- **Encarregado (DPO): não é obrigatório** no regime de pequeno porte. Em troca, é obrigatório manter um canal de contato com o titular. Os prazos de atendimento e de comunicação de incidente contam em dobro. O benefício cai se o tratamento virar de alto risco; IA de visão de terceiro pode causar isso (seção 4).
- **Bases legais:** execução de contrato (os termos de uso) para telefone, Post, foto, bairro, Pedido, confirmações e contador. Legítimo interesse, com teste de balanceamento escrito, para Denúncia, banimento e logs. Consentimento não é recomendado, porque pode ser revogado a qualquer momento (seção 2).
- **Documento e biometria:** o STJ considera o IP suficiente para identificar o usuário, então CPF, documento e selfie não se justificam (seção 3). Isso reforça a decisão "documento não entra". Foto de pacote não é dado biométrico; reconhecimento facial deve ser evitado (seção 6).
- **"Identificável" (ADR 0004):** telefone verificado + registros de IP, porta lógica e data/hora do cadastro e das ações relevantes (seção 3).
- **Mensagens de chat:** saíram do escopo com o ADR 0001; não há o que reter.
- **Retenção:** a LGPD não fixa prazos; manda eliminar ao fim da finalidade. A pesquisa propõe prazos por dado, a validar com advogado (seção 5.3).
- **EXIF:** nenhuma norma exige removê-lo expressamente, mas a remoção decorre dos arts. 6º e 46 (seção 6). A decisão do grill continua valendo.
- **Criança na foto:** é dado de criança (art. 14). O coerente é **não publicar e eliminar** (pedir nova foto), não desfocar. Detectar criança com IA de terceiro já é tratar e compartilhar imagem de criança (seção 6).
- **IA de terceiro:** o fornecedor vira operador; antes de usar, checar se ele treina modelos com as fotos, onde processa, por quanto tempo retém e se assina as cláusulas-padrão da ANPD (seção 7). O ADR 0002 evita a decisão "unicamente automatizada" do art. 20.
- **Aplicação hospedada nos EUA é transferência internacional**, mesmo com o banco em São Paulo. Os EUA não têm adequação; os caminhos são frágeis para uma pessoa física (seção 8).
- **Decreto 12.975/2026:** pede que a remoção de conteúdo seja comunicada ao autor com o fundamento e o meio de contestar. Se isso alcança um provedor pessoa física pequeno **não está confirmado** (seções 9.2 e 13).

### Para o fundador decidir

- **[?]** Guardar logs de IP, porta e data/hora por **6 meses**, de forma voluntária (espelhando o Marco Civil, art. 15).
- **[?]** Hospedar a aplicação na **região de São Paulo** e mapear os serviços estrangeiros acessórios (SMS, e-mail, logs, IA) antes de escolher a stack.
- **[?]** Trocar "o app deve detectar criança na foto" (seção LGPD acima) por: instrução na tela de upload ("fotografe só o pacote"), proibição nos termos, e remoção na revisão manual. Falta definir **como a foto com criança chega ao fundador**: os motivos fixos de Denúncia não cobrem esse caso.
- **[?]** Adotar a tabela de prazos de retenção da seção 5.3 (ou ajustar), inclusive o hash do telefone do banido depois de pedido de exclusão (maior incerteza da pesquisa).
- **[?]** Incluir no fluxo de Denúncia um **aviso ao Anunciante com o motivo e um meio de contestar**, mesmo antes de confirmar se o Decreto 12.975/2026 se aplica.
- **[?]** Uso só por **maiores de 18 anos**, nos termos.
- **[?]** Continuar como pessoa física ou abrir PJ (pergunta para advogado e contador; muda quem é o controlador e pode atrair o Marco Civil, art. 15).

## Perguntas em aberto para o grill

> As perguntas 1, 2, 4, 5, 6, 7, 8 e 9 foram resolvidas acima. A 3 foi resolvida em parte (ADR 0002). Seguem abertas: a pergunta 10, os itens **[?]** da pesquisa de LGPD e o recall de fraldas. Desenho do protótipo aprovado pelo fundador em 2026-11-09.

1. Recorte de lançamento: a cidade inteira ou uma zona/bairro/comunidade?
2. A troca direta encontra par, ou a doação é o motor? Como validar isso antes de construir?
3. O que a validação por IA promete ao usuário, e quanto atraso é aceitável?
4. Política de denúncia: qual modelo e quem revisa?
5. Documento: obrigatório, opcional ou nunca?
6. Pontos de encontro: livres ou curados?
7. Chat no primeiro protótipo ou depois?
8. Proximidade por bairro ou por GPS?
9. Qual é o menor protótipo que testa a hipótese?
10. Sem resposta ainda: modelo de receita; dados reais dos grupos do Facebook (volume, tamanhos mais trocados); recall de fraldas (baixa prioridade).

## Pesquisa pendente (`/research`, com fonte e URL)

- ~~Fralda descartável tem validade impressa? Em que formato? O que o código de barras (EAN) do pacote identifica?~~ Ver [pesquisa-fralda-validade-ean.md](pesquisa-fralda-validade-ean.md).
- ~~LGPD: tratamento de documento e biometria; base legal adequada para cada dado; necessidade de encarregado (DPO) para um app pequeno; retenção e exclusão de mensagens de chat.~~ Ver [pesquisa-lgpd.md](pesquisa-lgpd.md) (documento e chat saíram do escopo no grill/ADR 0001; biometria só tocada na seção 6).
- ~~LGPD: remoção de metadados de foto e uso de serviço de IA de terceiro para analisar imagens.~~ Ver [pesquisa-lgpd.md](pesquisa-lgpd.md).
- ~~CDC: responsabilidade de uma plataforma intermediária em troca e doação entre pessoas físicas.~~ Ver [pesquisa-cdc-doacao-troca-pf.md](pesquisa-cdc-doacao-troca-pf.md).
- Recall de fraldas no Brasil (baixa prioridade).