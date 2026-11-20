---
status: accepted
---

# SPA (Vite + TanStack Router/Query) servido por Hono, num monólito sem SSR

O Passaly é TypeScript de ponta a ponta, num monólito só: um repositório, um processo, um deploy. O cliente é um SPA em Vite + React + TanStack Router + TanStack Query. O servidor é Hono em Node e serve o SPA estático e a API. A API é um adaptador fino sobre a interface de casos de uso, que é o único ponto de teste da spec (#2). O painel do fundador fica na mesma app, atrás de um papel na conta. Não há SSR: o app fica atrás de login e não precisa de SEO, e o PWA com a casca em cache (instalável, toda ação online) encaixa naturalmente num `index.html` estático. A fronteira cliente/servidor fica em pastas separadas, e o RPC tipado vem do cliente `hc` do Hono.

## Considered Options

- **TanStack Start** (estável, com skills de agente versionadas no pacote): rejeitado pelo modelo de execução isomórfico. Loaders rodam no servidor e no cliente, e server functions ficam junto do código de tela, então um import errado leva código de banco ou segredo para o navegador. Para quem revisa sozinho, é a classe de bug mais difícil de ver. É o caminho de migração se surgir necessidade de SSR, porque roda sobre o mesmo Router.
- **Next.js**: rejeitado pela complexidade (Server Components, camadas de cache) para revisar sozinho.
- **React Router v7 (framework)**: rejeitado pela preferência pelo ecossistema TanStack.

## Consequences

- Banco: Postgres com Drizzle e migrações versionadas. Os testes rodam contra Postgres real, não mock.
- Ferramentas: pnpm, Vitest, Biome, TypeScript `strict` com `noUncheckedIndexedAccess`.
- Sessão é do Passaly: cookie httpOnly de longa duração, revogável no Banimento e na exclusão. O fornecedor de SMS só verifica o telefone ([ADR 0010](0010-sms-pelo-identity-platform-com-blocking-function.md)).
- EXIF: o servidor regrava toda foto e descarta o original em memória. Não se confia no cliente.
- Erros vão só para o log da plataforma, sem dado pessoal (telefone nunca vai para log). Sem monitoramento de terceiro.
