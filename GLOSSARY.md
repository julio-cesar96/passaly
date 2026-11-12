# Passaly

Plataforma para pais trocarem e doarem itens de bebê entre si, sem revenda. Começa só com fralda descartável, na Ilha do Governador (Rio de Janeiro).

## Language

### Pessoas

**Anunciante**:
Usuário que publica um Post e declara o estado e a validade do item.
_Avoid_: Vendedor, doador (quando o Post for de troca)

**Interessado**:
Usuário que faz um Pedido num Post. A mesma pessoa pode ser Anunciante num Post e Interessado em outro.
_Avoid_: Comprador, receptor

### Oferta e combinação

**Post**:
Oferta publicada por um Anunciante de um item (hoje, pacote de fralda), marcada como troca, doação ou ambos.
_Avoid_: Anúncio, classificado

**Doação**:
Entrega do item sem contrapartida. É o fluxo principal do protótipo.
_Avoid_: Presente

**Troca**:
Entrega do item em contrapartida de outro item de bebê. Opção do Post, sem casamento automático de pares.
_Avoid_: Permuta, venda

**Contrapartida**:
Post do Interessado oferecido num Pedido de Troca. Obrigatória em Troca, opcional em Post de doação ou troca, proibida em Doação.
_Avoid_: Pagamento, item de troca

**Pedido**:
Manifestação de interesse do Interessado num Post ("quero"), que o Anunciante aceita ou recusa.
_Avoid_: Reserva, compra

**Ponto de encontro**:
Local público escolhido da lista curada, onde o item é entregue sem expor o endereço de ninguém.
_Avoid_: Endereço de entrega

**Entrega**:
Passagem do item do Anunciante ao Interessado no Ponto de encontro. Só conta como concluída quando os dois lados confirmam.
_Avoid_: Troca (quando for Doação), venda

**Entregas concluídas**:
Número de Entregas que o usuário concluiu, como Anunciante ou como Interessado, em Doação ou Troca. É a reputação do protótipo.
_Avoid_: Trocas concluídas, nota, avaliação

### Moderação

**Denúncia**:
Aviso de um usuário contra outro, ligado a um Post ou Pedido, por um motivo fixo (pacote aberto ou vencido, suspeita de revenda, não compareceu). Só oculta o Post quando o denunciado é o Anunciante, e por no máximo 24 horas sem revisão.
_Avoid_: Reclamação, report

**Contestação**:
Resposta do denunciado a uma Denúncia, escolhida entre opções fixas, que a marca para a revisão. Não muda o estado de nada.
_Avoid_: Recurso, defesa

**Banimento**:
Bloqueio da conta por prazo indeterminado, sempre confirmado pelo fundador e reversível a pedido.
_Avoid_: Suspensão

**Revenda**:
Usar o Passaly para obter itens e vendê-los. É proibida; o Passaly não é brechó. Uso por empresa ou loja conta como Revenda.
_Avoid_: Comércio
