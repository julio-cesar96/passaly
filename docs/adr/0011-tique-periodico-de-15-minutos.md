---
status: accepted
---

# Tarefas no tempo por um tique periódico de 15 minutos

Validade, prazo de 24 h da Denúncia, lembrete do D4 e retenção não têm job próprio. Um agendador (Cloud Scheduler) chama a cada 15 min um único caso de uso, "o relógio avançou (agora)", que varre o que venceu. Esse é o mesmo caso de uso que o relógio controlável chama nos testes, então o comportamento no tempo é testado pelo ponto de teste único da spec (#2). O tique é idempotente: rodar duas vezes no mesmo instante não muda nada. O endpoint aceita só chamadas autenticadas do Scheduler (OIDC).

## Considered Options

- **Agendar um job por evento** (fila com atraso para cada Denúncia ou validade): rejeitado. É mais preciso, mas é outra infraestrutura e não passa pelo mesmo ponto de teste.

## Consequences

- Precisão de até 15 min: uma Denúncia pode destravar às 24 h e 14 min. Aceito no protótipo.
- O tique acorda o banco do Neon a cada 15 min (~60 CU-h/mês, dentro do plano Free).
- O painel do fundador mostra a última execução do tique e alerta se ele ficar 1 h sem rodar. Se o tique parar, prazos e validade param junto.
