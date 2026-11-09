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
- **[D]** Denúncia graduada: oculta o Post na hora; o fundador revisa e confirma qualquer banimento. Motivos fixos: pacote aberto ou vencido, suspeita de revenda, não compareceu. Prazo de revisão **pendente** (sugestão: 24 h).
- **[D]** Verificação: só telefone; documento não entra (volta como selo opcional se houver fraude real, com `/research` antes).
- **[D]** IA como alerta, não como porteira; o Post publica na hora (ADR 0002).
- **[D]** Proximidade por bairro marcado, sem GPS; remover EXIF das fotos no upload.
- **[D]** Menor protótipo: cadastro por telefone, Post de fralda, busca por tamanho e bairro, Pedido, ponto/horário fixos, confirmação pelos dois lados (contador de trocas concluídas como reputação), denúncia. Fora: chat livre, IA porteira, documento, GPS, código de barras, parcerias, métricas ao usuário, receita.
- **[D]** Critério de sucesso: em 4 semanas, ao menos 10 entregas confirmadas pelos dois lados entre ~30 usuários da Ilha (números ajustáveis). Semear as primeiras famílias é trabalho do fundador, fora do código.

## Perguntas em aberto para o grill

> As perguntas 1, 2, 4, 5, 6, 7, 8 e 9 foram resolvidas acima. A 3 foi resolvida em parte (ADR 0002). Seguem abertas: prazo de revisão das denúncias, a pergunta 10 e a pesquisa pendente.

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

- Fralda descartável tem validade impressa? Em que formato? O que o código de barras (EAN) do pacote identifica?
- LGPD: tratamento de documento e biometria; base legal adequada para cada dado; necessidade de encarregado (DPO) para um app pequeno; retenção e exclusão de mensagens de chat.
- LGPD: remoção de metadados de foto e uso de serviço de IA de terceiro para analisar imagens.
- CDC: responsabilidade de uma plataforma intermediária em troca e doação entre pessoas físicas.
- Recall de fraldas no Brasil (baixa prioridade).