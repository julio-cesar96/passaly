# Guia de UI

Convenções de tela que não chegam a ser ADR. Decididas no grill de UI de 2026-11-20, a partir de [pesquisa-ui.md](descoberta/pesquisa-ui.md). Base: [ADR 0012](adr/0012-shadcn-base-ui-com-tailwind.md) (shadcn/Base UI + Tailwind) e [ADR 0013](adr/0013-nada-de-terceiro-no-navegador.md) (nada de terceiro no navegador).

## Acessibilidade

- Alvo: WCAG 2.2 AA, sem declarar conformidade nem exibir selo até o advogado responder (pergunta 14 de [pesquisa-lgpd.md](descoberta/pesquisa-lgpd.md)).
- Área de toque: token `--alvo-toque: 44px` em botão, ícone clicável, item de lista e campo. 24 px só nas exceções do 2.5.8 (ex.: link dentro de texto).
- Revisão de tela: skill `better-accessibility` (jakubkrehel/skills, commit `672ae44`). Ela trata 44 px como recomendação; aqui é regra do projeto.
- Contraste: texto ≥ 4,5:1 (≥ 3:1 se grande); componente e estado ≥ 3:1. Conferido nos dois temas.
- **Roteiro TalkBack** (critério de aceite de todo ticket de tela, feito pelo fundador num Android): entrar com o código; publicar um Post com foto; fazer um Pedido; combinar e confirmar a Entrega; excluir a conta. Rodar só os passos que a tela do ticket toca. VoiceOver quando houver iPhone à mão.

## Tipografia

- Pilha `system-ui`, nenhuma fonte baixada.
- Corpo com 16 px no mínimo, em `rem` (respeita a fonte do sistema). Testar com fonte grande no Android.
- Quatro tamanhos (pequeno, corpo, subtítulo, título), pesos 400 e 600. Só o título da landing é fluido (`clamp`).

## Cor e tema

- Paleta: **D. Barro neutro**, escolhida pelo fundador em 2026-11-23 num protótipo descartável (branch `prototipo/paletas`): barro em ação, selo e destaque, cinza neutro no resto. É a B sem o fundo creme, que com terracota cai num padrão de página gerada ([pesquisa-ui.md](descoberta/pesquisa-ui.md)).
- Claro e escuro seguindo o sistema (`prefers-color-scheme`), sem botão de alternar no protótipo. O tema padrão do shadcn traz `@custom-variant dark (&:is(.dark *))`, que espera a classe `.dark`: tirar essa linha, para o `dark:` do Tailwind seguir o sistema.
- Tela usa o token pelo papel (`bg-primary`, `text-muted-foreground`), nunca hex nem cor da escala do Tailwind.
- `border` só sobre `background`, `card` e `popover`. Sobre `muted` falha no escuro (2,97:1) e sobre `accent` e `secondary` falha nos dois temas. Sobre `muted`, usar `input` (4,16:1 e 3,68:1).
- `accent`, `secondary` e `muted` são fundo suave (menos de 1,4:1 contra a tela): não marcam estado sozinhos. Selecionado é `primary`.
- `primary` e `destructive` são próximos (1,26:1 no claro, 1,11:1 no escuro): erro leva sempre ícone e texto, e ação destrutiva diz o verbo ("Excluir conta") e pede confirmação.

- Contraste dos tokens garantido no CI por um teste do Vitest (`src/client/contraste.test.ts`): os dois temas têm os mesmos tokens, em hex, e cada par usado atinge o mínimo. É a exceção à regra de testes do AGENTS.md. Testa tokens, não telas.

Tokens no formato do shadcn:

```css
:root {
  color-scheme: light dark;
  --background: #FAFAFA;
  --foreground: #1F1C1B;
  --card: #FFFFFF;
  --card-foreground: #1F1C1B;
  --popover: #FFFFFF;
  --popover-foreground: #1F1C1B;
  --primary: #A33E23;
  --primary-foreground: #FFFFFF;
  --secondary: #F4E5DA;
  --secondary-foreground: #58291A;
  --muted: #F0F0F0;
  --muted-foreground: #5A5A5A;
  --accent: #F6DCCB;
  --accent-foreground: #58291A;
  --destructive: #9B1C31;
  --destructive-foreground: #FFFFFF;
  --border: #8A8A8A;
  --input: #737373;
  --ring: #A33E23;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #151515;
    --foreground: #EDEBEA;
    --card: #1D1D1D;
    --card-foreground: #EDEBEA;
    --popover: #1D1D1D;
    --popover-foreground: #EDEBEA;
    --primary: #EF8E6D;
    --primary-foreground: #2A0F06;
    --secondary: #33261F;
    --secondary-foreground: #F1E0D5;
    --muted: #262626;
    --muted-foreground: #ADADAD;
    --accent: #3D2A20;
    --accent-foreground: #F7DDCD;
    --destructive: #FF8FA0;
    --destructive-foreground: #2B0509;
    --border: #6E6E6E;
    --input: #7D7D7D;
    --ring: #EF8E6D;
  }
}
```

- Sem opacidade em token (`bg-primary/80`, `ring-ring/50`), comum nos componentes do shadcn: sai dos pares testados. Anel de foco é `outline-ring` opaco, 2 px.

## Estilo e CSP

- `<style>` em runtime é bloqueado pelo CSP ([ADR 0013](adr/0013-nada-de-terceiro-no-navegador.md)). A injeção é desligada na origem (`CSPProvider disableStyleElements` em `main.tsx` para o Base UI; `#input-otp-style` no `index.html` para o `input-otp`) e as regras ficam em `src/client/ui/estilos-injetados.css`. Conferir esse arquivo ao atualizar qualquer das duas. Sem nonce, então serve à casca em cache da #9.
- Componente novo do shadcn: trocar import `@/` por relativo com `.js`, altura por `--alvo-toque` (`min-h-alvo-toque`, `size-alvo-toque`) e conferir o console no build servido pelo Hono.

## Ícones

- Phosphor (`@phosphor-icons/react`), escolha do fundador em 2026-11-23 no lugar de `lucide-react` ([ADR 0012](adr/0012-shadcn-base-ui-com-tailwind.md)). No shadcn: `"iconLibrary": "phosphor"` no `components.json`.
- Uma família só: componente do shadcn que chegar com `lucide-react` é trocado antes do PR.
- Importar por arquivo (`@phosphor-icons/react/dist/csr/MapPin`), para o Vite não transpilar o pacote inteiro em desenvolvimento.
- Peso `regular`; `fill` só para estado ativo. Ícone ao lado de texto leva `aria-hidden`; botão só de ícone leva nome acessível.

## Comportamento vem de primitivo

Foco, teclado, seleção, fechamento, ARIA e anúncio a leitor de tela não são escritos à mão. Antes de escrever `role=`, `aria-*` de estado, `tabIndex`, `onKeyDown` ou ligação por `id`, usar o primeiro que servir:

1. HTML nativo (`<button>`, `<a href>`, `<select>`, `<details>`, `<input type="file">`);
2. componente em `src/client/ui/` (shadcn sobre Base UI);
3. primitivo do Base UI que ainda não copiamos;
4. React Aria, plano B por componente ([ADR 0012](adr/0012-shadcn-base-ui-com-tailwind.md)).

| Precisa de | Usar | Não fazer | No UI SDK (referência) |
|---|---|---|---|
| Código por SMS | `input-otp` | `<input>` cru filtrando dígito | `otp-input` |
| Rótulo, ajuda e erro de campo | `Field` | `id` e `aria-describedby` à mão | `field` |
| Filtro de tamanho (um só) | `ToggleGroup` | botões com `aria-pressed` e laço | `toggle` (grupo) |
| Bairro | `<select>` nativo | lista própria com `role="listbox"` | `select` |
| Botão ocupado ou em espera | `Button` com `focusableWhenDisabled` | `disabled` que tira o foco | `button` |
| Confirmação (excluir conta, desistir) | `AlertDialog` | `div` com `role="dialog"` | `alert-dialog` |
| Folha de baixo | `Drawer` | `div` fixa com toque próprio | `drawer` |
| Aviso passageiro | `Toast` | `div` com `setTimeout` | `toast` |

Fazer à mão só se nenhum servir, com o motivo no PR e o passo correspondente do roteiro TalkBack.

**UI SDK (`@ui-sdk`) é referência, não dependência**: beta de 12/11/2026 e sobrepõe o Base UI. Ler a doc para saber que comportamentos um componente precisa cobrir é bem-vindo; instalar exige rever o ADR 0012. `createAgent` e WebMCP ficam fora em qualquer caso, porque expõem a tela a agente de IA (AGENTS.md, "Nada de IA"). Fatos em [pesquisa-referencias-ui.md](descoberta/pesquisa-referencias-ui.md).

## Código por SMS

- Um só campo: `type="text"`, `inputmode="numeric"`, `autocomplete="one-time-code"`, instrução acima do campo. Componente `input-otp`.
- Sem WebOTP e sem template `@dominio #codigo` no protótipo ([ADR 0010](adr/0010-sms-pela-twilio-verify.md)).

## Landing

- Rota pública `/` do SPA, sem SEO; prévia do link por Open Graph estático no `index.html`.
- Só para quem não tem sessão. Com sessão, `/` vai direto para a lista de Posts; o `start_url` do manifest aponta para a lista, e sem sessão a lista redireciona para `/`.
- Botões: principal "Entrar com o celular" e secundário "Como funciona" (rola para a seção). Empilhados, largura total, ≥ 44 px, principal em cima. Topo só com logo e "Entrar", sem menu.
- Ordem: título curto + linha de apoio → os 2 botões → tela real em HTML (Post de exemplo com dados fictícios) → faixa de compromissos → "Como funciona" em 3 passos (publica com foto do pacote → alguém pede → vocês combinam num ponto público da Ilha) → rodapé com termos, privacidade e contato do titular. Sem eyebrow em caixa alta e sem grade decorativa.
- Da referência ([ref-landingpage.jpeg](descoberta/referencias-design/ref-landingpage.jpeg)) vale o layout, não o degradê nem a fonte de display.
- Sem prova social no lançamento. No lugar dos logos, uma faixa de compromissos: dados guardados no Brasil; foto só do pacote, nunca de pessoas; sem revenda; só precisa do celular.
- Imagens: nenhuma pessoa, nenhum bebê, nada gerado por IA. Hero com a tela real do Passaly em HTML (fundo opaco); demais imagens são fotos do fundador de pacotes reais, em AVIF/WebP com `srcset` e `loading="lazy"` abaixo da dobra. Ícones Phosphor (seção "Ícones").
- Um número agregado de Entregas, se vier, entra com piso mínimo e nome próprio no glossário.

## Rotas públicas

`/`, `/entrar`, `/termos`, `/privacidade` e a página do art. 17, § 2º, da Res. 19/2024. Todo o resto exige sessão: o visitante não vê Posts (módulo Busca da spec #2). As páginas legais ficam no mesmo SPA, com o mesmo CSP, e o rodapé da landing e a tela de cadastro apontam para elas.

## Texto de interface

- Frase direta, na segunda pessoa ("você"), no vocabulário do [GLOSSARY.md](../GLOSSARY.md): Post, Pedido, Entrega, Ponto de encontro.
- Botão diz a ação que acontece: "Publicar", "Pedir", "Confirmar entrega". Nada de "Continuar" genérico quando há uma ação concreta.
- Erro diz o que houve e o que fazer: "Código errado. Confira o SMS ou peça outro."
- Evitar os vícios de texto gerado:
  - contraste forçado ("Não é só X. É Y.");
  - promessa vaga ("a forma mais fácil", "revolucionar", "experiência única");
  - travessão em toda frase;
  - trincas de adjetivos ("simples, seguro e rápido");
  - título que explica o que a tela já mostra.
- Não prometer o que o Passaly não garante: estado e validade do pacote são declaração do Anunciante (termos de uso da spec #2).
