---
status: accepted
---

# Hospedagem: Cloud Run, Neon e GCS em São Paulo

Para cumprir o ADR 0005 com teto de ~R$ 50/mês e pouca operação:

- **App:** imagem Docker do Hono no Google Cloud Run em `southamerica-east1`, sem instância mínima.
- **Agendador:** Cloud Scheduler na mesma região, que chama o tique ([ADR 0011](0011-tique-periodico-de-15-minutos.md)) e o dump.
- **Banco:** Postgres no Neon em `aws-sa-east-1`, plano Free.
- **Fotos:** bucket privado do GCS em `southamerica-east1`.

O Free do Neon só guarda 6 h de histórico, então um job diário grava `pg_dump` num bucket do GCS em São Paulo, apagado após 7 dias. Ver [pesquisa-stack.md](../descoberta/pesquisa-stack.md).

## Considered Options

- **Cloud SQL** (~US$ 15/mês): rejeitado por custo acima do teto. Seria a opção de um fornecedor só.
- **Neon Launch** (~US$ 7–9/mês, 7 dias de restauração nativa): adiado. Entra se o Free apertar, e aí o dump pode sair.
- **Supabase:** o Free pausa após 1 semana sem uso e o Pro custa US$ 25. O Storage põe CDN global na frente dos arquivos.
- **Fly `gru`:** o Postgres gerenciado custa US$ 38.
- **Oracle Always Free e Lightsail/EC2:** VM operada pelo fundador, e a Oracle pode recolher instância ociosa.
- **Cloudflare R2:** sem localização no Brasil.
- **Railway e Render:** sem região no Brasil.

## Consequences

- **Domínio:** URL padrão `*.run.app` no protótipo. O domain mapping do Cloud Run não existe em `southamerica-east1`, o load balancer custa ~US$ 18/mês e o Firebase Hosting é CDN global. Gatilho para pôr domínio próprio (Registro.br) com load balancer: hipótese da #2 confirmada ou reclamação de confiança no link. Trocar de domínio obriga os usuários a reinstalar o PWA e entrar de novo por SMS.
- **Cold start** de 1 a 3 s quando o app e o banco estão dormindo.
- **Backup:** o dump guarda dado de conta excluída por até 7 dias, o que precisa entrar na política de privacidade e na tabela de retenção.
- **Fotos:** só por link assinado de 5 min, gerado quando o caso de uso autoriza. Sem URL pública e sem CDN. A eliminação é feita pela rotina de retenção, não por regra do bucket.
- **Segredos** (chave do hash de banido, URL do Neon) ficam no Secret Manager com replicação só em `southamerica-east1`.
- **Ambientes:** só local (Postgres em Docker) e produção.
- **Deploy e CI:** deploy manual com `gcloud run deploy`. O CI (GitHub Actions) roda só lint, tipos e testes com dados fictícios.
- Google e Neon são empresas americanas com dado em São Paulo. A pergunta 7 da seção 13 da pesquisa de LGPD (acesso remoto do exterior) vale para os dois.
