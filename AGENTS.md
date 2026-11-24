# AGENTS.md

Fonte única da verdade para qualquer agente de IA neste repositório (Claude Code, Antigravity, Codex etc.). `CLAUDE.md` apenas importa este arquivo. Em divergência entre documentos, **este arquivo prevalece**.

## O projeto

**Passaly** — PWA (depois app) para trocar e doar itens de bebê (fraldas, roupas, carrinho, brinquedos etc.) entre pais. Nasceu de um problema real: muita coisa comprada não dá tempo de usar, e a troca hoje acontece espalhada em grupos de Facebook. A ideia é centralizar isso.

Estágio: **spec aprovada, stack definida e tickets criados**; o código tem o esqueleto do monólito (issue #5) e a base de UI (issue #31). O primeiro protótipo é só fralda descartável na Ilha do Governador (issue #2).

## Como trabalhamos

- Idioma: português do Brasil.
- Usamos as skills do Matt Pocock (`mattpocock/skills`). Fluxo: `/grill-with-docs` → `/prototype` → `/to-spec` → `/to-tickets` → `/implement` (com `/tdd` e `/code-review`).
- Skills de comando (`/grill-with-docs`, `/to-spec`, `/to-tickets`, `/implement`, `/setup-matt-pocock-skills` etc.) são **acionadas só pelo usuário**. O agente não as dispara sozinho; pode sugerir qual rodar.
- Não inventar fato. Para pesquisa (concorrentes, regras de segurança de produto infantil, LGPD), usar `/research` e citar fonte com URL.

## Fase atual: IMPLEMENTAÇÃO PELOS TICKETS

- **Spec aprovada:** issue #2 (primeiro protótipo). Em divergência com ela, valem os ADRs e o `GLOSSARY.md`.
- **Stack definida** (ADRs 0008 a 0013; fatos em `docs/descoberta/pesquisa-stack.md`):
  - TypeScript num monólito: SPA Vite + React + TanStack Router/Query, servido por Hono em Node, sem SSR. Postgres com Drizzle. pnpm, Vitest, Biome, TS estrito (ADR 0008).
  - Tudo em São Paulo: Cloud Run + Cloud Scheduler, Neon (`aws-sa-east-1`, Free + `pg_dump` diário de 7 dias), fotos em bucket privado do GCS com link assinado de 5 min, segredos no Secret Manager preso à região, URL `*.run.app` (ADR 0009).
  - SMS: Twilio Verify chamada só pelo servidor, depois que o caso de uso "solicitar código" aplica os limites; volta ao Google se o advogado recusar as cláusulas por referência (ADR 0010).
  - Tarefas no tempo: tique idempotente de 15 min chamando o mesmo caso de uso do relógio dos testes (ADR 0011).
  - UI: shadcn/ui (Base UI) + Tailwind v4, código dos componentes em `src/client/ui/` (ADR 0012); nada de terceiro no navegador, garantido por CSP (ADR 0013). Convenções de tela (toque de 44 px, tipografia, temas, landing, roteiro TalkBack como critério de aceite) em `docs/guia-de-ui.md`. Antes de escrever tela, ler lá "Comportamento vem de primitivo" (não reescrever foco, teclado, seleção nem ARIA à mão) e os tokens de "Cor e tema".
- **Próximo passo:** o cadastro (#7), com SMS falso. O teste de entrega real pela Twilio Verify (#6, manual do fundador) foi adiado e bloqueia a #26 (nota no ADR 0010). Ordem e bloqueios ficam nas issues.
- Código de aplicação só a partir dos tickets, pelo fluxo `/implement` com `/tdd`. Testes só pela interface de casos de uso, com relógio controlável e SMS falso. Única exceção: o teste de contraste dos tokens de cor (`docs/guia-de-ui.md`), que lê o CSS.
- Nenhum serviço estrangeiro além do SMS; nada de e-mail, analytics, monitoramento de terceiro, IA ou WhatsApp. Telefone nunca vai para log.
- "Nada de IA" vale para o **produto**: nenhum dado de usuário passa por IA. IA no desenvolvimento e no design é permitida.
- Decisões difíceis de reverter, surpreendentes e com trade-off real viram ADR curto em `docs/adr/` (pela skill `domain-modeling`). Vocabulário do domínio fica em `GLOSSARY.md`.
- O produto envolve bebês e dados de pais: **segurança do item** (ex.: itens recolhidos, cadeirinha/berço usados) e **LGPD** entram como requisito desde o início.

## Git

- Trabalhar em branch de feature. Nunca commitar na `main`.
- Commits no padrão Conventional Commits: `tipo(escopo opcional): descrição` em português,
  no imperativo e em minúsculas. Tipos: `feat`, `fix`, `test`, `refactor`, `docs`, `chore`,
  `ci`, `build`. Rodapé cita o ticket (`Refs #5` ou `Closes #5`).
- Sem `git push` sem pedido explícito.

## Estrutura do repositório

```
AGENTS.md                 ← fonte da verdade (Antigravity e outros)
CLAUDE.md                 ← importa AGENTS.md (Claude Code)
.claude/skills/           ← skills (originais, instaladas por `npx skills`)
.claude/settings.json     ← permissões do Claude Code
.agents/skills/           ← cópia das skills para Antigravity e outros
.agent/workflows/         ← symlinks p/ SKILL.md (slash commands no Antigravity)
.mcp.json                 ← MCPs (Claude Code)
.agents/mcp_config.json   ← symlink p/ .mcp.json (Antigravity)
skills-lock.json          ← versões das skills instaladas
docs/adr/                 ← decisões
docs/descoberta/          ← pesquisas e contexto da descoberta
GLOSSARY.md               ← linguagem do domínio
docs/guia-de-ui.md        ← convenções de tela (não-ADR)
```

## Agent skills

### Issue tracker

Issues e specs ficam no GitHub Issues de `julio-cesar96/passaly` (CLI `gh`). See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: um `GLOSSARY.md` + `docs/adr/` na raiz. See `docs/agents/domain.md`.
