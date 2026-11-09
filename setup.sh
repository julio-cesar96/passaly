#!/usr/bin/env bash
# Rodar UMA vez, na raiz do repo passaly, depois de copiar os outros arquivos.
set -euo pipefail

# 1) Instala as skills do Matt nas duas ferramentas (cópias reais, editáveis)
#    -> .claude/skills (Claude Code) e .agents/skills (Antigravity)
npx -y skills@latest add mattpocock/skills -a claude-code antigravity --copy -y \
  -s ask-matt -s grill-with-docs -s grilling -s domain-modeling -s prototype \
  -s research -s to-spec -s to-tickets -s implement -s tdd -s code-review \
  -s diagnosing-bugs -s handoff -s setup-matt-pocock-skills

# 2) MCP para o Antigravity
mkdir -p .agents .agent/workflows
ln -sfn ../.mcp.json .agents/mcp_config.json

# 3) Workflows do Antigravity (slash commands) para as skills acionadas pelo usuário.
#    setup-matt-pocock-skills fica de fora: rode-a no Claude Code (usa arquivos auxiliares com link relativo).
for s in ask-matt grill-with-docs to-spec to-tickets implement handoff; do
  ln -sfn "../../.claude/skills/$s/SKILL.md" ".agent/workflows/$s.md"
done

mkdir -p docs/adr
touch docs/adr/.gitkeep
echo "Pronto. Confira: ls -la .agents .agent/workflows"
