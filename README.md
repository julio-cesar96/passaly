# Passaly

PWA para pais doarem e trocarem itens de bebê. Contexto, decisões e vocabulário: [AGENTS.md](AGENTS.md), [docs/adr/](docs/adr/) e [GLOSSARY.md](GLOSSARY.md).

## Rodar no Mac

Pré-requisitos: Node 22 (`.nvmrc`), pnpm (`corepack enable` ou `npm i -g pnpm`) e Docker (Docker Desktop, OrbStack, Colima ou Rancher Desktop). Nenhuma conta externa é necessária.

```sh
pnpm install
docker compose up -d     # Postgres local, com os bancos passaly e passaly_test
pnpm db:migrate          # aplica as migrações de drizzle/ (na 1ª subida, espere uns segundos: o Postgres reinicia ao criar os bancos)
pnpm tique               # opcional: roda "o relógio avançou" uma vez
pnpm dev                 # API (Hono, porta 3000) + SPA (Vite) em http://localhost:5173
```

A tela inicial mostra a data/hora do último tique. Sem `.env`, o app usa o Postgres do `docker-compose.yml`; para outro banco, copie `.env.example` para `.env` e exporte as variáveis.

## Comandos

| Comando | O que faz |
| --- | --- |
| `pnpm test` | Testes (Vitest) contra o Postgres real em `passaly_test`; as migrações rodam antes |
| `pnpm typecheck` | TypeScript estrito |
| `pnpm lint` | Biome (lint + formatação); `pnpm exec biome check --write .` corrige |
| `pnpm db:generate` | Gera migração nova em `drizzle/` a partir de `src/server/db/schema.ts` |
| `pnpm build` / `pnpm start` | Build do SPA e do servidor; `NODE_ENV=production pnpm start` serve os dois |

## Estrutura

- `src/server/` — Hono em Node. `casos-de-uso/` é a interface de casos de uso, o único ponto de teste (spec #2); a API em `app.ts` é um adaptador fino sobre ela.
- `src/client/` — SPA em Vite + React + TanStack Router/Query, falando com a API pelo cliente tipado `hc`. Só pode importar **tipos** do servidor: o build quebra se importar código de `src/server/` ou pacotes de banco.
- `src/server/testes/` — dublês de borda: relógio controlável; o SMS falso fica em `src/server/sms/`.
- `drizzle/` — migrações versionadas.

Telefone nunca vai para log: a regra e a rede de segurança ficam em `src/server/log.ts`.
