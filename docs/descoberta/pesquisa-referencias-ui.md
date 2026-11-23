# Pesquisa: referências de UI trazidas pelo fundador

- Data e acesso às fontes: 2026-11-23. Complementa [pesquisa-ui.md](pesquisa-ui.md).
- Método: leitura das docs e do código clonado (`vercel-labs/ui` `2f1b22c`, `benjitaylor/skills` `299140f`), `npm view`, `gh api` e bundle medido com esbuild (minificado, gzip). Nenhum script das skills foi rodado e nada foi instalado no projeto.
- **(inferência)** marca conclusão minha.

## Resumo

| Referência | O que é | Recomendação **(inferência)** |
|---|---|---|
| UI SDK | primitivos de comportamento da Vercel, beta | referência; não instalar agora |
| Phosphor | ícones, MIT | adotado pelo fundador |
| Stageshow | skill de demo animada de produto | não instalar agora; rever para a landing |
| ThinkUI | MCP pago de referências | não assinar agora |
| Limora | gerador de imagem por IA | não usar |

## UI SDK

- **Identidade:** o link era `x.com/uisdk`, que não li (robots.txt proíbe leitura automática). O fundador confirmou em 2026-11-23 que é o [vercel-labs/ui](https://github.com/vercel-labs/ui) ([docs](https://ui-sdk.dev/docs/react/llms.txt)), e decidiu que fica como referência, sem instalar.
- **Estágio:** primeira beta no npm em 12/11/2026; `0.1.0-beta.16` em 23/11/2026, 14 betas em 11 dias ([npm](https://www.npmjs.com/package/@ui-sdk/react)). O README avisa que API e comportamento podem mudar antes da versão final ([README](https://github.com/vercel-labs/ui#beta-terms)). Apache-2.0.
- **O que entrega:** mais de 50 componentes sem estilo (Field, OTP Input, Drawer, Toast, File Input) e os comportamentos por baixo; o adaptador de React exige React 19+ ([docs](https://ui-sdk.dev/docs/react/llms.txt)).
- **Sobreposição:** Dialog, Drawer, Toast, Field, Select, Toggle Group e Button já existem no Base UI do ADR 0012.
- **OTP:** um só `<input>` nativo com `one-time-code`, compatível com a nossa regra ([doc](https://ui-sdk.dev/docs/react/components/otp-input)).
- **Peso medido**, acima do React (Dialog, Drawer, Toast, Field, Select, grupo de escolha, OTP): Base UI 1.9.0 + `input-otp` 1.5.0 = +89 KB; UI SDK beta.16 = +98 KB. Os conjuntos não são idênticos; serve como ordem de grandeza.
- **Leitor de tela:** a doc lista testes automáticos. Busquei "TalkBack", "VoiceOver" e "NVDA" nas docs do pacote e não achei.
- **Agente:** `createAgent` e WebMCP deixam um agente de IA ler e operar a tela ([doc](https://ui-sdk.dev/docs/agents/llms.txt)). A aplicação precisa chamá-los. Conflita com "Nada de IA" no produto **(inferência)**.
- **Rever quando:** sair do beta, ou o Base UI não cobrir algo que a spec pede **(inferência)**.

### Onde repetimos o que um primitivo faz

Em `src/client/` **nada**: a única tela (`inicio.tsx`) não tem controle interativo. No protótipo de paletas, descartável, repetimos:

| Onde | O que foi feito à mão | O que faltou |
|---|---|---|
| `telaCodigo` | `<input>` cru para o código | filtro de dígito, colar com hífen, `required` |
| `telaCodigo` | `id` e `aria-describedby` manuais | ligação automática, foco no campo com erro |
| `telaCodigo` | "Pedir outro código" com `disabled` | foco mantido e aviso quando libera |
| `telaCodigo` | "Entrar" sem estado ocupado | trava de envio duplo e anúncio |
| `telaLista` e clique em `.t-chip` | laço que troca `aria-pressed` | teclado de grupo e valor único |

A regra está no [guia de UI](../guia-de-ui.md), seção "Comportamento vem de primitivo".

## Achado: CSP estrito e estilos injetados

O ADR 0013 pede `default-src 'self'`, que sem `style-src` próprio bloqueia `<style>` inline. Isso atinge a stack **já escolhida**:

- `input-otp` 1.5.0 cria um `<style>` em runtime e aceita `nonce` (lido no código do pacote);
- o Base UI renderiza `<style>` em alguns componentes e oferece `CSPProvider` ([doc](https://base-ui.com/react/utils/csp-provider)).

O nonce muda a cada resposta, e a casca do PWA fica em cache (#9). Como os dois convivem **não foi testado**: conferir na #31, que liga o CSP **(inferência)**.

## Phosphor

- `@phosphor-icons/react` 2.1.10, MIT, última versão no npm em 22/05/2025 ([npm](https://www.npmjs.com/package/@phosphor-icons/react)); último commit em 06/01/2026, só doc ([repo](https://github.com/phosphor-icons/react)).
- Pacote npm, SVG no bundle: compatível com o ADR 0013. O registry do shadcn já lista `phosphor` ([código](https://github.com/shadcn-ui/ui/blob/main/packages/registry/src/icons/libraries.ts)).
- Peso medido, 12 ícones equivalentes: +7,7 KB gzip contra +3,1 KB do `lucide-react` 1.78.0.
- O README pede importar por arquivo em desenvolvimento, para não transpilar mais de 9.000 módulos ([README](https://github.com/phosphor-icons/react#import-performance-optimization)).

## Stageshow

- Skill que monta UI falsa, parada ou animada, para página de marketing, em React ([página](https://benji.org/stageshow)). MIT, mas logos e ícones de app incluídos não são cobertos pela licença ([NOTICE](https://github.com/benjitaylor/skills/blob/main/stageshow/NOTICE.md)).
- O `package.json` da skill usa React 18, Vite 6, lucide e Playwright; nós usamos React 19 e Vite 8.
- O guia pede a tela real em HTML no hero. Uma demo animada seria outra decisão. Vale já: poucas palavras reais, recorte com intenção e `prefers-reduced-motion` **(inferência)**.

## ThinkUI

- MCP pago (US$ 7,99 a 15,99 por mês, ou US$ 152 vitalício, preços com desconto), com teste de 3 dias que exige cartão ([site](https://thinkui.xyz/)).
- 428 das 1.565 capturas têm licença permissiva; o resto é só para estudo.
- A política diz que só a busca é enviada e que ela não vai para log ([privacidade](https://thinkui.xyz/privacy)). Ficaria no desenvolvimento, então não fere o ADR 0013 **(inferência)**.

## Limora

- Gerador de imagem, vetor, vídeo e 3D por IA ([site](https://limora.ai/app/community?tab=skills)). A aba de skills não abriu sem JavaScript, então **não li a lista**. Pelo texto da página, "skill" ali é receita que gera arte pronta, não skill de agente de código.
- O guia proíbe imagem gerada por IA no produto.
