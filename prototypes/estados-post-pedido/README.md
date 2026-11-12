# PROTÓTIPO DESCARTÁVEL: estados de Post e Pedido

Não é base do app. Serve para responder uma pergunta: **quais são os estados de Post e de Pedido, e quais transições são permitidas?**

```sh
node --experimental-strip-types --no-warnings prototypes/estados-post-pedido/cenarios.ts          # todos os cenários
node --experimental-strip-types --no-warnings prototypes/estados-post-pedido/cenarios.ts 8        # só o cenário 8
node --experimental-strip-types --no-warnings prototypes/estados-post-pedido/cenarios.ts tabela   # só as tabelas
```

- `modelo.ts`: módulo puro `(estado, ação) => estado`. As tabelas `TRANSICOES_POST` e `TRANSICOES_PEDIDO` são a resposta.
- `cenarios.ts`: os casos de borda. Depois de cada passo imprime o estado completo, com `»` nas linhas que mudaram e `✉` nos avisos do sistema.

## Decisões do fundador (2026-11-11), marcadas como [Dn] no código

- **D1.** "Não compareceu" é uma Denúncia contra a pessoa. Só oculta o Post quando a acusada é o Anunciante. Se o interessado faltou, o Pedido é cancelado e o Post volta a ativo para o próximo da fila.
- **D2.** Ao aceitar um Pedido, os outros ficam na fila.
- **D3.** Desistência depois do aceite: só registro, visível ao fundador. Vale até antes da primeira confirmação de entrega.
- **D4.** Só um lado confirmou: 24 h depois do horário combinado, quem falta recebe aviso. O Pedido não conclui sozinho.
- **D5.** Pedido em revisão cancelado: não soma no contador, sem outra punição (por enquanto).
- **D6.** Post denunciado com Pedido em andamento: o Pedido congela e os dois recebem aviso.
- **D7.** Denúncia sem revisão em 24 h: o Post volta a aparecer e o Pedido descongela. A Denúncia continua aberta.
- **D8.** Várias Denúncias: o Post só volta a aparecer quando nenhuma o segura mais.
- **D9.** Validade vence com Pedido aceito ou combinado: o Pedido é encerrado, com aviso.
- **D10.** O formulário não aceita data de validade no passado. Isso não contraria o ADR 0002, que trata da IA.
- **D11.** Banimento: todo Pedido em andamento com a pessoa banida é encerrado, e o outro lado recebe aviso. Os Posts voltam a ativo e o dono retira se o item já foi entregue.
- **D12.** Denúncia procedente depois da entrega: o contador volta só para o dono do Post.
- **D13.** O Anunciante propõe ponto e horário, e as contrapropostas alternam. Confirmar a entrega vale a qualquer momento depois de combinar. "Não compareceu" só a partir do horário combinado.
- **D14.** Com Pedido em andamento, o Anunciante desiste dele antes de retirar o Post.
- **D15.** O contador passa a se chamar "Entregas concluídas". Contrapartida = Post do interessado oferecido num Pedido de Troca: obrigatória em Troca, opcional em "doação ou troca", proibida em Doação.
