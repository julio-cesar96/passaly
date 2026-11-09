# AGENTS.md

Fonte única da verdade para qualquer agente de IA neste repositório (Claude Code, Antigravity, Codex etc.). `CLAUDE.md` apenas importa este arquivo. Em divergência entre documentos, **este arquivo prevalece**.

## O projeto

**Passaly** — PWA (depois app) para trocar e doar itens de bebê (fraldas, roupas, carrinho, brinquedos etc.) entre pais. Nasceu de um problema real: muita coisa comprada não dá tempo de usar, e a troca hoje acontece espalhada em grupos de Facebook. A ideia é centralizar isso.

Estágio: **ideia**. Ainda não há decisão de produto, stack nem código.

## Como trabalhamos

- Idioma: português do Brasil.
- Usamos as skills do Matt Pocock (`mattpocock/skills`). Fluxo: `/grill-with-docs` → `/prototype` → `/to-spec` → `/to-tickets` → `/implement` (com `/tdd` e `/code-review`).
- Skills de comando (`/grill-with-docs`, `/to-spec`, `/to-tickets`, `/implement`, `/setup-matt-pocock-skills` etc.) são **acionadas só pelo usuário**. O agente não as dispara sozinho; pode sugerir qual rodar.
- Não inventar fato. Para pesquisa (concorrentes, regras de segurança de produto infantil, LGPD), usar `/research` e citar fonte com URL.

## Fase atual: DESCOBERTA

- **Não escrever código de aplicação** nem escolher stack até existir uma spec aprovada.
- Decisões difíceis de reverter, surpreendentes e com trade-off real viram ADR curto em `docs/adr/` (pela skill `domain-modeling`). Vocabulário do domínio fica em `GLOSSARY.md`.
- O produto envolve bebês e dados de pais: **segurança do item** (ex.: itens recolhidos, cadeirinha/berço usados) e **LGPD** entram como requisito desde o início.

## Git

- Trabalhar em branch de feature. Nunca commitar na `main`.
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
GLOSSARY.md               ← linguagem do domínio
```

## Agent skills

### Issue tracker

Issues e specs ficam no GitHub Issues de `julio-cesar96/passaly` (CLI `gh`). See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: um `GLOSSARY.md` + `docs/adr/` na raiz. See `docs/agents/domain.md`.
