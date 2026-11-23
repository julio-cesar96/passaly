---
status: accepted
---

# UI com shadcn/ui (variante Base UI) e Tailwind v4, com o código dos componentes no repo

As telas usam shadcn/ui na variante Base UI sobre Tailwind v4, mais `input-otp` para o código por SMS e `lucide-react` para ícones. O CLI do shadcn copia o código de cada componente para `src/client/ui/`, e a partir daí ele é **nosso**: revisado no PR como qualquer código e sem rotina de atualização do upstream. Pesou: sem runtime de CSS-in-JS nem codegen, Drawer mantido (o Vaul da variante Radix não tem mais manutenção), OTP em campo único (o padrão que preserva o autofill de `one-time-code`) e o mesmo Tailwind serve à landing. Ver [pesquisa-ui.md](../descoberta/pesquisa-ui.md).

## Considered Options

- **shadcn com Radix:** mais leve (+33 KB gzip contra +59 KB), rejeitado porque o Drawer depende do Vaul, sem manutenção.
- **Mantine:** nada copiado, rejeitado pelo OTP em caixas por dígito (atrapalha autofill e leitor de tela) e pelos 36 KB de CSS global.
- **React Aria Components:** único que documenta teste com TalkBack e traz pt-BR, rejeitado como base porque exige estilizar tudo e não tem OTP nem Toast estável. Fica como **plano B por componente**, onde a acessibilidade no celular pesar mais.
- **Chakra v3 e Park UI:** rejeitados (Emotion em runtime e CSP mais fraca; Park parado e com codegen).

## Consequences

- Correção de acessibilidade no upstream não chega sozinha. Se um bug de acessibilidade aparecer, conferir o componente do shadcn/Base UI mais recente antes de corrigir à mão.
- Item de registry de terceiro só entra depois de lido, e nunca com recurso remoto ([ADR 0013](0013-nada-de-terceiro-no-navegador.md)).
- **Landing:** é a rota pública `/` do mesmo SPA, com os mesmos componentes. Sem SEO (o [ADR 0008](0008-spa-com-hono-sem-ssr.md) continua valendo): o tráfego vem de link postado em grupo de Facebook e WhatsApp, e a prévia do link vem de tags Open Graph estáticas no `index.html`, que os robôs leem sem rodar JS.

## Nota de 2026-11-23

- Ícones passam de `lucide-react` para **Phosphor** (`@phosphor-icons/react`), por escolha do fundador. Custo medido: 12 ícones somam 7,7 KB gzip contra 3,1 KB do lucide. Última versão no npm em 22/05/2025. Ver [pesquisa-referencias-ui.md](../descoberta/pesquisa-referencias-ui.md).
